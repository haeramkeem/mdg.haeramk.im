---
tags:
  - terms
  - os
  - os-replacement
aliases:
  - Temporal locality
  - Spatial locality
  - Locality
date: 2024-12-03
---
> [!info]- 참고한 것들
> - [[10. Caches|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## 조만간 사용될 것임

- 일단 Locality 는 간단히 말하면 "조만간 사용될 것임" 을 뜻하는 것으로 생각하면 된다.
- *Temporal locality* 는 시간의 측면에서의 locality 를 말한다.
	- 어떤 데이터를 참조했을 때의 "시점" 을 기준으로 가까운 시간 내에 다시 접근될 것이라는 것.
	- 즉, 최근에 사용되었던 애는 조만간 다시 사용될 것이라는 예측이다.
- *Spatial locality* 는 공간의 측면에서 locality 를 말한다.
	- 어떤 데이터를 참조했을 때 이놈의 "위치" 를 기준으로 가까운 위치의 데이터를 접근할 것이라는 것.
	- 즉, 사용되었던 애의 주변에 있는 애들도 조만간 사용될 것이라는 예측이다.

### 간단 예시

![[Pasted image 20241021100533.png]]

- 따라서 위의 serial addition 에도 위의 locality 가 모두 들어간다.
	- `A` 는 인접한 entry 가 계속 접근되니까 spatial locality 이고
	- `sum` 은 같은 곳에 계속 접근하니까 temporal locality

![[Pasted image 20241021100740.png]]

- 이건 data 에만 한정된 내용이 아니다; code 에서도 이런 locality 가 적용이 된다. 가령 위의 예시에서도
	- Loop 을 도는 동안 `L3` 가 반복해서 접근되므로 이곳은 temporal locality 가 있는 것이고
	- Instruction 실행 후에는 다음 instruction 을 사용하니까 이런 점에서는 spatial locality 가 있는 것.