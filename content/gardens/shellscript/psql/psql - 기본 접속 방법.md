---
tags:
  - shellscript
  - bash-psql
date: 2024-09-23
---
> [!info]- 참고한 것들
> - [스댕](Source: https://stackoverflow.com/a/6405296)

## TL;DR

```bash
psql -h ${DB_HOST} -p ${DB_PORT} -U ${USERNAME}
```

- 옵션 설명
	- `-h`: DB hostname (IP, 도메인 등 endpoint)
	- `-p`: Port (기본적으로는 `5432`)
	- `-U`: DB username
- 추가 옵션
	- `-c`: Command (`psql` 세션에서 실행할 명령어를 이 옵션으로 지정할 수 있다.)

### `psql` 에 비밀번호 넣기

- 위 명령어를 사용하면 비밀번호를 물어본다.
- 근데 (위험하긴하지만) 그냥 `psql` 명령어에 비밀번호를 넣고싶다면?

```bash
psql -h ${DB_HOST} -p ${DB_PORT} -c "PGPASSWORD=$PASSWORD psql -U $USERNAME $DATABASE"
```