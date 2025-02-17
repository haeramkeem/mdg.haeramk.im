---
tags:
  - database
  - db-postgresql
aliases:
  - Postmaster
  - Postgres Server
date: 2025-02-11
---
> [!info]- 참고한 것들
> - [공문 (v15)](https://www.postgresql.org/docs/15/app-postmaster.html)
> - [공문 (wiki)](https://wiki.postgresql.org/wiki/Backend_flowchart)

## Postgres Server Process

- *Postmaster* 는 Postgres 의 server process 를 의미하는데,
- 이 용어는 *DEPRECATE* 되었댄다. 따라서 요즘은 server process 를 *Postmaster* 대신 그냥 `postgres` 라고 한다.
- 근데 코드를 보다 보면 `postmaster` 라는 말이 시도때도 없이 나오는데, 이놈은 Postgres server process 에 대한 startup 과 termination 을 담당하는 component 이다.
	- 이놈은 shared memory 를 만들고 connection waiting loop 으로 진입한다.
	- 그리고 connection 이 도착하면 [[type Backend (Postgres Coderef)|Backend]] 가 시작되고 connection 이 이쪽으로 전달된다고 한다.
	- 이놈에 대한 main 함수 (entrypoint) 는 [[func PostmasterMain (Postgres Coderef)|PostmasterMain()]] 이다.