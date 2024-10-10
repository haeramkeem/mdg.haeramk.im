---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - Log
  - Undo log
  - Redo log
  - LSN
---
## Log

![[Pasted image 20241010132559.png]]
> 출처: 네이버 영어사전

- Log 는 위의 사진처럼 어떤 작업의 일지, 기록 등을 뜻하는 단어이다.
- 이와 비슷하게, [[Database Management System, DBMS (Database)|DBMS]] 에서 *Log* 는 DBMS 가 작업한 것에 대한 기록이고, 따라서 [[Transaction, ACID (Database)|Transaction]] 이 수행한 operation 들이 sequential 하게 파일에 저장된다.
	- 각 log entry 에는 *Log Sequence Numer* (*LSN*) 라 불리는 증가하는 ID 가 붙는다.
	- 즉, LSN 이 더 큰 log entry 는 그렇지 않은 것에 비해 최신의 log 인 것.
- Log 는 *Undo log* 와 *Redo log* 가 있다. 각각에 대해 알아보자.

## Redo Log: Ctrl + Y

- 말 그대로 "이후 상태로 복원하기 위한 로그" 이다.
- 따라서 "이후 상태" 를 로깅해놓고, recovery 시에 이 *Redo Log* 를 보면서 이후 상태로 되돌리게 된다.
- 이놈이 사용되는 대표적인 사례는 committed transaction 을 복구할 때이다.
	- [[FORCE, NO_FORCE Policy (Database Recovery)|NO_FORCE]] 정책에서는 commit 이 항상 disk 에 저장되지는 않기 때문에, crash 시에 committed transaction 을 이 redo log 를 보면서 transaction 이 정상적으로 끝난 상태로 되돌리게 된다.

## Undo Log: Ctrl + Z

- 말 그대로 "이전 상태로 되돌리기 위한 로그" 이다.
- 따라서 update 를 할 때 "이전 상태" 를 로깅하고, recovery 시에 이 *Undo Log* 를 보면서 이전 상태로 되돌리게 되는 것.
- 대표적으로는 transaction rollback 에 이놈이 사용된다.
	- Transaction rollback 을 하면 transaction 이전 상태로 되돌려야 하기 때문에, 이놈을 보면서 되돌리는 것.
	- [[STEAL, NO_STEAL Policy (Database Recovery)|STEAL]] 정책에서는 commit 되지 않은 update 가 flush 될 수 있기 때문에, tx failure 시에 이런 flush 된 애들까지 되돌리기 위해 *Undo log* 가 필요하다.


