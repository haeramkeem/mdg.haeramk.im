---
tags:
  - database
  - db-postgresql
aliases:
  - BackendStartup()
date: 2024-11-23
---
## Overview

- [[Postgres Server, Postmaster (PostgreSQL)|Postmaster]] 에서 [[Backend (Postgres)|Backend]] process 를 fork 하는 함수이다.

## Line ref

### v16.4

> [!info]- 코드 위치 (v16.4)
> - Location
> ```
> src/backend/postmaster/postmaster.c:4116
> ```
> - Link: [BackendStartup()](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4108-L4230)

- [L4121-L4132](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4121-L4132): [[type Backend (Postgres Coderef)|Backend]] 구조체를 생성한다.
- [L4134-L4163](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4134-L4163): Random cancel key 를 생성하는 등의 [[type Backend (Postgres Coderef)|Backend]] 구조체를 초기화한다.
- [L4165-L4168](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4165-L4168): `fork()` 로 backend process 를 fork 한다.
	- `4166`: 여기의 `backend_forkexec()` 은 Windows 운영체제에는 `fork()` syscall 이 없기 때문에 해당 기능을 수행해 주는 함수라고 생각하면 된다.
- [L4169-L4193](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4169-L4193): `fork()` 된 child process (즉, `pid` 가 `0`) 에서의 logic 이다.
	- `4168-4177`: Backend 는 postmaster 와 별개의 process 이기 때문에 postmaster 가 사용하던 자원들을 정리해 준다
	- `4179-4192`: Backend initiation 작업을 해주고 [[func PostgresMain (Postgres Coderef)|BackendRun]] 으로 backend 를 시작한다.
- [L4196-L4209](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4196-L4209): `fork()` 한 parent process 에서의 logic 인데, `fork()` 를 실패했을 때의 logic 이다 (즉, `pid` 가 음수).
	- 여기서는 뭐 error message 를 출력하고 `STATUS_ERROR` 를 return 하는 것으로 끝난다.
- [L4211-L4229](https://github.com/postgres/postgres/blob/REL_16_4/src/backend/postmaster/postmaster.c#L4211-L4229): 여기는 parent process 에서 `fork()` 에 성공했을 때의 logic 이다 (즉, `pid` 가 양수).
	- `4211-4214`: Log message 출력
	- `4216-4222`: `4121` 번째 줄에서 생성한 `Backend` 구조체의 값들을 설정해주고
	- `4224-4227`: 그 구조체를 array 에 추가한다.
		- 이것은 모든 [[Backend (Postgres)|Backend process]] 를 [[Postgres Server, Postmaster (PostgreSQL)|Postmaster process]] 에서 관리하기 위함이다.
		- Postmaster 는 이 주소공간을 통해 문제가 생긴 backend process 를 정리해주는 작업을 하되,
		- 정상적인 경우에는 이 주소공간을 절대 건드리지 않는다.

### v17.1

> [!warning]- 이 부분은 #draft 상태입니다.
> - [ ] 내용 정리

> [!info]- 코드 위치 (v17.1)
> - Location
> ```
> src/backend/postmaster/postmaster.c:3544
> ```
> - Link: [BackendStartup()](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/postmaster/postmaster.c#L3536-L3630)

- [L3593-L3595](https://github.com/postgres/postgres/blob/REL_17_1/src/backend/postmaster/postmaster.c#L3593-L3595): `v17.1` 에서는 여기서 [[func PostgresMain (Postgres Coderef)|BackendRun()]] 이 아닌 [[func BackendMain (Postgres Coderef)|BackendMain()]] 을 호출해서 [[func PostgresMain (Postgres Coderef)|PostgresMain()]] 으로 들어간다.