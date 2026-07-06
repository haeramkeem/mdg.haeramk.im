---
tags:
  - mdg
  - algorithm
  - interview
  - linked-list
date: 2026-07-05
aliases:
  - LeetCode 160
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/intersection-of-two-linked-lists)

> [!tip] 요약
> - 태깅하고 태그 찾기

## 최종

> [!info]- 결과
> ![[Pasted image 20260705074333.png]]

- 그냥 list 하나의 `val` 들을 전부 태깅한 후, 나머지 list 를 iterate 하며 태깅된 놈을 찾는다.
	- 뭐 더 최적화시킬수는 있겠지만 귀찮아서 그냥 냅뒀다.

```cpp
#define TAG (0x80000000)
#define UNTAG (0x7FFFFFFF)

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
	ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
		ListNode *ret = nullptr;

		for (auto it = headA; it; it = it->next) {
			it->val |= TAG;
		}

		for (auto it = headB; it; it = it->next) {
			if (it->val & TAG) {
				ret = it;
				break;
			}
		}

		for (auto it = headA; it; it = it->next) {
			it->val &= UNTAG;
		}

		return ret;
	}
};
```
