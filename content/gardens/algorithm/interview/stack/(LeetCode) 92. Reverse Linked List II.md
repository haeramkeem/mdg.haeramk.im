---
tags:
  - mdg
  - algorithm
  - interview
  - stack
date: 2026-04-13
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/reverse-linked-list-ii)

> [!tip] 요약
> - 순서 뒤집기도 stack이다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260413201706.png]]

- 순서를 뒤집을때도 stack을 사용하면 되는데,
- 이 문제의 경우 그냥 숫자만 바꾸면 된다: [[#다른 코드 (C++)|이놈]] 처럼 포인터를 조작해서 `ListNode` 자체를 옮기려고 하지 않아도 된다.

```cpp
class Solution {
public:
	ListNode* reverseBetween(ListNode* head, int left, int right) {
		if (left == right) {
			return head;
		}

		ListNode *sub_head;
		ListNode *iter = head;
		stack<int> vals;

		for (int i = 1; iter; i++) {
			if (i == left) {
				sub_head = iter;
				vals.push(iter->val);
			} else if (left < i && i < right) {
				vals.push(iter->val);
			} else if (i == right) {
				vals.push(iter->val);
				for (int j = 0; j < right - left + 1; j++) {
					sub_head->val = vals.top();
					vals.pop();
					sub_head = sub_head->next;
				}
				break;
			}

			iter = iter->next;
		}

		return head;
	}
};
```

## 다른 코드 (C++)

> [!info]- 결과
> ![[Pasted image 20260413202035.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	ListNode* reverseBetween(ListNode* head, int left, int right) {
> 		auto preHead = new ListNode(INT_MIN, head);
>
> 		auto leftBound = preHead;
> 		for(int i = 0; i < left - 1; i++) {
> 			leftBound = leftBound->next;
> 		}
>
> 		auto rightBound = leftBound->next;
> 		stack<ListNode*> stk;
> 		for (int i = 0; i < right - left + 1; i++) {
> 			stk.push(rightBound);
> 			rightBound = rightBound->next;
> 		}
>
> 		while (!stk.empty()) {
> 			leftBound->next = stk.top();
> 			leftBound = leftBound->next;
> 			stk.pop();
> 		}
> 		leftBound->next = rightBound;
>
> 		head = preHead->next;
> 		delete preHead;
>
> 		return head;
> 	}
> };
> ```

- 이게 `ListNode` 자체를 옮겨버리는 코드
- 이전에 구현한거 여기로 옮겨놓는다.