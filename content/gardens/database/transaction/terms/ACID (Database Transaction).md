---
tags:
  - database
  - db-transaction
date: 2024-07-18
aliases:
  - ACID
  - Atomicity
  - Consistency
  - Isolation
  - Durability
---
> [!info]- 참고한 것들
> - [어떤 미디엄 블로그](https://chrisjune-13837.medium.com/db-transaction-%EA%B3%BC-acid%EB%9E%80-45a785403f9e)

## ACID

- 하나의 [[Transaction (Database)|Transaction]] 이 만족해야 하는 특성 4가지가 있는데, 보통 이것의 앞글자를 따 *ACID* 라고 부른다.

### Atomicity

- *Transaction* 의 가장 기본이 되는, "원자성" 에 대한 특성이다.
- 즉, 하나의 transaction 은 완전히 실행되어 종료된 상태, 아니면 아예 실행되지 않은 상태 둘 중 하나의 결과만 존재해야 한다.
	- 뭐 transaction 이 일부만 반영되거나 그런일이 벌어지면 안된다는 소리이다.
	- 따라서 만약에 중간에 실패하게 되면 revert 하던지 해야 된다는 것.
- 이것과 관련된 연산이 `COMMIT` 이랑 `ABORT` (`ROLLBACK`) 이다.
	- `COMMIT` 은 트랜잭션을 구성하는 연산들이 성공적으로 수행되어 일관된 상태에 있을 때 트랜잭션을 끝내고 DB 에 영구적으로 반영하겠다는 것을 알리는 것을 의미하고
	- `ABORT` (`ROLLBACK`) 은 트랜잭션을 구성하는 연산들 중 하나라도 문제가 생겨 일관된 상태가 깨졌을 때, 트랜잭션에 포함된 모든 연산을 취소하고 이전의 상태로 되돌아가겠다는 것을 알리는 것을 의미한다.
		- `ROLLBACK` 되면 일반적으로는 전부 취소하지만 취소 이후 재시작하게 할 수도 있다고 한다.

### Consistency

- "데이터의 일관성" 은 쉽게 말하면 [[Schema, Namespace (Data Model)|schema]] 를 잘 지키는 것으로 생각하면 된다.
- 가령 엑셀로 비유하면,
	- Column `Student ID` 에는 "현재 재학중인 학생의 학번만을 넣겠다!" 라고 정했다고 해보자. (이게 [[Schema, Namespace (Data Model)|schema]] 에 대응된다.)
	- 그러면 모든 row 의 해당 column 에는 재학중인 학생의 학번을 넣어야지, `1840-12345` 와 같은 1840년도 입학생이 들어가 있으면 안될 것이다.
- 이렇게 "정한 규칙을 잘 지키기" 가 consistency 이고, 모든 *transaction* 은 이 consistency 를 깨서는 안된다.
- 이것을 강제하는 것이 위에서 말한 schema 나 [[Private Key, PK (Relational Model)|PK]], [[Foreign Key, FK (Relational Model)|FK]] 와 같은 constraint 이다.
- 또한 자동으로 이것이 지켜지도록 추가할 수 있는 기능이 있는데, 이것이 `TRIGGER` 이다.
	- 특정 조건을 만족했을 때 작동하는 `TRIGGER` 기능을 통해 데이터가 변경, 추가, 삭제되었을 때 일관성 있게 유지하기 위한 추가적인 연산이 일어나도록 지정해줄 수 있다.

### Isolation

- 동시에 실행되는 transaction 들은 독립 (격리) 적이어야 한다. 이것을 *Isolation* (고립성) 이라고 한다.
- 가령 예를 들면, 아직 commit 되지 않은 한 transaction 의 data write operation 이 다른 transaction 에게는 보여지면 안될 것이다.

### Durability

- _Durability_ 는 영속성이란 뜻인데 쿠버네티스에서의 영속성 개념에서도 알 수 있듯이 영속성이란 말은 "절대 불변" 이랑은 다른말이다.
- 즉, 이건 "의도된 상태 변화가 아니라면 변경되지 않아야 하는 것" 이다.
- 따라서 System fault 등의 사유가 있어도 (의도되지 않았다면) Commit 된 transaction 은 변경되어서는 안된다
- 뭐 DB 이론에서는 일반적으로 Commit 된 이후에는 디스크같은 비휘발성 메모리에 저장 (즉, Persistency) 되어야 한다는 것을 의미한다.