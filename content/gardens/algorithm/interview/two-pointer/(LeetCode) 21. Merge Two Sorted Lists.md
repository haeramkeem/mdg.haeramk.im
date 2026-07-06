---
tags:
  - mdg
  - algorithm
  - interview
  - two-pointer
date: 2026-06-30
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/merge-two-sorted-lists)

> [!tip] 요약
> - Two pointer 로 merge operation 구현하면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260630091339.png]]

- 그냥 Two pointer 로 merge operation 구현하면 된다.

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
	ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
		ListNode dummy;
		ListNode *res_it = &dummy;
		ListNode *l1_it = list1;
		ListNode *l2_it = list2;

		while (l1_it || l2_it) {
			if (l1_it && l2_it) {
				if (l1_it->val <= l2_it->val) {
					res_it->next = l1_it;
					l1_it = l1_it->next;
					res_it = res_it->next;
				} else /* (l2_it->val < l1_it->val) */ {
					res_it->next = l2_it;
					l2_it = l2_it->next;
					res_it = res_it->next;
				}
			} else if (l1_it) {
				res_it->next = l1_it;
				break;
			} else if (l2_it) {
				res_it->next = l2_it;
				break;
			} else /* (!l1_it && !l2_it) */ {
				// End of loop (do nothing)
			}
		}

		return dummy.next;
	}
};
```

- [[(LeetCode) 2. Add Two Numbers|LeetCode 2]] 에서처럼 `dummy` head 이용해서 코드 리팩토링을 좀 했다.