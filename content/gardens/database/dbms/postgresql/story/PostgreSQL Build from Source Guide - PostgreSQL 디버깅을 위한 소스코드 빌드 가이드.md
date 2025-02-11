---
tags:
  - database
  - db-postgresql
date: 2024-11-20
---
> [!info]- 참고한 것들
> - [공문](https://www.postgresql.org/docs/current/install-make.html)
> - [스댕: ICU lib](https://stackoverflow.com/a/78478841)
> - [스댕: readline lib](https://askubuntu.com/a/89394)
> - [스댕: zlib](https://askubuntu.com/a/1169769)
> - [스댕: flex, bison](https://stackoverflow.com/a/33623423)
> - [기본 접속 정보](https://postgresql.kr/docs/9.5/manage-ag-createdb.html)

> [!tip]- 설치한 버전
> [Release 16.4](https://github.com/postgres/postgres/releases/tag/REL_16_4)

## 디버깅을 위한 설치

- 일단 디버깅을 위해 system 은 최대한 안건드리고, portable 할 수 있게 설치하고자 했다.
	- 그래야 디버깅하는 와중에서 자주 빌드하는데 편할 것 같아서
- 우선 설치해야 할 것들

```bash
sudo apt-get install -y build-essential libicu-dev pkg-config libreadline-dev zlib1g-dev bison flex
```

- Autoconf 로 기본 설정

```bash
mkdir -pv ./env/data
./configure --disable-rpath --prefix `pwd`/env --enable-debug
```

- 컴파일, 설치

```bash
make
make install
```

- 여기서는 dynamic lib 들이 전부 저 `env/lib` 에 설치된다. 그래서 이 lib path 를 지정해 줘야됨.
	- 보면 알겠지만 `export` 이기 때문에 shell 을 다시 시작하면 다시 해줘야 한다.
	- 매번 하는게 귀찮아도 여기서는 debugging 이 목적이니까 일단 해주자.

```bash
export LD_LIBRARY_PATH=`pwd`/env/lib
```

- 그리고 이렇게 하면 server 가 시작된다.

```bash
./env/bin/initdb -D ./env/data
./env/bin/pg_ctl -D ./env/data -l logfile start
```

- 그리고 이렇게 해서 session 을 열면 된다.
	- 기본적인 username 은 `postgres` 인데, 굳이 입력하지 않아도 된다.
	- 그리고 기본적인 database name 도 `postgres` 이다. 아래에 `postgres` 가 이거임

```bash
./env/bin/psql postgres
```

## GDB 붙이기

- Postgres 는 thread based 가 아니고 process based 이기 때문에, client request 가 들어오면 idle process 에서 이것을 처리한다.
- 그래서 [[디버깅 시작하기 (gdb, lldb)|process 에 gdb 붙이기 가이드]] 에서 말한 것을 이용하면, 다음과 같이 `gdb` 를 붙일 수 있다.

```bash
gdb -p `ps -x | grep postgres | grep idle | awk '{print $1}'`
```

- 다만 idle process 가 없을 수 있다; 평소에는 idle process 를 미리 만들어 놓는데, 한동안 request 가 안들어오면 지워버리는듯
	- 이때는 SQL 을 하나 때려서 idle process 가 생성되도록 한 뒤 위 명령어로 `gdb` 를 붙이면 된다.