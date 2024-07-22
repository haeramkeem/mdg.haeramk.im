---
tags:
  - CMU-15445
  - Database
  - Bustub
date: 2024-07-02
---
> [!info]- 참고한 것들
> - [가이드](https://15445.courses.cs.cmu.edu/fall2023/project0/)

> [!info]- CodeRef (인데 private 이라 주인장만 볼 수 있음)
> - [Github PR04](https://github.com/haeramkeem/bustub-private.idbs.fall.2023.cs.cmu.edu/pull/4)

## 요구사항 파악

- 일단 가이드에는 `StringExpression::Compute` 를 수정한 뒤에  `Planner::GetFuncCallFromFactory` 를 수정해서 완성하면 된다고 하는데
- 각 함수가 어떻게 작동하고 목적은 무엇인지 먼저 확인할 필요가 있었다.
- 그래서 막 `cout` 으로 찍어보며 파악한 것은 PL 에서 배운거랑 유사하다.
	- 사용자 SQL 이 들어오면 이것을 트리로 변환하고, 각 node 를 연쇄적으로 `Compute()` 하여 최종 결과를 뽑아내는 식으로 작동한다.
		- AST 과 유사하다고 생각하면 된다.
	- 이때의 각 node 는 `AbstractExpression` class 의 subclass 로 표현된다.
		- 이 class 에는 `children_` field 가 있어서 여기에 자식의 포인터가 담기는 것.
		- 가령 예를 들어 보면 `sql_func('good')` 는 `sql_func()` 을 대변하는 node 와 이것의 자식으로 `'good'` 를 대변하는 node 로 구성된 트리인 것.
		- 따라서 `StringExpression` class 는 `upper()` 와 `lower()` SQL 함수를 대변하는 것이고,
		- `StringExpression::Compute()` 로 실제 연산을 수행하는 것.
	- 그리고 이때 `Planner::GetFuncCallFromFactory` 함수는 node 를 묶어서 새로운 node 를 반환하는 함수인 셈이다.
		- 즉, 어떤 SQL 함수를 대변하는 node 를 만들기 위해, 해당 함수 이름과 자식 node 들을 받아 새로운 node 를 만들어 반환하는 역할인 것.
- 아래에서 좀 더 자세히 보자.

## `StringExpression::Compute()`

- 이 함수는 string 을 받아 연산을 한 뒤 결과 string 을 반환하는 함수이다.
- 어떤 연산을 할 지는 `StringExpression::expr_type_` 으로 지정되고, (뭐 나중에 더 추가될 수도 있겠지만) 일단은 지금 버전으로는 enum 으로 `Lower` 와 `Upper` 가 가능하다.
- 따라서 그냥 간단하게 `expr_type_` 에 따라 입력받은 문자열을 `tolower()` 나 `toupper()` 로 바꿔주면 끝난다.

## `Planner::GetFuncCallFromFactory`

- 이 함수에서는 `StringExpression` obj 를 생성해서 반환해주면 되는데
- `func_name` 이 `"upper"` 인지 `"lower"` 인지에 따라 생성자에 다른 enum 값을 넣어주면 된다.
- 그리고 예외처리로는
	- `upper()` 나 `lower()` 는 1개의 string 을 받기 때문에
	- SQL 함수 인자 배열 (`args`) 의 크기가 1인지와
	- 해당 값의 type 이 문자열인지 확인하는 예외처리를 함
		- 참고로 SQL 함수가 아닌 그냥 "값" 의 경우에도 이 값의 type 을 `GetReturnType()` 로 검사할 수 있다.

## 삽질

- [[String 변수를 auto 로 생성하지 말자 (C++ String)]]