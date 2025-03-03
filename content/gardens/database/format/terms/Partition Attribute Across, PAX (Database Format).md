---
tags:
  - database
  - db-format
  - terms
aliases:
  - PAX
  - Columnar
  - Hybrid Storage Model
  - Partition Attribute Across
date: 2025-02-11
---
> [!info]- 참고한 것들
> - [[05. Storage Part 3 - File Format|서울대 정형수 교수님 데이터사이언스 응용을 위한 빅데이터 및 지식 관리 시스템 강의 (Fall 2024)]]

## Hybrid Row-Columnar

![[Pasted image 20241021192606.png]]

- *Hybrid Storage Model*, *Partition Attribute Across* (*PAX*) 이놈은 위 두개를 섞은 것이다.
	- Columnar 을 하되, 모든 데이터를 columnar 로 저장하지 말고 특정 개수의 [[Record (Relational Model)|Record]] 씩 (*Record Group*) 만 columnar 로 저장하자는 것.
	- 가령 record 10개씩만 columnar 로 저장해서 한번 읽어갈 때 record 10 개를 다 읽어갈 수 있게 하되 sequential 로 읽으면 columar 이 되게하는 것이다.
- 이건 두 가지의 observation 에서 나온 것이다.
	- 첫째는 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 에서 column 하나만 접근하는 일은 그리 흔치 않다는 것이다.
		- 따라서 column 방향으로 자른 column group 을 만들되,
	- 둘째는 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 와 OLAP 기능 모두를 제공하는 [[Hybrid Transactional and Analytical Processing, HTAP (Modern Database)|HTAP]] 을 위해서는 두 방식 ([[N-ary Storage Model, NSM (Database Format)|NSM]], [[Decomposition Storage Model, DSM (Database Format)|DSM]]) 을 섞은 format 이 도움이 될 것이라는 것이다.
		- 따라서 column group 외에도 row 방향으로 자른 row group 도 만들어 이렇게 두 방향으로 자른 단위로 파일을 저장하자는 것이 아이디어이다.
		- 물론 이렇게 하면 NSM 에 비해 OLTP query 는 안좋긴 하겠지만 DSM 만큼 심하게 안좋아지지는 않게 되는 것.