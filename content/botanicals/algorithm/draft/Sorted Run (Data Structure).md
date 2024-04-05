---
tags:
  - 용어집
  - data-structure
---
> [!info]- 참고한 것들
> - [Flink 0.3 시절 공식문서](https://nightlies.apache.org/flink/flink-table-store-docs-release-0.3/docs/concepts/lsm-trees/)
> - [LSM tree 자바 구현과정 블로그 글](https://itnext.io/log-structured-merge-tree-a79241c959e3)

> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

## 가 뭔데?

![[Pasted image 20240405125107.png]]
> [사진 출처](https://nightlies.apache.org/flink/flink-table-store-docs-release-0.3/docs/concepts/lsm-trees/)

- 한마디로 설명하면 "Key 를 기준으로 (1) 중복 없이 (2) 정렬된 (3) overlay 되지 않은 key-value data file 들의 집합" 정도가 된다.
- 이것을 Top-down 으로 살펴보자:
	- 하나의 Sorted run 은 여러개의 data file 들로 구성된다.
	- 그리고 각각의 data file 들에는 key-value 쌍들이 저장되는데,
	- 이 key-value 쌍들은 key 를 기준으로 정렬되어 있고
	- 중복된 key 를 가지지 않는다.
	- 또한 해당 data file 들의 key 들은 overlap 되지 않는다.
		- 범위가 겹치지 않는다는 것인데, 예를 들어 아래와 같은 경우는 안된다는 소리이다.
			- Data File 1 은 `[(A:1), (C:3), (E: 5)]`
			- Data File 2 는 `[(B:2), (D:4), (F: 6)]`
		- 위와 같은 것이 sorted run 이 되려면, 각 파일이 다음처럼 되어 있어야 한다.
			- Data File 1 은 `[(A:1), (B:2), (C: 3)]`
			- Data File 2 는 `[(D:4), (E:5), (F: 6)]`
- 위의 그림에서 보다시피 다른 sorted run 들 간에는 key 가 중복되거나 overlay 될 수도 있다.

## 

