---
tags:
  - database
  - db-transaction
date: 2024-07-18
aliases:
  - Transaction
  - Tx
  - Commit
  - Abort
---
> [!info]- 참고한 것들
> - [어떤 미디엄 블로그](https://chrisjune-13837.medium.com/db-transaction-%EA%B3%BC-acid%EB%9E%80-45a785403f9e)

## Transaction

- *Transaction* 은 DB의 상태를 변화시키는 "논리적 기능의 작업 단위" 라 할 수 있다.
	- “논리적 기능의 작업단위" 이기 때문에 하나의 연산뿐 아니라 여러개의 연산이 하나의 기능을 위해 수행된다면 transaction 을 구성할 수 있다.
	- 또한 회복 (Recovery) 과 병행 제어 (Concurrency) 에 있어서도 하나의 단위가 된다.
- Transaction 이 지켜야 되는 4가지 속성을 [[ACID (Database Transaction)|ACID]] (Atomicity, Consistency, Isolation, Durability) 라고 부른다.

### State Diagram

![[Pasted image 20250909093805.png]]
> 출처: [긱](https://www.geeksforgeeks.org/dbms/transaction-states-in-dbms/)

- *Active* 는 트랜잭션이 실행되고 있는 상태 (RUNNING) 이고
- *Partially Committed* 는 트랜잭션의 모든 연산이 끝나고 Commit 하기 바로 직전의 상태
- *Committed* 는 Commit 까지 완료된 상태
- *Terminated* 는 트랜잭션이 종료된 상태
- *Failed* 는 Commit 하기 전에 어떠한 이유에서든 그리고 어떤 것이든 실패했을 때의 상태
- *Aborted* 는 Failed 이후 Rollback 되어 전부 취소된 상태를 의미한다