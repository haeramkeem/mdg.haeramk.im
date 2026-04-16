---
tags:
  - mdg
  - algorithm
  - interview
  - mapset
date: 2026-04-16
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/closest-equal-element-queries)

> [!tip] 요약
> - 탐색을 돕는 자료구조를 잘 선택하기

## 최종

> [!info]- 결과
> ![[Pasted image 20260416102234.png]]

- 같은 값을 가지는 index 들을 전부 vector 에 넣은 다음, query 의 index 를 이용해 해당 index 에 대한 vector 내에서의 위치를 binary search 로 찾아 양옆으로의 distance 를 구하는 방식으로 구현함.

```cpp
#define MIN(a, b) ((a) < (b) ? (a) : (b))

class Solution {
	int bsearch(vector<int> &field, int target) {
		int l = 0;
		int r = field.size() - 1;

		while (l + 1 < r) {
			int m = (l + r) >> 1;

			if (field[m] < target) {
				l = m;
			} else {
				r = m;
			}
		}

		if (field[l] == target) {
			return l;
		}

		return r;
	}
public:
	vector<int> solveQueries(vector<int>& nums, vector<int>& queries) {
		map<int, vector<int>> num_to_idx;
		vector<int> ret;

		for (int i = 0; i < nums.size(); i++) {
			num_to_idx[nums[i]].push_back(i);
		}

		for (int q : queries) {
			auto &idxs = num_to_idx[nums[q]];
			int size = idxs.size();

			if (size == 1) {
				ret.push_back(-1);
				continue;
			}

			int idx = bsearch(idxs, q);

			if (idx == 0) {
				ret.push_back(MIN(idxs[1] - idxs[0], nums.size() + idxs[0] - idxs[size - 1]));
			} else if (idx == size - 1) {
				ret.push_back(MIN(idxs[idx] - idxs[idx - 1], nums.size() - idxs[idx] + idxs[0]));
			} else {
				ret.push_back(MIN(idxs[idx + 1] - idxs[idx], idxs[idx] - idxs[idx - 1]));
			}
		}

		return ret;
	}
};
```

- 성능은 구린데 다른 solution 봐도 크게 다르지 않는듯

## 삽질 기록

- [[#최종|위]] 의 성능이 구려서 추가적으로 시도해본 것들

### List 사용

> [!info]- 결과
> ![[Pasted image 20260416110845.png]]

> [!info]- 코드
> ```cpp
> #define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))
> #define MIN(a, b) ((a) < (b) ? (a) : (b))
> #define MIN4(a, b, c, d) (MIN(MIN((a), (b)), MIN((c), (d))))
>
> class Solution {
> public:
> 	vector<int> solveQueries(vector<int>& nums, vector<int>& queries) {
> 		map<int, int> before_tbl;
> 		map<int, int> first_idx;
> 		vector<int> before_idx(nums.size(), -1);
> 		vector<int> after_idx(nums.size(), -1);
> 		vector<int> ret(queries.size(), -1);
>
> 		for (int i = 0; i < nums.size(); i++) {
> 			if (before_tbl.find(nums[i]) != before_tbl.end()) {
> 				int idx = before_tbl[nums[i]];
>
> 				before_idx[i] = idx;
> 				after_idx[idx] = i;
> 			}
>
> 			before_tbl[nums[i]] = i;
>
> 			if (first_idx.find(nums[i]) == first_idx.end()) {
> 				first_idx[nums[i]] = i;
> 			}
> 		}
>
> 		for (int i = 0; i < nums.size(); i++) {
> 			if (before_idx[i] == -1) {
> 				if (before_tbl[nums[i]] != i) {
> 					before_idx[i] = before_tbl[nums[i]];
> 				}
> 			}
>
> 			if (after_idx[i] == -1) {
> 				if (first_idx[nums[i]] != i) {
> 					after_idx[i] = first_idx[nums[i]];
> 				}
> 			}
> 		}
>
> 		for (int i = 0; i < queries.size(); i++) {
> 			int q = queries[i];
> 			int before = before_idx[q];
> 			int after = after_idx[q];
>
> 			if (before == -1 || after == -1) {
> 				ret[i] = -1;
> 			} else {
> 				ret[i] = MIN4(ABS_DIFF(q, before), nums.size() - before + q, ABS_DIFF(q, after), nums.size() - q + after);
> 			}
> 		}
>
> 		return ret;
> 	}
> };
> ```

- 특정 index 에 대해, 같은 값을 가지는 이전/이후의 index 를 list 로 연결해서 빠르게 이전/이후 index 를 찾아 distance 를 구하는 방식
- 이것도 느리다.

### Set 사용

> [!info]- 결과
> ![[Pasted image 20260416102154.png]]

> [!info]- 코드
> ```cpp
> #define MIN(a, b) ((a) < (b) ? (a) : (b))
>
> class Solution {
> public:
> 	vector<int> solveQueries(vector<int>& nums, vector<int>& queries) {
> 		map<int, set<int>> num_to_idx;
> 		vector<int> ret;
>
> 		for (int i = 0; i < nums.size(); i++) {
> 			num_to_idx[nums[i]].insert(i);
> 		}
>
> 		for (int q : queries) {
> 			auto &idxs = num_to_idx[nums[q]];
> 			int size = idxs.size();
>
> 			if (size == 1) {
> 				ret.push_back(-1);
> 				continue;
> 			}
>
> 			auto pos = idxs.find(q);
> 			auto r_pos = pos;
> 			r_pos++;
>
> 			if (pos == idxs.begin()) {
> 				ret.push_back(MIN(*r_pos - *pos, nums.size() + *pos - *(idxs.rbegin())));
> 				continue;
> 			}
>
> 			auto l_pos = pos;
> 			l_pos--;
> 			
> 			if (r_pos == idxs.end()) {
> 				ret.push_back(MIN(*pos - *l_pos, nums.size() - *pos + *(idxs.begin())));
> 			} else {
> 				ret.push_back(MIN(*r_pos - *pos, *pos - *l_pos));
> 			}
> 		}
>
> 		return ret;
> 	}
> };
> ```

- [[#최종|위]] 코드에서 binary search 대신 `set` 의 [[Red-black Tree, RB Tree (Database Index)|RB Tree]] 를 사용한 방식
- 그래도 느리다.

### 거리 증가

> [!info]- 코드
> ```cpp
> #define u32 unsigned int
> #define MAX_U32 (0xFFFFFFFF)
>
> #define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))
> #define MIN(a, b) ((a) < (b) ? (a) : (b))
> #define MIN4(a, b, c, d) (MIN(MIN((a), (b)), MIN((c), (d))))
>
> class Solution {
> public:
> 	vector<int> solveQueries(vector<int>& nums, vector<int>& queries) {
> 		map<int, int> num_set;
> 		vector<int> ret;
>
> 		for (int num : nums) {
> 			num_set[num]++;
> 		}
>
> 		for (int q : queries) {
> 			if (num_set[nums[q]] == 1) {
> 				ret.push_back(-1);
> 				continue;
> 			}
>
> 			for (int i = 1; i < nums.size(); i++) {
> 				if (nums[(q + i) % nums.size()] == nums[q]) {
> 					ret.push_back(i);
> 					break;
> 				} else if (nums[(q - i + nums.size()) % nums.size()] == nums[q]) {
> 					ret.push_back(i);
> 					break;
> 				}
> 			}
> 		}
>
> 		return ret;
> 	}
> };
> ```

- Distance 를 1씩 증가시켜가면서 처음으로 만나는 값이 같은 놈을 찾는 방식.
- Timeout 난다.

### 같은 숫자 index 순회

> [!info]- 코드
> ```cpp
> #define u32 unsigned int
> #define MAX_U32 (0xFFFFFFFF)
>
> #define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))
> #define MIN(a, b) ((a) < (b) ? (a) : (b))
> #define MIN4(a, b, c, d) (MIN(MIN((a), (b)), MIN((c), (d))))
>
> class Solution {
> public:
> 	vector<int> solveQueries(vector<int>& nums, vector<int>& queries) {
> 		map<int, vector<int>> num_to_idx;
> 		vector<int> ret;
>
> 		for (int i = 0; i < nums.size(); i++) {
> 			num_to_idx[nums[i]].push_back(i);
> 		}
>
> 		for (int q : queries) {
> 			u32 min = MAX_U32;
>
> 			for (int idx : num_to_idx[nums[q]]) {
> 				if (idx != q) {
> 					min = MIN4(min, ABS_DIFF(q, idx), nums.size() - q + idx, nums.size() - idx + q);
> 				}
> 			}
>
> 			ret.push_back(min);
> 		}
>
> 		return ret;
> 	}
> };
> ```

- [[#최종|위]] 코드에서 binary search 안하고 그냥 처음부터 순회하는 방식.
- Timeout 난다.