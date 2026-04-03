---
tags:
  - mdg
  - algorithm
  - interview
  - binary-search
date: 2026-03-09
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array)

> [!tip] 요약
> - 전체가 정렬되어 있지 않아도 binary search 를 고민해 보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260309141510.png]]

- 기본적인 idea 는 rotate 되어 있다면 반갈죽했을때 한쪽은 정렬되어 있고 반대쪽은 정렬되어있지 않다는 것을 이용하는 것이다.
	- 만약 둘 다 정렬되어 있다면 전체가 다 정렬되어있는 것이니 그냥 index 0 을 반환하면 된다.
- 이를 이용해 일반적인 binary search 처럼 접근하되, 반갈죽했을 때 정렬되어있지 않은 곳 (즉, 가운데 값보다 왼쪽 끝이 더 크다면 왼쪽 절반, 오른쪽 끝이 더 작다면 오른쪽 절반) 으로 좁혀나가면 된다.

```c
int findMin(int* nums, int numsSize) {
	short left = 0;
	short right = numsSize - 1;

	while (left + 1 != right)
	{
		short mid = (left + right) >> 1;

		if (nums[left] > nums[mid])
			right = mid;

		else if (nums[mid] > nums[right])
			left = mid;

		else
			break;
	}

	return nums[left] < nums[right] ? nums[left] : nums[right];
}
```

- 근데 결과를 보면 메모리 사용량이 높다고 나온다. 이건 거의 사기라고 봐야지
	- 뭐 assembly 를 사용하거나 그랬겠지; 여기서 더 이상 메모리 사용량을 줄이는 건 도대체 어떻게 했는지 모르겠다.