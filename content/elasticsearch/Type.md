---
aliases:
  - Type
---
> [!warning] DEPRECATED 된 개념임

## 용어 설명

- [[elasticsearch/Index|Index]] 내에서 [[Document|Document]] 들을 논리적으로 묶는 단위

## 이 개념은 폐기되었다

- 지금은 [[Document|Document]] 들을 논리적으로 묶고싶다면 그냥 새로운 [[elasticsearch/Index|Index]] 를 생성해야 한다
- Backward-compability 를 위해 [[_doc Type|_doc Type]] 하나만 사용한다
	- 즉, API 에 [[Type|Type]] 을 명시하는 부분에 [[_doc Type|_doc Type]] 외에는 다른 것이 올 수 없다