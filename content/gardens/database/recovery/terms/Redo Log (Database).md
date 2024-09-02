---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - REDO
---
## Ctrl + Y

- 말 그대로 "이후 상태로 복원하기 위한 로그" 이다.
- 따라서 "이후 상태" 를 로깅해놓고, recovery 시에 이 *Redo Log* 를 보면서 이후 상태로 되돌리게 된다.
- 이놈이 사용되는 대표적인 사례는 committed transaction 을 복구할 때이다.
	- [[FORCE, NO_FORCE (Database)|NO_FORCE]] 정책에서는 commit 이 항상 disk 에 저장되지는 않기 때문에, crash 시에 committed transaction 을 이 redo log 를 보면서 transaction 이 정상적으로 끝난 상태로 되돌리게 된다.