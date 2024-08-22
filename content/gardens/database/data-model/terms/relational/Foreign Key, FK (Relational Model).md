---
tags:
  - database
  - data-model
  - relational-model
date: 2024-07-17
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Foreign Key

- *Foreign Key (FK)* ==다른 [[Relation (Relational Model)|relation]] 의 [[Private Key, PK (Relational Model)|PK]] 를 명시하여 해당 [[Relation (Relational Model)|tuple]] 를 가리키는 포인터== 를 말한다.
- 다만 이때 한 relation 에 FK 를 직접 박지는 않는다.
	- 물론 1:1 관계라면 relation 의 attibute 로 FK 를 직접 박아도 되지만
		- 이때는 아마 이렇게 하는 것보다 relation 을 합치는게 나을듯?
		- 정규화에 이런 내용이 있었던 것 같은데 기억이 잘 안난다
- 한 relation 에 FK 를 직접 박으면 아래처럼 1:N 이나 N:M 을 표현하기 힘들다.

![[Pasted image 20240704105827.png]]

- 이때 array attribute 를 사용할 수도 있긴 하지만, 일반적으로 아래처럼 *Cross-reference table* 을 구성하는 것이 바람직하다고 한다.

![[Pasted image 20240704105933.png]]

- Array attribute 를 사용하지 않는 이유는 아마도:
	- Array attribute 를 지원하지 않는 DB 도 있기 때문
	- Array attribute 의 type 은 int 와 같은 일반 적인 type 이기 때문에, 해당 PK 가 실제로 존재하는가에 대한 검증은 이루어지지 않기 때문
	- 그리고 생각해 보면 (위의 예제에서) Artist 에 array attribute 를 추가해서 하나의 Artist 에 대해 연관된 Album 들을 저장하고 Album 에도 array attribute 를 추가해서 하나의 Album 에 대해 연관된 Artist 들을 저장하게끔 해야 할 것 같은데 그럼 결국에는 별도의 cross reference table 을 사용하는 것에 비해 용량을 적게 사용할 것 같지도 않다
		- `JOIN` 연산에도 강점이 있을까? 생각해 보면 솔직히 잘 모르겠음
- 그리고 뭐 추가적으로:
	- 저 Cross reference table 은 그냥 하나의 table 이고 다른 table 들 처럼 `INSERT` 와 같은 연산이 충분히 가능하다