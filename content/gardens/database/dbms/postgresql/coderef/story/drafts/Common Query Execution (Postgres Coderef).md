---
tags:
  - database
  - db-postgresql
  - story
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

## 개요

- 본 작물에서는 PostgreSQL 에서 query processing 을 하는데에 공통적으로 실행되는 로직을 정리해 본다.

## Stack

- [[func Main (Postgres Coderef)|Main()]]
	- [[func PostmasterMain (Postgres Coderef)|PostmasterMain()]]
		- [[func ServerLoop (Postgres Coderef)|ServerLoop()]]
			- [[func BackendStartup (Postgres Coderef)|BackendStartup()]]
				- [[func BackendRun (Postgres Coderef)|BackendRun()]]
					- [[func PostgresMain (Postgres Coderef)|PostgresMain()]]

- [[func exec_simple_query (Postgres Coderef)|exec_simple_query()]]: Query 가 들어오면 여기부터 시작이 된다.
	- [[func PortalRun (Postgres Coderef)|PortalRun()]]
		- [[func PortalRunSelect (Postgres Coderef)|PortalRunSelect()]]
			- [[func standard_ExecutorRun (Postgres Coderef)|standard_ExecutorRun()]]
				- [[func ExecutePlan (Postgres Coderef)|ExecutePlan()]]
					- [[func ExecProcNode (Postgres Coderef)|ExecProcNode()]]