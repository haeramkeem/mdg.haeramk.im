---
tags:
  - database
  - db-transaction
date: 2025-09-09
aliases:
  - Isolation Level
  - Dirty Read
  - Non-repeatable
  - Phantom Read
  - Read Uncommitted
  - Read Committed
  - Repeatable Read
  - Serializable
---
> [!info]- 참고한 것들
> - [MS SQL Server 문서](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/transaction-isolation-levels)

## Transaction Isolation Level

- 이건 말그대로 트랜잭션을 어느정도까지 격리시킬 것이냐를 의미하는데
- 이름에 Level 이 들어가니까 당연히 정의된 격리 레벨이 여러개 있겠제
- 결론부터 말하면 이건 3개의 척도로 판단하며 0개 만족 ~ 3개 다 만족 이렇게 4개의 레벨이 존재한다.

### Phenomena - 척도: 이 현상이 발생하는가?

- *Dirty Read*: 커밋되지 않은 값을 다른 트랜잭션에서 읽어오는 현상
	- 예를 들면 `Tx1` 이 값을 업데이트하고 아직 커밋하기 전인데
	- `Tx2` 가 업데이트된 값을 읽어왔다면 이때를 Dirty Read 라 한다.
	- 이것의 문제점은 커밋되지 않았기 때문에 Rollback 되면 유효하지 않은 값을 읽어온 셈이 된다.
- *Non-repeatable*: 한번의 트랜잭션에서 동일한 데이터를 두번 읽어왔는데 값이 다르게 읽히는 현상
	- 예를 들면 `Tx1` 이 값을 읽어서 `a` 를 읽어왔는데
	- `Tx2` 이 그 값을 `b` 로 업데이트하고 커밋했을 때
	- `Tx1` 이 그 값을 다시 읽었을 때 `b` 로 읽히게 되는 현상을 말한다.
	- 만약 `Tx2` 가 업데이트하는게 아니고 삭제를 해버리면 `Tx1` 은 갑자기 값이 없어는 현상이 발생한다.
- *Phantoms*: 한번의 트랜잭션에서 동일한 검색조건으로 검색을 하였을때 결과 Set 이 다르게 나오는 현상 (원래는 검색되지 않았던 Row 가 검색됐다던지)
	- 예를 들면 `Tx1` 이 특정 `WHERE` 문을 이용해 `SELECT` 를 했을 때 결과가 `{a, b, c}` 였는데
	- `Tx2` 가 `d` 를 `INSERT` 혹은 UPDATE 를 한 담에 커밋을 했다 치자.
	- `Tx1` 이 다시 동일한 `WHERE` 문을 이용해 `SELECT` 했을 때 `d` 가 어쩌다 보니 조건에 부합해버려 `{a, b, c, d}` 가 검색되면 이제 `d` 가 유령 (Phantom) 이 되는거다 - 처음에 검색했을때에는 없었거덩

### Isolation Levels

- 많이 고립을 시킬 수록 데이터에 동시에 접근할 수 있는 트랜잭션의 수가 제한되기 때문에 성능이 떨어지고
- 대신 고립을 안하면 올바르지 않은 데이터가 조회될 수 있기 때문에
- 고립도와 성능의 Trade-off 에서 적당히 타협점 조절할 수 있게 하기 위해 나온 개념이다

![[Pasted image 20250909094232.png]]
> 출처: [MS SQL Server](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/transaction-isolation-levels)

- 이렇게 위의 3개의 척도로 4가지 레벨이 있는데 간단히 설명해보면
	- *Read Uncommitted*: 커밋되지 않은 내용도 읽을 수 있음 (*Dirty read* 허용)
	- *Read Committed*: 커밋된 내용만 읽을 수 있음 (*Dirty read* 불가)
	- *Repeatable Read*: 트랜잭션 시작 전에 커밋된 내용만 읽을 수 있게 함 (*Non-repeatable* 불가)
	- *Serializable*: Tx 하나만 도는 것과 동일한 효과 (*Phantom* 도 불가)
- 당연히 *Read Uncommitted* 으로 갈수록 격리수준이 떨어지는거고 *Serializable* 로 갈수록 격리수준이 높아진다.
	- 다만, 이론상으로는 격리수준이 높아질수록 성능이 성능이 저하되지만 (더 많은 처리를 해줘야 되고 동시성에 더 제약이 많이 걸리므로)
	- 실제로는 *Serializable* 을 제외하면 크게 성능차이가 나지는 않는다고 한다.
- 그리고 각각의 DBMS 마다 격리수준 기본값 정책이 다르며, MySQL 은 *Repeatable Read* 이 기본값으로 설정되어 있다.
    - 일반적으로 *Read Committed* 나 *Repeatable Read* 를 기본값으로 설정하고
    - *Read Uncommitted* 는 격리가 안돼 거의 사용하지 않으며
    - *Serializable* 도 동시성과 성능문제로 거의 사용하지 않는다고 하네
    - 물론 DBMS 의 추가적인 설정으로 격리수준을 변경하는것도 가능하다.