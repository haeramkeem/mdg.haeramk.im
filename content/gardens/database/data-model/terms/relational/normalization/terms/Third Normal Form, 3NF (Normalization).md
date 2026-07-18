---
tags:
  - mdg
  - database
  - data-model
  - relational-model
  - normalization
date: 2025-09-15
aliases:
  - Third Normal Form
  - 3NF
  - 제3정규화
---
> [!info]- 작물 단계: #seed  

## 란?

- *Third Normal Form*, *3NF* (*제3정규화*) 는 '이행적 종속' 을 없애는 [[Normalization (Relational Model)|Normalization]] 이다.
- *이행적 종속* 은 그냥 삼단논법같은거다.
	- '삼' 단논법을 없애는 정규화. *3NF*. 외우기 쉽죠?
	- 물론 삼단논법은 아니다. 근데 생긴게 비슷하긴하니까 이렇게 외우자.

## 이행적 종속

- $A$, $B$, $C$ 세 개의 [[Record (Relational Model)|attribute]] 를 가진 [[Relation (Relational Model)|relation]] 이 있다고 해보자.
- 그리고 이때의 [[Functional Dependency, FD (Normalization)|FD]] 관계는 $A \rightarrow \{B,C\}$ 라고 해보자.
- 근데 보니까 $B$ 도 $C$ 를 결정하네? 즉, $B \rightarrow C$ 이네?
- 또 보니까 $A$ 도 $C$ 를 결정하네? 즉, $A \rightarrow C$ 네?
- 그럼 이때를 *이행적 종속* 이라고 한다.

## 3NF

- 이 *이행적 종속* 을 relation 을 나눠서 해결하는 것이 *3NF* 다.
- 위의 예시에서는, relation 을 반갈죽해서 $A \rightarrow B$ 와 $B \rightarrow C$ 로 나눠주면 된다.
- 이 정규화를 해줘야 되는 이유는 다음과 같다:
	- 만약에 위의 예시에서처럼 쟤네들이 모두 한 테이블에 있다면, $B$ 가 변경되었을 때 $C$ 까지 같이 변경해줘야 하기 때문이다.
	- 하지만 테이블을 나누게 되면 $A \rightarrow B$ 의 테이블에서 $B$ 의 값만 바꿔주면 된다.