---
tags:
  - terms
  - storage
date: 2024-04-06
---
## 뭘까

- 일단 데이터는 수정 빈도에 따라 종류를 두가지 정도로 나눌 수 있다.
	- 자주 바뀌지 않는 *cold data (static data)*
	- 자주 변경되는 *hot data (dynamic data)*
- 이러한 구분에 따라 [[Write Amplification, WA and Write Amplication Factor, WAF (Storage)|WAF]] 를 줄이기 위해 다음과 같은 전략을 짤 수 있다.
	- Hot data 와 cold data 가 같은 page 에 있을 경우 hot data 가 rewite 될 때 cold data 까지 옮겨지게 된다.
	- 만일 cold data 를 별도의 page 에 모아두면 이 page 들은 rewrite 되지 않으므로 invalid page 가 비교적 적어지게 된다.
		- 이렇게 생각하면 쉽다: hot data 가 많은 page 에 분산되어 있는가 아니면 적은 page 에 밀집되어 있는가 - 당연히 밀집되어 있을 때 rewrite 시 적은 page 가 invalid 처리된다.
	- Page 단위가 아닌, block 단위에서도 동일하게 적용할 수 있다.
		- 즉, block 에 hot page 와 cold page 가 섞여있을 때 보다 이들이 별도의 block 에 분리되어 있게 되면 hot block 에 있는 valid (즉, cold) page 가 적어지기에 옮겨야 할 page 가 줄어들어  [[Garbage Collection, GC (Storage)|GC]] 시에 이점을 보게 된다.
	- 즉, GC 를 비교적 적게 실행할 수 있게 하고, 따라서 WA 도 개선된다.
- 물론 이렇게 하면 cold data page 와 hot data page 간에 [[Wear Leveling (Storage)|wear level]] 에 다소 차이가 생긴다는 문제점이 있긴 하다.
	- 이를 위해 cold data page 와 hot data page 들을 주기적으로 swap 해주기도 한다. (물론 이것 또한 WA 를 증가시킨다.)
- 다만 [[Flash Translation Layer, FTL (Storage)|FTL]] 입장에서는 어떤 데이터가 cold 인지 hot 인지 구분하기 힘들기 때문에, host level 에서 제어를 해야 된다.
