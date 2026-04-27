---
tags:
  - mdg
  - algorithm
  - interview
  - two-pointer
date: 2026-04-20
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/maximum-distance-between-a-pair-of-values)

> [!tip] 요약
> - Two pointer 풀이가 바로 생각나지 않는다면, 그냥 binary search 로 풀자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260420132301.png]]

- Two pointer 로 sliding window 형식으로 풀면 된다.
	- 즉, 우선 `max` 를 0으로 초기화해놓고
	- `i` 를 1씩 움직이면서 `i + max` 에 해당하는 놈이 조건을 만족하는지 본다.
	- `max` 크기의 window 가 이 조건을 만족하는지 확인하는 셈
	- 그리고 만족한다면, window 의 크기를 1씩 증가시키며 점점 키워나가면 된다.
	- 이렇게 하면 window 의 크기가 계속 증가하며 최종 크기가 정답이 된다.
- 그래서 코드는:

```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))

class Solution {
public:
	int maxDistance(vector<int>& nums1, vector<int>& nums2) {
		int max = 0;

		for (int i = 0; i < nums1.size(); i++) {
			int j = i + max;

			while (j < nums2.size() && nums1[i] <= nums2[j]) {
				j++;
			}

			max = MAX(max, j - i - 1);
		}

		return max;
	}
};
```

## 다른 풀이 (Binary search)

> [!info]- 결과
> ![[Pasted image 20260420115220.png]]

> [!info]- 코드
> ```cpp
> #define MAX(a, b) ((a) > (b) ? (a) : (b))
>
> class Solution {
> 	int bsearch(vector<int> &field, int begin_idx, int target) {
> 		int l = begin_idx;
> 		int r = field.size() - 1;
>
> 		while (l + 1 < r) {
> 			int m = (l + r) >> 1;
>
> 			if (field[m] < target) {
> 				r = m;
> 			} else {
> 				l = m;
> 			}
> 		}
>
> 		if (target <= field[r]) {
> 			return r;
> 		} else if (target <= field[l]) {
> 			return l;
> 		}
>
> 		return begin_idx;
> 	}
> public:
> 	int maxDistance(vector<int>& nums1, vector<int>& nums2) {
> 		int max_distance = 0;
>
> 		for (int i = 0; i < nums1.size() && i < nums2.size(); i++) {
> 			int j = bsearch(nums2, i, nums1[i]);
>
> 			max_distance = MAX(max_distance, j - i);
> 		}
>
> 		return max_distance;
> 	}
> };
> ```

- Two pointer 를 사용하면 되겠다는 생각이 들긴 했는데, 어떻게 pointer 를 움직여야 할 지 바로 생각이 안난다면, `i` 를 순회하면서 이놈보다 크거나 같은 마지막 index 를 binary search 로 찾으면 된다.
	- 시간복잡도는 $O(nlogn)$ 이니까 timeout 은 안난다.
	- 물론 [[#최종|위]] 풀이보다는 느리지만 직관적으로 가장 빠르게 풀 수 있는 풀이다.