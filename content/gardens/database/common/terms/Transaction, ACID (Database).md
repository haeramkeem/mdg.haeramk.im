---
tags:
  - database
  - data-model
date: 2024-07-18
aliases:
  - Transaction
  - ACID
---
> [!info]- 참고한 것들
> - [어떤 미디엄 블로그](https://chrisjune-13837.medium.com/db-transaction-%EA%B3%BC-acid%EB%9E%80-45a785403f9e)

## Transaction

- *Transaction* 이란, [[Database Management System, DBMS (Database)|DBMS]] 에서 "한번에 (atomic)" 실행되는 단위를 의미한다.
	- 일반적으로 하나의 작업은 *transaction* 이고,
	- 여러개의 작업을 (transaction) 으로 묶을 수도 있다.
- 이놈의 처리를 전문적으로 해주는 cloud SaaS 서비스를 [[On-Line Transactional Processing, OLTP (Database)|OLTP]] 라고 한다.

## ACID

- 하나의 *transaction* 이 만족해야 하는 특성 4가지가 있는데, 보통 이것의 앞글자를 따 *ACID* 라고 부른다.

### Atomic

- *Transaction* 의 가장 기본이 되는, "원자성" 에 대한 특성이다.
- 즉, 하나의 transaction 은 완전히 실행되어 종료된 상태, 아니면 아예 실행되지 않은 상태 둘 중 하나의 결과만 존재해야 한다.
	- 따라서 만약에 중간에 실패하게 되면 revert 하던지 해야 된다는 것.

### Consistency

- "데이터의 일관성" 은 쉽게 말하면 [[Schema (Database)|schema]] 를 잘 지키는 것으로 생각하면 된다.
- 가령 엑셀로 비유하면,
	- Column `Student ID` 에는 "현재 재학중인 학생의 학번만을 넣겠다!" 라고 정했다고 해보자. (이게 [[Schema (Database)|schema]] 에 대응된다.)
	- 그러면 모든 row 의 해당 column 에는 재학중인 학생의 학번을 넣어야지, `1840-12345` 와 같은 1840년도 입학생이 들어가 있으면 안될 것이다.
- 이렇게 "정한 규칙을 잘 지키기" 가 consistency 이고, 모든 *transaction* 은 이 consistency 를 깨서는 안된다.

### Isolation

- 동시에 실행되는 *transaction* 들은 독립 (격리) 적이어야 한다.
- 가령 예를 들면, 아직 commit 되지 않은 한 transaction 의 data write operation 이 다른 transaction 에게는 보여지면 안될 것이다.

### Durability

- 이건 persistency 와 비슷한 맥락이다.
- 즉, 데이터가 한번 commit 되었으면, 의도치 않게 변경, 삭제되어서는 안된다는 것.