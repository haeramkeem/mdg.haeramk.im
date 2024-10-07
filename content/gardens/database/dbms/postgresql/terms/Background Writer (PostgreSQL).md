---
tags:
  - database
  - db-postgresql
date: 2024-09-30
aliases:
  - Background Writer
  - bgwriter
---
> [!info]- 참고한 것들
> - [[Lab 03. Shared Buffer|서울대 정형수 교수님 BKMS 강의 (Fall 2024)]]

## 란?

- 이놈은 주기적으로 [[Shared Buffer (PostgreSQL)|Shared Buffer]] 을 검사해서 [[Page (PostgreSQL)|page]] 를 disk 로 flush 해주는 오브젝트이다.
	- 아마 별도 thread 로 돌아가고 있을듯?

### 설정

- `postgresql.conf` 에서 관련 설정은:

![[Pasted image 20240930094239.png]]

- 각 항목이 의미하는 것은:
	- `bgwriter_delay`: 얼마나 자주 내릴 것이냐
	- `bgwriter_lru_maxpages`: 한번에 최대 몇개를 내릴 것이냐
	- `bgwriter_lru_multiplier`: 내리는 page 들의 목표 개수를 정하는 기준
	- `bgwriter_flush_after`: OS 에서 page 를 flush 하는 기준
- `bgwriter_delay`, `bgwriter_flush_after` 가 작을 수록, `bgwriter_lru_maxpages`, `bgwriter_lru_multiplier` 가 클수록 자주 flush 된다.
- 이 설정들은 `psql` 에서 `SHOW` 명령어로 확인하면 된다.

![[Pasted image 20240930094427.png]]