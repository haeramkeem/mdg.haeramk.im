---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - Physiological Logging
---
## Physical + Logical Logging

- [[Physical Logging (Database Recovery)|Physical Logging]] 에서는 빠른 복구의 장점과 많은 저장 공간의 단점이 있었고
- [[Logical Logging (Database Recovery)|Logical Logging]] 에서는 적은 저장 공간의 장점과 느린 복구의 단점이 있었기 때문에
- 이 둘의 장점을 취한 방법이 Physical + Logical Logging, 즉 *Physiological Logging* 이다.
- 여기서는
	- [[Logical Logging (Database Recovery)|Logical Logging]] 처럼 어떤 작업을 했는지 로깅하고
	- [[Physical Logging (Database Recovery)|Physical Logging]] 처럼 before, after image 를 로깅하되 block 이나 page 전체가 아닌 그것의 내부에서 실제로 변경된 부분만을 로깅한다.
- 아마 어떤 작업인지와 before, after 에 대한 partial image 를 로깅하지 않을까.