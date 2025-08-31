---
tags:
  - terms
  - database
aliases:
  - Write ahead log
  - WAL
date: 2024-10-10
---
> [!info]- 참고한 것들
> - [미디엄 블로그 ARIES 포스팅](https://medium.com/@vikas.singh_67409/algorithms-for-recovery-and-isolation-exploiting-semantics-aries-d904765fb9b8)
> - [[22. Database Logging|서울대 정형수 교수님 데이터사이언스 응용을 위한 빅데이터 및 지식 관리 시스템 강의 (Fall 2024)]]

## Write Ahead Log: WAL

- *Write Ahead Log (WAL) Protocol* 은 간단히 말하면 A,D 가 깨지기 직전에는 [[Log (Database Recovery)|Log]] 를 flush 해야한다는 원칙이다.
- 좀 더 자세히 알아보면,

![[Pasted image 20241210231303.png]]

- 일단 Data page buffer 외에도 log buffer 가 있어서 여기에 log 가 쌓이고 나중에 flush 되는데,
- 여기서 flush 가 언제 되느냐가 중요하다.
	- Log 는 기본적으로 recovery 를 위한 것이므로 [[Transaction (Database)|Atomicity]] 와 [[Transaction (Database)|Durability]] 가 깨지기 직전에는 log 가 flush 되어야 할 것이다. 그래야 failure 시에 [[Algorithms for Recovery and Isolation Exploiting Semantics, ARIES (Database Recovery)|Recovery]] 를 할 것이므로.
	- Atomicity 가 깨지는 것은 page 가 [[STEAL, NO_STEAL Policy (Database Recovery)|STEAL]] 될 때이다: 따라서 이때 [[Log (Database Recovery)|UNDO]] log 를 flush 한다.
	- Durability 가 깨지는 것은 txn 이 buffer 에만 write 하고 `COMMIT` 할 때이다: 따라서 txn 이 `COMMIT` 할 때 [[Log (Database Recovery)|REDO]] log 를 flush 한다.
		- 이것은 `COMMIT` 의 조건이 된다: REDO flush 까지 완료되어야 `COMMIT` 되었다고 판단한다.
	- 참고로 buffer page write 도 log buffer 에 logging 한 다음에 처리한다.
- *WAL Log* 에는 이전 데이터, 이후 데이터, txn, page id, page offset, size 를 적어 놓는다.
	- 이 "이전 데이터" 를 UNDO 에서 사용하고 "이후 데이터" 는 REDO 에서 사용한다.
- REDO, UNDO log 를 저장하는 위치는 구현하기 나름이다.
	- 위에서 STEAL 될때는 UNDO log 를, evict 될때는 REDO log 를 flush 한다고 해서 두가지의 log type 혹은 log space 를 구분짓는거 아닌가 라고 생각할 수 있는데
	- 그냥 구분짓지 않고 해도 되긴 한다. 같은 log 를 REDO 로 해석하거나 UNDO 로 해석하는 것 모두 가능하기 때문.
- Logging 을 할때는 `BEGIN` 과 `COMMIT` log 도 같이 작성한다.
	- 나중에 [[Algorithms for Recovery and Isolation Exploiting Semantics, ARIES (Database Recovery)|ARIES]] 에서 배우겠지만, 이것으로 어떤 txn 이 crash 전에 정상적으로 commit 되었는지를 파악하게 된다.