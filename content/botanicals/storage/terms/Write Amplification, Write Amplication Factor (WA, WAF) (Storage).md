---
tags:
  - 용어집
  - Storage
---
> [!info] 출처: [어느 회사 사이트](https://www.tuxera.com/blog/what-is-write-amplification-why-is-it-bad-what-causes-it/), [위키피디아](https://en.wikipedia.org/wiki/Write_amplification)

## 쓰기 작업 (write) 이 증폭 (amplification) 되는 것

- 뭐 비유를 해보자면 난 100만원을 입금했는데 실제로는 150만원이 입금되는 거다.
	- 이렇게 비유하면 개꿀이네 싶지만 스토리지 입장에서는 원하지 않은 작업이 이루어지는 것이기 때문에 당연히 손해다.
- 지금의 [[Flash Memory, SSD (Storage)|SSD]] 에는 이것이 성능 저하의 중요한 원인으로 손꼽히고 있다고 한다.
	- 옛날 HDD 시절에도 Write Amplification 문제가 있었지만, 별로 중요한 문제는 아니었다.

## WA 로 인해 발생하는 문제

- WA 로 인해 추가적인 쓰기 작업이 발생한다는 것은 두 문제점을 초래한다:
	1. 수명 단축: NAND 플래시 메모리는 [[PE Cyclen Limit, Wearing-off (Storage)|PE Cycle Limit]] 이 있기 때문에 당연히 수명이 짧아질 수 밖에 없다.
	2. 성능 저하: 그만큼 대역폭을 소모하는 등의 퍼포먼스 저하가 발생하게 된다.

## WA 가 발생하는 이유들

### File system operations

- 보통 파일시스템은 파일의 데이터 뿐 아니라 메타데이터 (이름, 권한, 생성/변경 시간 등) 도 같이 저장한다.
- 그럼 당연히 이 메타데이터를 어딘가에 저장해야 될 것이기에 WA 가 발생하게 된다.
- 다만 이건 OS 의 영역에서 핸들링하는 부분이기에 넓게 보면 WA 가 맞지만 Storage 관점에서 보면 내 알바 아니다.

### Garbage collection

- NAND 플래시에서는 write 하기 위해 [[Garbage Collection (GC) (Storage)|GC]] 가 수행되기도 하는데
- 이때 invalid block 들을 옮기는 작업 때문에 추가적인 write 가 발생하게 되고, 따라서 WA 가 발생하게 된다.
- 이를 해결하기 위해 다음과 같은 기술들이 도입되었다고 한다... ([출처](https://nvmexpress.org/wp-content/uploads/Hyperscale-Innovation-Flexible-Data-Placement-Mode-FDP.pdf))
	- ~1991 년: [[Over Provisioning (OP) (Storage)|Over Provisioning]]
	- ~2007-2008 년: [[TRIM, Deallocation (Storage)|TRIM, Deallocation]]
	- 2022 년: [[Zoned Namespaces (ZNS) (Storage)|ZNS]], [[Flexible Data Placement (FDP) (Storage)|FDP]]

### Wear leveling

- [[Wear Leveling (Storage)|Wear Leveling]] 도 WA 를 증가시킬 수 있다고 한다.
	- 데이터가 여러 block 에 분산되어 저장된다는 것은 그만큼 데이터 rewrite 시에 invalid 로 마킹되는 page 들이 여러 block 들에 분산된다는 것이고, 따라서 [[Garbage Collection (GC) (Storage)|GC]] 를 수행할 때 더 많은 page 들을 이동시켜야 하기 때문.
		- 좀만 생각해보면 당연하다: GC 는 어찌보면 invalid page 들을 모아서 지우는 것이기 때문에 invalid page 들이 한 블럭에 이미 모여있으면 옮겨야 할 page 가 더 적어지기 때문이다.
	- 또한 Wear Leveling 방식에 따라 위와는 다른 이유로 데이터를 옮겨야 할 수도 있다.
- 즉 Wear Leveling 과 WA 사이에는 어느정도의 trade-off 가 있는 것.
- 따라서 조금이라도 WA 를 줄이기 위해 아래와 같은 방법을 사용할 수 있다.
	- 일단 데이터는 수정 빈도에 따라 종류를 두가지 정도로 나눌 수 있다.
		- 자주 바뀌지 않는 *cold data (static data)*
		- 자주 변경되는 *hot data (dynamic data)*
	- 이러한 구분에 따라 WA 를 줄이기 위해 다음과 같은 전략을 짤 수 있다.
		- Hot data 와 cold data 가 같은 page 에 있을 경우 hot data 가 rewite 될 때 cold data 까지 옮겨지게 된다.
		- 만일 cold data 를 별도의 page 에 모아두면 이 page 들은 rewrite 되지 않으므로 invalid page 가 비교적 적어지게 된다.
			- 이렇게 생각하면 쉽다: hot data 가 많은 page 에 분산되어 있는가 아니면 적은 page 에 밀집되어 있는가 - 당연히 밀집되어 있을 때 rewrite 시 적은 page 가 invalid 처리된다.
		- 이는 GC 를 비교적 적게 실행할 수 있게 하고, 따라서 WA 도 개선된다.
	- 물론 이렇게 하면 cold data page 와 hot data page 간에 wear level 에 다소 차이가 생긴다는 문제점이 있긴 하다.
		- 이를 위해 cold data page 와 hot data page 들을 주기적으로 swap 해주기도 한다. (물론 이것 또한 WA 를 증가시킨다.)
	- 다만 [[Flash Translation Layer (FTL) (Storage)|FTL]] 입장에서는 어떤 데이터가 cold 인지 hot 인지 구분하기 힘들기 때문에, host level 에서 제어를 해야 된다.

### Block Interface

- SSD 의 [[Block Interface (Storage)|Block Interface]] 도 WA 를 유발한다.
- 즉, write 작업은 page 단위로 이루어 지기 때문에, 데이터의 크기가 page 사이즈에 딱 맞지 않으면 비는 만큼 불필요한 write 가 발생하는 것.
	- 이러한 것을 방지하기 위해 page 크기에 맞게 데이터의 크기를 맞추거나 (*Align writes*), 아니면 여러 데이터를 합쳐서 쓰는 방법 (*Buffer small writes*) 을 사용하기도 한다고 한다.

### Read Disturb

- [[Read Disturb (Storage)|Read Disturb]] 현상 때문에 block 을 종종 옮겨줘야 하고, 이것은 마찬가지로 추가적인 GC 와 WA 증가를 유발한다.

## Write Amplification Factor (WAF)

- WA 의 정도를 나타내는 수치로 WAF (Write Amplification Factor) 를 사용한다.
- 이것은 "배수" 로 생각하면 된다. 즉, WAF 가 2라면 실 데이터의 2배 양의 write 가 발생한다는 것.
	- 따라서 1보다 작아질 수는 없다. (더 적은 양의 write 가 발생할 수는 없으므로)
- 일반적인 SSD 에서는 이 수치가 4를 넘어가기도 하며, 이 문제를 해결하기 위해 등장한 [[Zoned Namespaces (ZNS) (Storage)|ZNS]] 가 이론적으로는 WAF 가 1이라고 한다.