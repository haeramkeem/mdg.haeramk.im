---
tags:
  - mdg
  - database
  - data-model
  - relational-model
  - normalization
date: 2025-09-15
aliases:
  - Boyce-Codd Normal Form
  - BCNF
---
> [!info]- 작물 단계: #seed  

## 란?

- Boyce 는 [[SQL (Database)|SQL]] 을 공동개발한 사람이다.
- Codd 는 알다시피 [[Relational Algebra (Database)|Relational Algebra]] 를 만든사람이다.
- 이 둘이 짱구를 굴려 새로운 [[Normalization (Relational Model)|Normalization]] 방법을 고안했으니, 그것이 *Boyce-Codd Normal Form*, *BCNF* 다.
- 얘는 모든 [[Functional Dependency, FD (Normalization)|결정자]] 는 [[Candidate Key (Relational Model)|후보키]] 가 되어야 한다는 것이다.
	- 가령 $A$, $B$, $C$ 세 개의 [[Record (Relational Model)|attribute]] 를 가진 [[Relation (Relational Model)|relation]] 이 있다고 해보자.
	- 그리고 이 때 후보키가 $\{A,B\}$ 라고 해보자. 그럼 당연히 $\{A,B\} \rightarrow C$ 를 만족한다.
	- 근데 가만 보니까 $C$ 가 $B$ 를 결정하고 있네? 즉, $C \rightarrow B$ 네?
	- 이때 $C$ 는 후보키가 아니므로 이때는 *BCNF* 가 아니게 된다.
- 이때 *BCNF* 를 만드려면 $A \rightarrow C$ 와 $B \rightarrow C$ 로 relation 을 쪼개면 된다.