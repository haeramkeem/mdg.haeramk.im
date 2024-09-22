---
tags:
  - storage
  - terms
date: 2024-03-30
---
> [!info]- 참고한 것들
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/16/coding-for-ssd-part-4/)

## 초과해서 (Over) 공급하다 (Provisioning)

- 간단하게 말하면 Host 에서 사용할 수 있는 공간의 크기보다 더 큰 공간을 물리적으로 구성해 놓는 것이다.
	- 즉, [[Logical Block Addressing, LBA (Storage)|LBA]] 공간보다 더 큰 공간을 PBA 공간으로 잡아 놓는 것.
- 여러 이유에서 이러한 짓을 한다.

## 이유

### 1. 단위의 차이

- 일반 사용자들은 1000 단위 (KB, MB, GB 등) 에 더 익숙하지 1024 단위 (KiB, MiB, GiB 등) 에는 별로 익숙하지 않다.
- SSD 는 1024 단위로 제작되기에, 이것을 1000 단위로 변경하면 그만큼 공간이 남게 된다.
	- 128GB 에 비해 128GiB 는 용량이 7.37% 정도 더 크다. (직접 계산해 보시라)

### 2. 여러가지 효율성

- PBA 를 더 크게 잡아 놓는 것은 이제부터 설명할 여러 점에서 성능 향상에 도움이 된다.
	- 제조사들은 이러한 이점때문에 실제로는 128GiB 를 만들어 놓고 100GB 라고 하거나 아니면 (삼성처럼) OP 공간을 직접 늘릴 수 있도록 제조하기도 한다.
	- SSD 에서 자체 지원하지 않더라도 사용자가 필요에 따라 이 공간을 늘릴 수 있다: 디스크 파티셔닝할 때 적은 공간을 파티션하면 남는 공간은 자동으로 OP 공간으로 사용된다.
- 이렇게 남는 공간은 Host 에서는 보이지 않지만 SSD Controller 에서는 보이고, 따라서 SSD Controller 에 의해 이 공간을 성능 향상을 위해 활용하게 된다.

### 3. 수명 연장

- 이 공간은 [[PE Cyclen Limit, Wearing-off (Storage)|PE Cycle Limit]] 을 극복하는데 사용될 수 있다.
- 즉, LBA 에 연결된 PBA 공간의 일부 block 이 수명이 다 했을 경우, SSD Controller 는 OP 공간에 있는 block 으로 PBA 공간을 매핑해 수명이 다한 block 을 대체하게 된다.

### 4. Write Throughput 향상

- Random write 부하가 걸리는 상황에서는 free page 소진 속도가 [[Garbage Collection, GC (Storage)|GC]] 로 생성해 내는 free page 생성 속도보다 빠르기 때문에 성능 저하가 나타나게 된다.
- 이때 OP 공간의 free page 를 버퍼처럼 사용해 GC 가 free page 를 생성하는 시간을 벌어 성능 저하를 감소할 수 있게 된다.
- 또한 [이 친구](https://codecapsule.com/2014/02/12/coding-for-ssds-part-4-advanced-functionalities-and-internal-parallelism/) 는 비록 추측이긴 하지만 이 OP 가 [[TRIM, Deallocation (Storage)|TRIM]] 처럼 작용해 성능이 향상될 수 있다고 한다.
	- Random write 부하가 걸려 OP 공간까지 활용해 ssd 가 100% 사용되더라도 다시 부하가 낮아져 OP 공간을 사용할 필요성이 없어지면 OP 공간은 LBA 와 매핑되지 않은 공간이기 때문에 TRIM 으로 invalid 공간을 inform 받지 않고서도 invalid 하다고 판단할 수 있을 것이고, 따라서 GC 효율성과 [[Write Amplification, WA and Write Amplication Factor, WAF (Storage)|WA]] 감소에 도움이 될 것이라는 것.
