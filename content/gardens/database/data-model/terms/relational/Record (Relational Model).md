---
tags:
  - database
  - data-model
  - relational-model
aliases:
  - Tuple
  - Record
  - Domain
date: 2025-02-11
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]
> - [스댕](https://stackoverflow.com/a/17943883)

## Record, Tuple

- 간단히 생각하면 얘는 그냥 [[Relation (Relational Model)|Table]] 에서의 한 row 이다.
	- 구체적으로는 "한 대상의 특징을 나타내는 값들의 집합" 이라고 정의할 수 있다.

### Record vs Tuple

- 사실 *Record* 와 *Tuple* 은 row 라는 거의 같은 의미로 사용된다.
- 하지만 미묘한 차이가 있는데, 그것은 physical vs logical 의 차이이다.
- Table 에서 row 를 지칭할 때, logical 한 표현이 *Record* 이다.
- 그리고 그 *Record* 가 저장된 physical 한 단위를 *Tuple* 이라고 부른다.
	- 대부분의 [[Relational Data Model (Database)|RDBMS]] 는 [[Slotted Page (Database Format)|Slotted page]] 에 row 단위로 저장하기 때문에, 사실상 *Record* 와 *Tuple* 은 같다고 생각해도 무방하긴 하다.
	- 하지만 [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 와 같이 [[Partition Attribute Across, PAX (Database Format)|Columnar]] 로 저장하는 경우에는 저장하는 단위가 row 가 아니라 column 의 값 하나이기 때문에 엄밀히 말하면 *Tuple* 와 *Record* 는 다른 의미가 된다.

## Domain

- 하나의 값은 *Domain* 이라고도 불리고, `NULL` 은 (허용되는 한) 모든 attribute 의 domain 이 될 수 있다.
- 근데 이 용어는 많이는 안쓰인다. 정확한 표현은 아니긴 하지만 *Column*, *Attribute*, *Value* 등의 용어와 혼용되니 문맥을 보고 판단하는 것이 좋다.