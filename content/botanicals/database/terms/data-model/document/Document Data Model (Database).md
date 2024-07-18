---
tags:
  - Database
  - data-model
date: 2024-07-17
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Document Data Model

- [[Relational Data Model (Database)|Relational Model]] 에서는 *Join* 이라는 연산을 감당해야 한다는 단점이 있다.
- 그래서 뭐 [[Relation (Relational Model)|relation]] 이니 [[Private Key, PK (Relational Model)|private key]] 니 이런거 하지 말고 일반적인 OOP 에서처럼 그냥 "객체" 의 형태 (가령 JSON 의 형식으로) 로 DB 에 저장해버리고자 하는 것이 *Document Data Model* 이다.

![[Pasted image 20240704162309.png]]

- 이렇게 했을 때의 장점은:
	- 구현이 단순해진다. 복잡하게 [[Schema (Database)|schema]] 짜고 할 필요 없이 그냥 application code 에서의 객체를 DB 에 던져버리면 되기 때문에.
	- 그리고 *Join* 연산이 없기 때문에 속도가 더 빠르다.
- 하지만 그럼에도 불구하고 다음과 같은 단점들 때문에 Relational Model 이 일반적으로 더 권장된다.
	- Document Model 의 경우에는 아무런 제약조건이 없기 때문에 data integrity 를 보장하기가 어렵다.
	- 가령 데이터의 자료형이라던가
	- 아니면 sync 가 안맞아 Album 정보에는 artist 로 등록되어 있지만 Artist 정보에는 해당 album 없는 등의 실수가 발생할 수 있는 것.