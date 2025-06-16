---
tags:
  - database
  - db-duckdb
date: 2025-06-16
---
> [!info]- 참고한 것들
> - 

> [!tip]- 설치한 버전
> - [v1.3.0](https://github.com/duckdb/duckdb/releases/tag/v1.3.0)

## TL;DR

- DuckDB 는 [SQLite](https://github.com/sqlite/sqlite) 처럼 self-contained DBMS 이기 때문에 빌드가 별로 어렵지 않다.
- 그냥 이렇게 하면 된다:

```bash
make debug
```

- 이렇게 하면 `./build/debug/duckdb` 에 binary 가 빌드되고
- 그냥 이놈을 [[gdb - 디버깅 시작하기|gdb]] 로 실행시키면 된다.

```bash
./build/debug/duckdb
```

- 이때 원하는 곳에 breakpoint 걸고 돌리고 씹고 뜯고 맛보고 즐기면 되는데
- 문제는 DuckDB 는 thread 가 여러개 돌기 때문에 breakpoint 하나만 걸어도 여러개가 걸려버린다는 것이다.
- 이걸 해결하기 위해서는 [[gdb - Thread 디버깅하기|여기]] 에서 말한것 처럼 thread scheduling 을 고정시켜버리는 것이다.

```
set scheduler-locking step
```