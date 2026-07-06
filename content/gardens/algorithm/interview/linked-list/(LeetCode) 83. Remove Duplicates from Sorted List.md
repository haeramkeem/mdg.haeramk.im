---
tags:
  - mdg
  - algorithm
  - interview
  - linked-list
date: 2026-07-03
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-list)

> [!tip] 요약
> - 심플한 linked list 조작문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260703124805.png]]

- 중복 없애는 문젠데, 사실상 그냥 linked list 조작하는 문제다.

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *	 int val;
 *	 ListNode *next;
 *	 ListNode() : val(0), next(nullptr) {}
 *	 ListNode(int x) : val(x), next(nullptr) {}
 *	 ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
	ListNode* deleteDuplicates(ListNode* head) {
		if (!head) {
			return nullptr;
		}

		auto it_prev = head;
		auto it = head->next;

		while (it) {
			if (it->val == it_prev->val) {
				it_prev->next = it->next;
				delete it;
				it = it_prev->next;
			} else {
				it_prev = it;
				it = it->next;
			}
		}

		return head;
	}
};
```
