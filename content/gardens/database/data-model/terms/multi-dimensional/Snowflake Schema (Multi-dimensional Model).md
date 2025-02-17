---
tags:
  - database
  - data-model
  - multidimensional-model
date: 2024-08-22
aliases:
  - Snowflake schema
---
> [!info]- 참고한 것들
> - [긱](https://www.geeksforgeeks.org/multidimensional-data-model/)
> - [어떤 미디엄 블로그](https://medium.com/@parklaus1078/olap-302f30c0d0c5)
> - [어떤 회사 블로그](https://www.thoughtspot.com/data-trends/data-modeling/star-schema-vs-snowflake-schema)

## 눈꽃

![[Pasted image 20240822145344.png]]
> [출처: ThoughtSpot](https://www.thoughtspot.com/data-trends/data-modeling/star-schema-vs-snowflake-schema)

- 위 그림에서 보는 것 처럼, [[Star Schema (Multi-dimensional Model)|star schema]] 의 [[Dimension, Dimension Table (Multi-dimensional Model)|dimension table]] 또한 정규화한 [[Schema, Namespace (Data Model)|schema]] 를 (눈꽃을 닮았다고 해서) *Snowflake Schema* 라고 부른다.
- 이건 star schema 와 비교했을 때 이런 장단점을 가진다:
	- 일단 star schema 보다 더 normalize 되어있다는 점에서,
		- (데이터 중복이 적기 때문에) 더 저장공간을 적게 필요로 하고
		- (데이터 일관성을 쉽게 달성할 수 있기 때문에) update 가 더 간편하다.
	- 하지만 마찬가지의 이유로,
		- (필연적으로 `JOIN` 이 필요하기 때문에) query processing overhead 는 커진다.
		- (추가적으로 normalize 해야 하기 때문에) schema 설계는 더 복잡해진다.