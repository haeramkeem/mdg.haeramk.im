---
tags:
  - terms
  - database
aliases:
  - Write ahead log
  - WAL
date: 2024-10-10
---
> [!info]- 참고한 것들
> - [미디엄 블로그 ARIES 포스팅](https://medium.com/@vikas.singh_67409/algorithms-for-recovery-and-isolation-exploiting-semantics-aries-d904765fb9b8)

## Write "Ahead" Log

- 제곧내이다: Write 하기 "전에 (Ahead)" [[Log (Database Recovery)|Logging]] 을 하는 것.
- 즉, logging 을 먼저 하고 [[Page (Database Storage)|Page]] write 를 하라는 것.
- 이러면 page write 도중에 crash 가 나더라도 관련 log 가 disk 에 있기 때문에, recovery 를 하던 rollback 을 하던 할 수 있다.
- 또한, 유사한 맥락으로 이 log 가 disk 로 내려간 다음에서야 관련 [[Transaction, ACID (Database)|Transaction]] 들이 commit 되었다고 인정받는다.