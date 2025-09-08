---
tags:
  - database
date: 2024-07-18
aliases:
  - OLTP
---
> [!info]- 참고한 것들
> - [[01. Modern OLAP Databases|CMU-15721, Advanced Database Systems]]
> - [어떤 블로그](https://blog.naver.com/arkdata/222467294321)

## "Transactional" Processing

- 이름에서 알 수 있듯이,
- 온라인으로 data [[Transaction (Database)|transaction]] 을 처리해 주는 것을 의미한다.
- 간단하게 생각하면, PostgreSQL 이나 MySQL 의 온라인 버전 SaaS 라고 생각할 수 있다.
	- 가령 AWS RDS (+ Aurora) [^rds-aurora] 같은 애들을 상상하면 될 것.
- 보통 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 과 같이 등장하는 개념인데, OLTP 는 OLAP 이랑은 다르게 "Transaction" 처리에 초점이 맞춰져 있다.
	- 즉, concurrency 나 [[Transaction (Database)|ACID]] control 에 특화되어 있다.
	- 따라서 "data write" 에 더 용이하다.

[^rds-aurora]: 다만 OLTP 기능만 제공하는 것은 아니고, OLAP 도 제공한다.
