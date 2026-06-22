---
tags:
  - mdg
  - algorithm
  - interview
  - two-pointer
date: 2026-06-22
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/two-sum)

> [!tip] 요약
> - Two pointer 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260622155624.png]]

- 그냥 정렬한 다음 양옆에 two pointer 를 두고 좁혀가면 된다.

```cpp
class Solution {
public:
	vector<int> twoSum(vector<int>& nums, int target) {
		vector<pair<int, int>> sorted;
		int l = 0;
		int r = nums.size() - 1;

		for (int i = 0; i < nums.size(); i++) {
			sorted.push_back({i, nums[i]});
		}

		sort(sorted.begin(), sorted.end(), [](auto &a, auto &b) {
			return a.second < b.second;
		});

		while (l < r) {
			if (sorted[l].second + sorted[r].second < target) {
				l++;
			} else if (sorted[l].second + sorted[r].second > target) {
				r--;
			} else {
				break;
			}
		}

		return {sorted[l].first, sorted[r].first};
	}
};
```

## 다른 풀이

### Map

> [!info]- 결과
> ![[Pasted image 20260622155732.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	vector<int> twoSum(vector<int>& nums, int target) {
> 		map<int, int> mapTemp;
> 		for(int i = 0; i < nums.size(); i++) {
> 			if(mapTemp.find(nums[i]) != mapTemp.end() && mapTemp[nums[i]] != i) {
> 				return {mapTemp[nums[i]], i};
> 			}
> 			mapTemp[target - nums[i]] = i;
> 		}
> 		return {};
> 	}
> };
> ```

- 옛날에 정답지보고 푼거같은데
- 각 원소에 대해 `target` 과의 차이와 index 를 `map` 에 넣어둔 뒤 각 원소에 대해 `map` 에서 조회했을 때 결과가 조회된다면 더했을 때 `target` 이 되는 쌍을 찾은 것이므로 `map` 에 저장된 index 와 현재 원소의 index 를 반환하면 된다.
- 근데 속도는 좀 느리네