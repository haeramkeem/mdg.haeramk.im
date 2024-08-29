---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - FORCE
  - NO_FORCE
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/37861999)
> - [미디엄 블로그](https://medium.com/@vikas.singh_67409/algorithms-for-recovery-and-isolation-exploiting-semantics-aries-d904765fb9b8)

## Persistent before commit

- *FORCE* 정책은 매 commit 에 transaction 과 관련된 data 를 storage 로 flush 하는 것을 의미한다.
	- 즉, commit success 를 응답하기 전에 data 가 storage 에 저장될 수 있게 하는 것.
- *NO_FORCE* 정책은 그와 반대이다; commit 되더라도 data 가 storage 에 저장되지 않을 수도 있는 것.
- 즉, *FORCE* 정책을 사용하게 되면 data durability 는 보장되지만 매 commit 에 IO 가 수반되므로 느려질 수 있다.
	- *NO_FORCE* 는 반대라고 생각하면 된다; durability 는 보장되지 않지만 commit overhead 가 줄어든다.
- 정리하면,

|          | FORCE               | NO_FORCE            |
| -------- | ------------------- | ------------------- |
| **PROS** | High durability     | Fast commit process |
| **CONS** | Slow commit process | Low durability      |