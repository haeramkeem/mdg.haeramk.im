---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - UNDO
---
## Ctrl + Z

- 말 그대로 "이전 상태로 되돌리기 위한 로그" 이다.
- 따라서 update 를 할 때 "이전 상태" 를 로깅하고, recovery 시에 이 *Undo Log* 를 보면서 이전 상태로 되돌리게 되는 것.
- 대표적으로는 transaction rollback 에 이놈이 사용된다.
	- Transaction rollback 을 하면 transaction 이전 상태로 되돌려야 하기 때문에, 이놈을 보면서 되돌리는 것.