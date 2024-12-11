---
tags:
  - database
  - data-model
  - multidimensional-model
date: 2024-08-22
aliases:
  - Star schema
---
> [!info]- 참고한 것들
> - [긱](https://www.geeksforgeeks.org/multidimensional-data-model/)
> - [어떤 미디엄 블로그](https://medium.com/@parklaus1078/olap-302f30c0d0c5)

## 뚱인데요

![[Pasted image 20240822143531.png]]
> [출처: 꼬리스토리](http://www.ggoristory.com/bbs/board.php?bo_table=news&wr_id=202&page=65&device=pc)

- [[Multi-Dimensional Data Model (Database)|Multi-dimensional data model]] 에서는 데이터를 (이론적으로는) [[Cube (Multi-dimensional Model)|cube]] 의 형태로 표현될 수 있다.
- 그럼 이것을 컴퓨터에는 어떻게 저장하면 될까? 에 대한 해답이 이 [[Schema (Database)|schema]] 이다.
- 우선 어떤 [[Measure, Fact Table (Multi-dimensional Model)|measure]] 에 대한 [[Dimension, Dimension Table (Multi-dimensional Model)|dimension]] 들을 다 [[Relation (Relational Model)#Tuple, Domain|tuple]] 에 때려박는 방법을 생각할 수 있다.
	- 즉, [[Multi-Dimensional Data Model (Database)|이 예시]] 로 보면, `TIME` column 을 준비해 `Q1`, `Q2` 등을 넣고, `BRANCH` column 을 준비해 `dongjak` 등의 값을 넣으면 될 것이다.
- 이때 이 dimension 들을 정규화 하여 [[Dimension, Dimension Table (Multi-dimensional Model)|dimension table]] 을 분리한 것이 *Star Schema* 다. 아래 그림을 보시라.

![[Pasted image 20240822144119.png]]
> [출처: ThoughtSpot](https://www.thoughtspot.com/data-trends/data-modeling/star-schema-vs-snowflake-schema)

- 보면 가운데 [[Measure, Fact Table (Multi-dimensional Model)|fact table]] 이 있고, 여기에 여러 dimension table 들이 reference 되어 있는 형태를 띈다고 해서 *Star* 라는 이름이 붙는다.
- 왜 굳이 정규화를 하냐.. 라고 한다면 일반적인 정규화의 장점을 떠올리면 된다.
	- 즉, 데이터 중복을 막고 일관된 상태를 유지하기 위함임.
- 근데 저 dimension table 또한 정규화시킬 수 있을 것이다. 여기에서 더 정규화를 시킨 것은 [[Snowflake Schema (Multi-dimensional Model)|Snowflake Schema]] 라고 부른다.