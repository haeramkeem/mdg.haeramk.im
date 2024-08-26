---
tags:
  - terms
  - data-structure
date: 2024-04-06
---
> [!info]- 참고한 것들
> - [Flink 0.3 시절 공식문서](https://nightlies.apache.org/flink/flink-table-store-docs-release-0.3/docs/concepts/lsm-trees/)
> - [LSM tree 자바 구현과정 블로그 글](https://itnext.io/log-structured-merge-tree-a79241c959e3)

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

## Merging Sorted Runs

- 각각의 Sorted run 을 merge 하여 하나의 sorted run 으로 만드는 것은 [[Merge Sort (Algorithm)|Merge sort]] 를 이용하면 된다.
- 즉, 이미 두 sorted run 들은 정렬되어 있기 때문에 two-pointer 로 합치기만 하면 되기 때문.
- 조금 더 자세히 설명하자면, 다음처럼 merge 된다:
	1. 각각의 sorted run 의 시작점에 pointer 를 둔다.
	2. 두 pointer 가 가리키는 두 key-value pair 중 key 가 더 작은 pair 를 buffer 에 넣어두고, 해당 pointer 를 한칸 움직인다.
	3. 만일 두 pair 의 key 가 같다면, 더 최신의 값을 사용한다.
	4. 두 pointer 가 sorted run 를 끝까지 다 훑었다면, buffer 에 있는 내용을 적당히 잘라 data file 로 만들어 merging 을 종료한다.
- 즉, 시간복잡도는 $O(n)$ 이 된다.
	- Merge sort 에서 divide 하는 시간이 빠졌으므로 $O(log(n))$ 이 없어지는 것.