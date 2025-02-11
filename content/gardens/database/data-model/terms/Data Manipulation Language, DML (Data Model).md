---
tags:
  - database
  - data-model
date: 2024-07-18
---
> [!info]- 참고한 것들
> - [[01. Relational Model and Algebra|CMU-15445, Intro. to Database Systems]]

## Data Manipulation: DML (Data Manipulation Language)

- 이름 그대로 데이터를 조작하는 것과 관련된 언어 체계를 말한다.
- 여기에는 두가지 접근 방법이 있다:
	- *Procedural*: 이것은 어떤 데이터를 접근하는 것을 "절차" 적으로 명시하는 것을 의미한다.
		- 이 *Procedural* 한 방법에는 *Relational Algebra* 가 포함된다.
			- 즉, [[Relational Data Model (Data Model)|Relational model]] 이 제시하는 high-level language 는 declarative 하지는 않다는 것.
		- 수학에서도 곱하기가 더하기보다 먼저 수행되는 것과 마찬가지의 "순서" 가 존재하는 부류이다.
	- *Non-procedural (Declarative)*: 이것은 진짜로 데이터를 접근하는 것에 대한 "우리가 받기를 예상하는 결과" 를 명시하는 것이다.
		- 이 방법에는 *Relational Calculus* 가 있으며
		- 내부적으로 들어가면 여러가지 많은 최적화가 들어가기 때문에 어렵고, 이번 강의에서는 자세히는 안배우는 듯
		- 일반적인 *SQL* 이 여기에 해당한다고 한다.