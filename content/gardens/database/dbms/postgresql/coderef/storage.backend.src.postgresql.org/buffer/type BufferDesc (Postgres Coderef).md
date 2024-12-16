---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - BufferDesc
---
> [!info]- 코드 위치 (v16.4)
> - File path
> ```
> src/include/storage/buf_internals.h
> ```
> - Line: `244`
> - Link: [struct BufferDesc](https://github.com/postgres/postgres/blob/REL_16_4/src/include/storage/buf_internals.h#L197-L255)

## Overview

- 이놈은 하나의 buffer entry 에 대한 metadata 이다.
- Field 들을 몇개만 살펴보자.

## Fields

- `tag`: 이것은 해당 buffer 에 있는 page 가 어떤 page 인지를 식별하기 위한 tag 이다.
	- 요약하자면 여기에는 table 의 id (`relNumber`), page id (`blockNum`) 등이 담겨 각 page 를 식별한다.
	- 소스코드: [struct BufferTag](https://github.com/postgres/postgres/blob/REL_16_4/src/include/storage/buf_internals.h#L80-L99)
- `state`: 이건 여러 정보를 담고 있는 `uint32` 값이다.
	- Buffer 를 관리하기에는 여러가지의 counter 가 필요한데, 이 counter 들에 대해 각각의 변수를 사용하지 않고 (각 counter 들의 값은 그리 크지 않기 때문에) 여기에다가 다 낑가놓는다.
	- 그래서 여기에는 (1) 여러 flag 들, (2) Reference count - 즉, 현재 사용중인 놈이 몇놈인지, (3) Usage count - 즉, 지금까지는 몇놈이 사용됐는지
- `freeNext`: [[type BufferStrategyControl (Postgres Coderef)|BufferStrategyControl]] 에 freelist 의 head, tail 이 담긴다고 했었는데, 이놈을 통해 다음 free buffer 를 연결해 주어 linked list 가 된다.