---
tags:
  - mdg
  - algorithm
  - interview
  - linked-list
date: 2026-07-05
aliases:
  - LeetCode 141
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/linked-list-cycle)

> [!tip] 요약
> - 쉬운문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260705064753.png]]

- 이게 뭔 문젠진 모르겠는데, 어쨋든 방문한 노드를 체크해주면서 cycle 이 있는지 확인해주면 된다.

```cpp
#define MAX_INT (0x7FFFFFFF)

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *	 int val;
 *	 ListNode *next;
 *	 ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
	bool hasCycle(ListNode *head) {
		while (head) {
			if (head->val == MAX_INT) {
				return true;
			}

			head->val = MAX_INT;
			head = head->next;
		}

		return false;
	}
};
```
