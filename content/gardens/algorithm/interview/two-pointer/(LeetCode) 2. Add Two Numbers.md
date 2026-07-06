---
tags:
  - mdg
  - algorithm
  - interview
  - two-pointer
date: 2026-06-29
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/add-two-numbers)

> [!tip] 요약
> - Two pointer 로 풀면 된다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260629104551.png]]

- 그냥 Two pointer 로 풀면 되는데, trailing zero 처리하는게 좀 까다로울 수 있다.
- 아래 코드를 보자.

```cpp {20-21,52-55}
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
	ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
		if (!l1 && !l2) {
			return nullptr;
		}

		ListNode *l1_it = l1;
		ListNode *l2_it = l2;
		ListNode *ret = new ListNode(-1); // Dummy head
		ListNode *ret_it = ret;
		int overflow = 0;

		while (true) {
			int digit = overflow;

			if (l1_it && l2_it) {
				digit += l1_it->val + l2_it->val;

				l1_it = l1_it->next;
				l2_it = l2_it->next;
			} else if (l1_it) {
				digit += l1_it->val;

				l1_it = l1_it->next;
			} else if (l2_it) {
				digit += l2_it->val;

				l2_it = l2_it->next;
			} else /* !l1_it && !l2_it */ {
				if (digit) {
					ret_it->next = new ListNode(digit % 10);
				}
				break;
			}

			ret_it->next = new ListNode(digit % 10);
			overflow = digit / 10;
			ret_it = ret_it->next;
		}

		// Delete dummy head
		ret_it = ret;
		ret = ret->next;
		delete ret_it;

		return ret;
	}
};
```

- 선택한 방법은 dummy head 를 사용하는 것이다.
	- 이 dummy head 는 말 그대로 dummy 이며, 이놈의 `next` 부터 유효한 list 가 시작된다.
	- 이것을 사용하는 이유는 `ret_it` 가 항상 list 의 tail 을 따라가도록 하기 위해서이다.
	- Dummy head 를 사용하지 않으면, `ret_it` 가 list 의 tail 의 next 를 따라가게 하는 식으로 구현해야 한다.
		- 즉, `ret_it->val` 을 채운 뒤 `ret_it->next` 를 생성하고 `ret_it` 을 `ret_it->next` 로 바꾸는 식이다.
		- 하지만 이렇게 하면 trailing zero 를 처리하는 과정에서 `if` branch 사용해서 꼼지락대야 한다.
	- 그래서 이런 dummy head 를 통해 `ret_it` 가 list tail 의 next 가 아닌 list tail 을 따라가게 하는 것이다.

## 다른 풀이

### JavaScript

> [!info]- 결과
> ![[Pasted image 20260629104832.png]]

> [!info]- 코드
> ```js
> /**
>  * Definition for singly-linked list.
>  * function ListNode(val, next) {
>  *	 this.val = (val===undefined ? 0 : val)
>  *	 this.next = (next===undefined ? null : next)
>  * }
>  */
> /**
>  * @param {ListNode} l1
>  * @param {ListNode} l2
>  * @return {ListNode}
>  */
> var addTwoNumbers = function(l1, l2) {
> 	let i1 = l1;
> 	let i2 = l2;
> 	let overflow = 0;
> 	let isL1Longer = true;
> 	let oneBefore = null;
> 	while (true) {
> 		if (!!i1 && !!i2) {
> 			// Get sum
> 			overflow += i1.val + i2.val;
> 			// Sync
> 			i1.val = overflow % 10;
> 			i2.val = i1.val;
> 			// Calc overflow
> 			overflow = Math.floor(overflow / 10);
> 			// Move
> 			oneBefore = i1;
> 			i1 = i1.next;
> 			i2 = i2.next;
> 		} else if (!!i1) {
> 			overflow += i1.val;
> 			i1.val = overflow % 10;
> 			overflow = Math.floor(overflow / 10);
> 			oneBefore = i1;
> 			i1 = i1.next;
> 		} else if (!!i2) {
> 			overflow += i2.val;
> 			i2.val = overflow % 10;
> 			overflow = Math.floor(overflow / 10);
> 			oneBefore = i2;
> 			i2 = i2.next;
> 			isL1Longer = false;
> 		} else {
> 			// If overflow is not empty
> 			if (overflow !== 0) {
> 				oneBefore.next = new ListNode();
> 				oneBefore.next.val = overflow;
> 			}
> 			break;
> 		}
> 	}
>
> 	return isL1Longer ? l1 : l2;
> };
> ```

- 이전에 자바스크립트로 푼 풀이가 있어서 여기로 옮겨버리기