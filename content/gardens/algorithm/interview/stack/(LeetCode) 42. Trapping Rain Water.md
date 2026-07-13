---
tags:
  - mdg
  - algorithm
  - interview
  - stack
date: 2026-07-11
aliases:
  - LeetCode 42
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/trapping-rain-water)

> [!tip] 요약
> - 증감이 바뀌는 지점을 찾는거는 stack 을 사용하자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260711080137.png]]

- [[(LeetCode) 739. Daily Temperatures|LeetCode 739]] 랑 같은 문제다. 증감이 바뀌는 지점을 찾는거는 stack 을 사용하면 된다.

```cpp
struct BlockInfo {
	int height;
	int idx;
};

class Solution {
public:
	int trap(vector<int>& height) {
		int n = height.size();
		stack<BlockInfo> stk;
		int trapped = 0;

		for (int i = 0; i < n; i++) {
			if (stk.empty()) {
				stk.push({height[i], i});
			} else {
				int cur_height = stk.top().height;

				if (cur_height > height[i]) {
					/**
					 * Top
					 *    ↘
					 *      Current
					 */
					stk.push({height[i], i});
				} else if (cur_height < height[i]) {
					while (true) {
						stk.pop();

						if (stk.empty()) {
							stk.push({height[i], i});
							break;
						}

						auto &top = stk.top();

						if (top.height > height[i]) {
							/**
							 * Top
							 *    ↘       Current
							 *      ↘   ↗
							 *        --
							 */
							trapped += (height[i] - cur_height) * (i - top.idx - 1);
							stk.push({height[i], i});
							break;
						} else if (top.height < height[i]) {
							/**
							 *            Current
							 * Top      ↗
							 *    ↘   ↗
							 *      --
							 */
							trapped += (top.height - cur_height) * (i - top.idx - 1);
							cur_height = top.height;
						} else /* (top.height == height[i]) */ {
							/**
							 * Top      Current
							 *    ↘   ↗
							 *      --
							 */
							trapped += (height[i] - cur_height) * (i - top.idx - 1);
							top.idx = i; // Delete [top.idx,i)
							break;
						}
					}
				} else /* (cur_height == height[i]) */ {
					/**
					 * Top →  Current
					 */
					stk.top().idx = i; // Delete [top.idx,i)
				}
			}
		}

		return trapped;
	}
};
```

## 다른 풀이

### Python

> [!info]- 결과
> ![[Pasted image 20260711080846.png]]

> [!info]- 코드
> ```python
> class Solution:
> 	def trap(self, height):
> 		deq = collections.deque()
> 		n = len(height)
> 		water = 0
> 		if(n < 3) :
> 			return 0
> 		for i in range(len(height) - 1) :
> 			if(height[i] > height[i + 1]) :
> 				deq.append((i, height[i + 1]))
> 			elif(height[i] < height[i + 1]) :
> 				if(deq) :
> 					wall_index, floor = deq.pop()
> 					water = water + (min(height[i +1], height[wall_index]) - floor) * (i - wall_index)
> 					if(height[wall_index] > height[i + 1]) :
> 						deq.append((wall_index, height[i + 1]))
> 					elif(height[wall_index] < height[i + 1]) :
> 						temp_deq = collections.deque()
> 						while(deq) :
> 							(temp_wall_index, temp_floor) = deq.pop()
> 							temp_deq.append((temp_wall_index, temp_floor))
> 							if(height[temp_wall_index] >= height[i + 1]) :
> 								deq.append((temp_wall_index, height[i + 1]))
> 								break
> 						while(temp_deq) :
> 							(temp_wall_index, temp_floor) = temp_deq.pop()
> 							water = water + (min(height[temp_wall_index], height[i + 1]) - temp_floor) * (i - temp_wall_index)
>
> 		return water
> ```

- 옛날에 python 으로 푼게 있어서 여기로 옮기기