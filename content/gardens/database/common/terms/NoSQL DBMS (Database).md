---
tags:
  - database
date: 2025-08-18
aliases:
  - NoSQL
---
> [!info]- 참고한 것들
> - [어떤 블로그](https://blog.creation.net/459)
> - [또 다른 블로그](https://ud803.github.io/%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4/2021/11/16/RDB-vs.-NoSQL-%EC%96%B8%EC%A0%9C-%EB%88%84%EA%B5%AC%EB%A5%BC-%EC%8D%A8%EC%95%BC%ED%95%A0%EA%B9%8C/)

## NoSQL

- 이건 [[Relational Data Model (Data Model)|RDBMS]] 와는 다르게 스키마가 정해져 있지 않아 어떤 형식의 데이터든 저장할 수 있는 유연함을 가진 데이터베이스를 일컫는다.
- 근데 RDB 와 반대라기 보다는 **Not only SQL** 로 생각하는게 나을거같다: RDB 가 지원하는 기능들을 NoSQL 에서 지원해도 되고 안해도 되기 때문.
- 종류가 여러가지로 나뉠 수 있는데
	- JSON 형식의 데이터를 저장하는 방식 (MongoDB 등)
	- Key-Value 형식으로 데이터를 저장하는 방식 (Redis 등)