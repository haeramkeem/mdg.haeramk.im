---
tags:
  - database
  - db-postgresql
date: 2024-11-05
aliases:
  - Buffer
---
> [!info] 코드 위치
> - File path
> ```
> src/include/storage/buf.h
> ```
> - Line: `23`
> - Link: [int Buffer](https://github.com/postgres/postgres/blob/REL_16_4/src/include/storage/buf.h#L17-L23)

## Overview

- 이건 [[C - Struct|struct]] 가 아니고 단순히 `int` 값인데
- 각 buffer entry (in-memory page 공간) 에 대한 index 값이다.
	- 즉, 이 Index 를 가지고 하나의 buffer entry 에 접근할 수 있는 것.
- 사용되는 값은 `1` 부터이다. `0` 은 invalid 임.