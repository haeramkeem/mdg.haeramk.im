---
tags:
  - shellscript
  - bash-psql
date: 2024-09-23
---
> [!info]- 참고한 것들
> - [가이드](https://www.postgresqltutorial.com/postgresql-administration/postgresql-show-tables/)

## TL;DR

- 모든 DB 출력

```bash
\l
```

- 모든 table 출력

```bash
\dt
```

- 모든 user 출력
	- `\du+`: Verbose

```bash
\du
```

- DB 세션 변경

```bash
\c SOME_DATABASE
```