---
tags:
  - database
  - data-model
  - relational-model
date: 2024-07-17
aliases:
  - Table
  - Relation
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Relation (Table)

- *Relation* 은 현실 세계의 어떤 대상의 여러 특징들 간의 관계를 모은 집합이다.
- 일단 위의 정의는 들으면 고구마를 먹은 듯이 숨이 턱 막히게 이해가 안된다.
- 간단하게 생각하면 *Relation* 은 그냥 *Table* 이라고 이해해도 된다.

![[Pasted image 20240703205716.png]]

- 위 table 을 이용해 저 정의를 이해해 보자.
	- "여러 특징들" 이라는 것은 "name", "year", "country" 이다.
	- 그리고 "관계" 라는 것은 저 특징들이 하나의 "현실 세계의 어떤 대상" 를 대변하고 있다는 거라고 생각하면 된다.
	- 즉, 현실 세계에서 tearz 를 부른 형들은 `name="Wu-Tang Clan"`, `year=1992`, `country="USA"` 라는 특징들을 가지고 있다고 생각할 수 있다.
	- 이것을 반대로 생각해 보면 이 특징들 사이에는 현실세계의 우탱클랜 하나를 설명해준다는 "관계" 가 있는 것.
	- 그리고 이 "관계" 들을 모은 것이 Relation, 즉 Table 인 것이다.
- 그래서 *n-ary relation* 이라는 것은 table w/ n-[[Record (Relational Model)|Column]] 이라는 말과 같다.