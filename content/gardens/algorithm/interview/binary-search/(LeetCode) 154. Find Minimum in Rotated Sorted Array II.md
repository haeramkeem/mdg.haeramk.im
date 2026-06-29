---
tags:
  - mdg
  - algorithm
  - interview
  - binary-search
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii)

> [!tip] 요약
> - 경우의 수를 잘 나눠서 생각해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260622170027.png]]

- [[(LeetCode) 153. Find Minimum in Rotated Sorted Array|LeetCode 153]] 과 비슷한 문제인데, 중복된 값이 들어있을 수 있다는 점에서 문제의 난이도가 올라간다.
- 우선 코드부터 보고 설명하자:

```cpp
#define MIN(a, b) ((a) < (b) ? (a) : (b))

class Solution {
	int findMinImpl(vector<int>& nums, int l, int r) {
		while (l + 1 < r) {
			int m = (l + r) >> 1;

			if (nums[l] > nums[m]) {
				// Case A) Abnormal in [l, m]
				r = m;
			} else if (nums[m] > nums[r]) {
				// Case B) Abnormal in [m, r]
				l = m;
			} else if (nums[l] == nums[m] && nums[m] == nums[r]) {
				// Case C) Flat
				int l_min = findMinImpl(nums, l, m);
				int r_min = findMinImpl(nums, m, r);

				return MIN(l_min, r_min);
			} else {
				// Case D) Not rotated
				return nums[l];
			}
		}

		return MIN(nums[l], nums[r]);
	}
public:
	int findMin(vector<int>& nums) {
		return findMinImpl(nums, 0, nums.size() - 1);
	}
};
```

- 위 코드를 보면 4가지의 경우의 수가 있는 것을 알 수 있다:
	1) Case A: `nums[l]` 이 `nums[m]` 보다 큰 경우
		- 이때는 무조건 `l` ~ `m` 사이에서 최소가 형성된다. 그래서 `r` 을 `m` 으로 땡겨준다.
	2) Case B: `nums[m]` 이 `nums[r]` 보다 큰 경우
		- 이때는 무조건 `m` ~ `r` 사이에서 최소가 형성된다. 그래서 `l` 을 `m` 으로 땡겨준다.
	3) Case C: `nums[l]`, `nums[m]`, `nums[r]` 이 모두 같은 경우
		- 이때는 양쪽 어디에 최소가 있는지 알 수 없다. 그래서 양쪽 모두에 대해 binary search 를 해야 한다.
	4) Case A: 그렇지 않은 경우
		- 이때는 무조건 `l` ~ `r` 이 정렬되어 있다는 의미이다. 그래서 그냥 `nums[l]` 이 최소가 된다.
- 근데 이 4가지의 경우밖에 없을까? 그렇다. 이 4가지밖에 없다. 모든 경우의 수를 정리해보면 이 4가지로 수렴하기 때문이다:

| `l`, `m` 관계             | `m`, `r` 관계             | 해당하는 Case | 이유                                                                                                                                                 |
| ----------------------- | ----------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nums[l]` <  `nums[m]`  | `nums[m]` <  `nums[r]`  | D         | 이건 정렬되어있을 수 밖에 없다.                                                                                                                                 |
| `nums[l]` <  `nums[m]`  | `nums[m]` ==  `nums[r]` | D         | `m` ~ `r` 관계가 "같음" 이므로 이 사이에서 drop 이 발생했을 수는 있다. 근데 생각해보면 그건 불가능하다. 여기에서 drop 이 있었다면 `nums[r]` <= `nums[l]` 이어야 한다. 따라서 drop 이 없었고, Case D 에 해당한다. |
| `nums[l]` <  `nums[m]`  | `nums[m]` >  `nums[r]`  | B         | 이건 `m` ~ `r` 사이에서 drop 이 있었을 수 밖에 없다.                                                                                                              |
| `nums[l]` ==  `nums[m]` | `nums[m]` <  `nums[r]`  | D         | `l` ~ `m` 관계가 "같음" 이므로 이 사이에서 drop 이 발생했을 수는 있다. 근데 생각해보면 그건 불가능하다. 여기에서 drop 이 있었다면 `nums[r]` <= `nums[l]` 이어야 한다. 따라서 drop 이 없었고, Case D 에 해당한다. |
| `nums[l]` ==  `nums[m]` | `nums[m]` ==  `nums[r]` | C         | `l` ~ `m` 관계가 "같음" 이고 `m` ~ `r` 관계도 "같음" 이므로 이 양쪽에 대해 drop 이 발생했을 가능성이 모두 있다. 그래서 양쪽을 모두 검사해봐야 한다.                                                 |
| `nums[l]` ==  `nums[m]` | `nums[m]` >  `nums[r]`  | B         | 이건 `m` ~ `r` 사이에서 drop 이 있었을 수 밖에 없다.                                                                                                              |
| `nums[l]` >  `nums[m]`  | `nums[m]` <  `nums[r]`  | A         | 이건 `l` ~ `m` 사이에서 drop 이 있었을 수 밖에 없다.                                                                                                              |
| `nums[l]` >  `nums[m]`  | `nums[m]` ==  `nums[r]` | A         | 이건 `l` ~ `m` 사이에서 drop 이 있었을 수 밖에 없다.                                                                                                              |
| `nums[l]` >  `nums[m]`  | `nums[m]` >  `nums[r]`  | 불가능       | 양쪽 어디서든 drop 이 있었다면 `nums[r]` <= `nums[l]` 이어야 한다. 따라서 drop 은 없었는데, 그럼 오름차순 정렬이 되어 있어야 한다. 이 경우는 절대로 발생하지 않는다.                                     |

- 위 표에 있는 내용을 그림그려가며 잘 생각해 보자. 위의 표에 적혀있는 대로, 4가지의 경우로 수렴할 수 밖에 없다.