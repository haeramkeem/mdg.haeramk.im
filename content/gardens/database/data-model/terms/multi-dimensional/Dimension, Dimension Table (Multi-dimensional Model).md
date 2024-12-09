---
tags:
  - database
  - data-model
  - multidimensional-model
date: 2024-08-22
aliases:
  - Dimension table
---
> [!info]- 참고한 것들
> - [긱](https://www.geeksforgeeks.org/multidimensional-data-model/)

## Dimension, Dimension Table

- *Dimension* 은 [[Measure, Fact Table (Multi-dimensional Model)|measure]] 들에 대한 attribute 를 의미한다.
	- 즉, 수입, 수출, 가격과 같은 "속성" 을 의미하는 것.
- 얘들이 담기는 테이블을 *Dimension Table* 이라고 부른다.

### 특징

- [[Measure, Fact Table (Multi-dimensional Model)|Fact table]] 과는 반대로, dimension table 은 잘 변하지 않는다.
	- 뭐 `INSERT` 말고도 `UPDATE`, `DELETE` 도 자주 일어나지는 않는다.
- 이건 왜냐면 dimension table 은 "속성" 을 저장하는 테이블이기 때문이다.
	- BMW 에서 5시리즈의 출시 색상을 나노초 단위로 변경하지는 않자나?