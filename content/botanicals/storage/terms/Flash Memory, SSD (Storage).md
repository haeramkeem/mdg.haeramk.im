---
tags:
  - Storage
  - 용어집
---
> [!info] 주로 참고한 글: [블로그 글](https://metar.tistory.com/entry/NAND-flash%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80), [어떤 회사 블로그 글](https://www.tuxera.com/blog/what-is-write-amplification-why-is-it-bad-what-causes-it/), [어떤 글](https://codecapsule.com/2014/02/12/coding-for-ssds-part-2-architecture-of-an-ssd-and-benchmarking/), [카카오 테크 블로그](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)

## 이게 무언가?

- 반도체 소자를 이용해 전기적으로 읽고 (read) 쓸 (write, program) 수 있는 저장장치를 말한다.
- 하나의 비트는 Floating-gate 트랜지스터로 구성된 셀에 저장되며 여기에 전압을 가해 비트를 읽거나 쓰게 된다.

## 특징

- SSD 는 전기 소자의 특성때문에 r/w 횟수에 제한이 있다. 자세한 것은 [[PE Cyclen Limit, Wearing-off (Storage)|PE Cyclen Limit, Wearing-off]] 를 참고하자.
- SSD 는 *block* 과 *page* 단위로 연산이 이루어 진다. 자세한 것은 [[Block Interface (Storage)|Block Interface]] 를 참고하자.

## 종류

- 셀 하나에 비트를 몇개 저장하냐에 따라 종류가 나뉜다
	- 많이 저장하면 당연히 더 좋은게 아니겠는가 생각할 수 있지만, 기숙사랑 비슷한 느낌으로 생각하면 된다. 1인실이 제일 좋고 다인실 일수록 별로지만 가격은 싸다.
	- 마찬가지로, 셀에 비트가 적게 담길수록 성능은 좋지만 가격은 비싸지게 된다.
	- 이는 전략적으로 사용하면 R/W 가 많은, 성능이 중요한 hot storage 에는 1인실 (SLC), R/W 는 비교적 적은 용량이 중요한 cold storage 에 는 다인실 (TLC) 로 구성할 수 있을 것이다.
- 갯수에 따라 (Single, Multiple, Triple, Quadra) Level Cell (SLC, MLC, TLC, QLC) 로 구분할 수 있다.
- 각각의 성능 비교는 카카오 테크 블로그 글에서 가져와 봤다:

![[Pasted image 20240313211934 1.png]]
> [출처](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)

## 구조

![[Pasted image 20240313213520 1.png]]
> [출처](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)

### Host Interface

- *Host Interface* 로 부터 호스트 (가령 OS) 의 요청이 들어오게 된다. 조립컴 살때 종종 보이는 SATA 나 PCIe 가 여기에 속한다.
	- SATA 3.0 는 대략 550Mb/s, PCIe 3.0 는 1 lane 당 1Gb/s 의 속도를 낸다. (보통은 4, 8 lane 으로 구성된다)
	- 대부분의 SSD 는 처리 속도가 550Mb/s 보다는 크기에, SATA 3.0 을 사용하는 것은 Host Interface 에의 병목이 생기게 된다.

### SSD Controller, RAM, Flash memory package, Channel

- SSD 의 컨트롤러에도 나름의 *Processor* 와 *RAM* 이 있다.
	- *Processor* 는 명령어를 받아서 *Flash Controller* 로 보내고
	- *RAM* 은 매핑 정보를 저장하거나 캐시로 쓰인다.
- *Flash Controller* 는 실제 반도체 소자인 *Flash Memory Package* 와 *Channel* 로 연결되어 제어하게 된다.

## 벤치마킹

- SSD 의 경우 최악의 성능을 테스트하기 위해 부하를 미리 걸어 놓는 [[Pre-conditioning (Storage)|Pre-conditioning]] 을 사용하기도 한다.
	- 하지만 이것이 반드시 서비스 환경에서의 성능을 반영한다고 말할 수는 없다. 랜덤 읽기 쓰기 이기 때문에 실 서비스 환경과는 당연히 차이가 있기 때문.
	- 실 서비스의 데이터 특성을 고려한 자체개발 (in-house) 테스트 툴을 사용하는 것이 (물론 뭐 여유가 된다면) 좋다고 하더라.
- 벤치마킹을 수행할 때에는 여러 파라미터 (설정값 정도로 생각하자) 들을 주입하는데, 대표적으로는:
	- 워크로드 타입
		- "주입되는 데이터의 특성" 정도로 생각하면 된다. 데이터가 application 에서 생성하는 특정 패턴 (뭐 json log 등의) 을 따르는지, 아니면 sequential, random r/w 인지 등
	- 읽기/쓰기 비율
		- 이건 뭐 말 그대로... 읽기와 쓰기를 어떤 비율로 해서 벤치마킹을 하는지
	- 큐 길이
		- 동시성과 관련된 것이다. 동시에 몇개의 프로세스 혹은 스레드가 부하를 거는지
	- [[Data Chunk (Storage)|데이터 청크]] 길이
		- Input 혹은 output 작업 1회 수행시 처리되는 양
- 또한 이런 벤치마킹 결과는 다음과 같은 메트릭 (뭐 단위 정도로 생각하자) 으로 정량적인 결과를 산출한다:
	- [[Throughput (Storage)|스루풋 (Throughput)]]
	- [[Input Output per second (IOps) (storage)|IOps]]
	- [[Latency (Storage)|레이턴시 (Latency)]]
- 벤치마킹의 결과를 해석할 때는, (각 메트릭들은 SSD 의 성능을 각기 다른 시선에서 수치화하기 때문에) 이러한 메트릭을 정확하게 이해하고 분석하는게 좋다고 한다.