---
tags:
  - mdg
  - database
  - data-model
  - relational-model
  - normalization
date: 2025-09-15
aliases:
  - Second Normal Form
  - 2NF
  - 제2정규화
  - 완전 함수 종속
---
> [!info]- 작물 단계: #seed  

## 란?

- *Second Normal Form*, *2NF* (*제2정규화*) 는 '완전 함수 종속' 을 만족하게끔 하는 [[Normalization (Relational Model)|Normalization]] 이다.
- 이건 간단히 말하면, [[Private Key, PK (Relational Model)|PK]] 의 부분집합이 PK 가 아닌 column 의 값을 결정하지 않도록 해야 한다는 것이다.
- 뭐 단순히 말하면 저거긴 한데 좀 더 딥하게 들어가보자.

## 부분 함수 종속

- $A$, $B$, $C$, $D$ 네 개의 [[Record (Relational Model)|attribute]] 로 이루어진 [[Relation (Relational Model)|relation]] 에서 [[Functional Dependency, FD (Normalization)|FD]] 가 $\{A,B\} \rightarrow \{C,D\}$ 라고 해보자.
- 근데 만약 $B$ 가 $D$ 를 결정한다면, $B \rightarrow D$ 의 관계가 되어 $B$ 도 [[Functional Dependency, FD (Normalization)|결정자]] 가 된다.
- 이럴 때를 *부분 함수 종속* 이라고 한다.

## 완전 함수 종속

- 위의 *부분 함수 종속* 을 너굴맨이 처리하면 그때는 *완전 함수 종속* 이 된다.
- 가령 위의 관계에서 $A \rightarrow \{C,D\}$ 하고 $B \rightarrow D$ 로 relation 을 나눴다고 해보자.
- 그럼 더이상 위와 같은 *부분 함수 종속* 이 발생하지 않는다. 따라서 이때를 *완전 함수 종속* 이라고 하고, 이렇게 *완전 함수 종속* 을 만들기 위해 relation 을 나누는 것을 *2NF* 라고 하는 것이다.