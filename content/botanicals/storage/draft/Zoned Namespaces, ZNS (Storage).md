---
tags:
  - 용어집
  - Storage
---
> [!info] 참고한 자료
> - [ZNS: Avoiding the Block Interface Tax for Flash-based SSDs (USENIX ATC '21)](https://www.usenix.org/system/files/atc21-bjorling.pdf)

## 이게 뭐임

- 

## Background

### 기존 방식의 문제점 - Block Interface Tax

- 이 [[Block Interface (Storage)|Block interface]] 는 이전의 HDD 를 위해 고안된 것으로, 고정된 크기의 block 들을 1차원 배열로 묶어 사용/관리하는 방식이다.
- SSD 가 등장했을 때에는 이러한 Block interface 와의 backward-compatibility 를 위해 FTL 과 같은 레이어가 추가되었다.
- 하지만 SSD 와 HDD 는 작동 방식이 다르기에 FTL 은 여러 부작용 을 낳았다.
	- 이러한 부작용들은 *Block interface tax* 라고 부르고, 여기에는 아래와 같은 것들이 포함된다:
		- [[Garbage Collection, GC (Storage)|GC]] 오버헤드
		- GC 에서 데이터를 이동할 때 사용할 임시 저장 공간을 위한 [[Over Provisioning, OP (Storage)|OP]]
		- [[Flash Translation Layer, FTL (Storage)|FTL]] 을 위한 DRAM
		- GC 오버헤드를 줄이기 위한 Application level 의 최적화 - 에 따라 증가하는 복잡도
		- 성능을 예측하기 힘듦 (performance unpredictability)
	- 위의 자원들 중 OP 와 DRAM 은 모두 현재의 SSD 가 감수해야 하는 아주 비싼 자원들이다.

### 문제를 해결하기 위한 ZNS 의 접근

#### Zoned Storage Model

- 이러한 문제를 해결하기 위해 SSD (+ 와 SMR HDD 라고 불리는 특별 HDD) 에 맞는 인터페이스가 고안되었는데 이것이 *Zoned Storage Model* 이다.


### 기존 방식의 문제점을 해결하기 위해 이전에 시도된 것들 (History)

- Block interface tax 를 줄이기 위해 이전에는 [[Multi-stream SSD (Storage)|Stream SSD]] 와 [[Open Channel SSD, OCSSD (Storage)|Open Channel SSD]] 가 고안되었다.
	- Multi-stream SSD 의 경우에는 GC 를 줄이는데 도움은 되나, 여전히 OP 공간과 FTL 을 위한 DRAM 을 필요로 한다.
	- OCSSD 의 경우에는 GC 도 줄이고 OP 공간과 DRAM 의 필요성을 줄여주었지만, 모든 SSD 에 대응할 수 있는 인터페이스가 OS 에 구현되어야 하기 때문에 한계점이 있다.


- Block interface 를 위해 고안된 FTL 은 Host 가 LBA 에만 접근할 수 있도록 하여 Host 의 물리적인 데이터 저장 위치를 관리 권한이 박탈되었다.

## ZNS 성능 측정

![[Pasted image 20240316093233.png]]
> [출처](https://www.usenix.org/system/files/atc21-bjorling.pdf)

- 위 그림은 ZNS SSD 와 OP 가 다르게 설정된 Block SSD 두개 총 세개의 SSD 의 write throughput 을 실험한 것이다.
- 실험은 SSD 의 물리 사이즈인 2TB 데이터를 총 4번 concurrent 하게 write 하는 방식으로 진행했다. (0~2: 첫번째 write, 2~4: 두번째 write, 이런식으로 아마?)
- 첫 write 에서는 SSD 가 fresh 한 상태였기에 세 SSD 간의 성능 차이가 없었지만, 두번째 write 부터는 기존 데이터가 overwrite 되며 Block SSD 들에서 성능 저하가 나타났다.
- 또한 Block SSD 끼리 비교했을 때에는, OP 를 더 많이 설정한 SSD 가 그나마 성능 저하가 덜 나타나는 것으로 확인됐다.
- 다만 28% OP 를 먹인 SSD 의 경우에는 공간이 부족하기 때문에 write 가 6TB 을 넘어가자 더이상 기록되지 않는 것을 볼 수 있다.

## ZNS 특징

- ZNS 는 flash erase boundary 와 write ordering rule 들을 Host 에 노출시켜서 이러한 세금을 해결한다고 한다.
- NVMe Zoned Namespace Command Set Specification
- 기존의 Block interface 는 Block 을 1차원 배열로 취급해 관리했지만, ZNS 는 logical block 들을 zone 으로 묶는다
- zone 의 블럭들은 random read 는 가능하지만 무조건 sequential write 되어야 한다.
- 또한 zone 은 매 rewrite 작업때마다 erase 되어야 한다.
- ZNS SSD 는 zone 과  physical media boundary 를 정렬해서 데이터 관리를 Host 가 직접 하도록 한다?
- ZNS 는 디바이스들마다 다른 reliability 특성들과 media 관리 복잡성은 Host 로부터 감춘다?
- ZNS 는 효율적으로 erase block 을 하기 위한 책임을 Host 로 이전한다.
- LBA-PBA 매핑과 데이터 저장 위치 선정을 통합하는 것보다는 이러한 FTL 의 책임 중 일부를 Host 에 이관하는 것은 덜 효과적이다?