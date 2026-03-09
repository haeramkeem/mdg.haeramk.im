---
tags:
  - algorithm
  - algorithm-leetcode
date: 2026-03-09
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/binary-tree-right-side-view)

> [!tip] 요약
> - BFS 는 queue 를 활용하자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260309131223.png]]

- [[(LeetCode) 102. Binary Tree Level Order Traversal|Leetcode 102]] 처럼 queue 만들어서 BFS 돌렸다.
- 최종 코드는:

```c
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
/**
 * Note: The returned array must be malloced, assume caller calls free().
 */

/* Queue */

#define DEFAULT_Q_CAP (100)

struct TreeNode *q_data[100];

typedef struct {
	unsigned char begin_idx;
	unsigned char end_idx;
} Queue;

void clearQueue(Queue *q)
{
	q->begin_idx = 0;
	q->end_idx = 0;
}

void pushQueue(Queue *q, struct TreeNode *target)
{
	q_data[q->end_idx] = target;
	q->end_idx++;
}

struct TreeNode *popQueue(Queue *q)
{
	// Empty
	if (q->begin_idx == q->end_idx)
		return NULL;

	q->begin_idx++;
	return q_data[q->begin_idx - 1];
}

/* Encode/decode utils */
#define ENCODE(lv, val) (((lv) << 16) | (((val) + 100) & 0xFFFF))
#define DECODE_LV(arg) (((arg) >> 16) & 0xFFFF)
#define DECODE_VAL(arg) (((arg) & 0xFFFF) - 100)

int* rightSideView(struct TreeNode* root, int* returnSize)
{
	Queue q;
	struct TreeNode *iter;
	int max_lv = -1;
	int *ret;

	if (!root)
	{
		*returnSize = 0;
		return NULL;
	}

	clearQueue(&q);

	// 1. Encode val & get max level
	root->val = ENCODE(0, root->val);
	pushQueue(&q, root);

	while ((iter = popQueue(&q)))
	{
		int cur_lv = DECODE_LV(iter->val);

		max_lv = cur_lv > max_lv ? cur_lv : max_lv;

		if (iter->left)
		{
			iter->left->val = ENCODE(cur_lv + 1, iter->left->val);
			pushQueue(&q, iter->left);
		}

		if (iter->right)
		{
			iter->right->val = ENCODE(cur_lv + 1, iter->right->val);
			pushQueue(&q, iter->right);
		}
	}

	*returnSize = max_lv + 1;

	// 2. Fill `ret`
	clearQueue(&q);
	pushQueue(&q, root);

	ret = malloc(sizeof(int) * (max_lv + 1));

	while ((iter = popQueue(&q)))
	{
		int cur_lv = DECODE_LV(iter->val);

		ret[cur_lv] = DECODE_VAL(iter->val);

		if (iter->left)
			pushQueue(&q, iter->left);

		if (iter->right)
			pushQueue(&q, iter->right);
	}

	return ret;
}
```

- 메모리 사용량 줄이려고 몇가지 ([[#1. Resizable queue|이거 1]], [[#2. Compact circular queue|이거 2]]) 시도해 봤는데 딱히 달라지는건 없어서 그냥 위 코드로 가기로 함.

## 삽질 기록

### 1. Resizable queue

> [!info]- 결과
> ![[Pasted image 20260309122139.png]]

> [!info]- 코드
> ```c
> /**
>  * Definition for a binary tree node.
>  * struct TreeNode {
>  *     int val;
>  *     struct TreeNode *left;
>  *     struct TreeNode *right;
>  * };
>  */
> /**
>  * Note: The returned array must be malloced, assume caller calls free().
>  */
> 
> /* Queue */
> 
> #define DEFAULT_Q_CAP_EXP (4) // Cap == 2^4 == 16
> 
> typedef struct {
> 	struct TreeNode **data;
> 	unsigned char begin_idx;
> 	unsigned char end_idx;
> 	unsigned char cap_exp;
> } Queue;
> 
> void clearQueue(Queue *q)
> {
> 	q->begin_idx = 0;
> 	q->end_idx = 0;
> }
> 
> void initQueue(Queue *q)
> {
> 	q->data = malloc(sizeof(struct TreeNode *) * (1 << DEFAULT_Q_CAP_EXP));
> 	q->cap_exp = DEFAULT_Q_CAP_EXP;
> 	clearQueue(q);
> }
> 
> void freeQueue(Queue *q)
> {
> 	free(q->data);
> 	q->data = NULL;
> 	q->cap_exp = 0;
> 	clearQueue(q);
> }
> 
> void pushQueue(Queue *q, struct TreeNode *target)
> {
> 	// Full
> 	if (q->end_idx == (1 << q->cap_exp))
> 	{
> 		struct TreeNode **new_ptr;
> 
> 		if (!(new_ptr = realloc(q->data, sizeof(struct TreeNode *) * (1 << (q->cap_exp + 1)))))
> 		{
> 			// Panic
> 			freeQueue(q);
> 			return;
> 		}
> 
> 		q->data = new_ptr;
> 		q->cap_exp++;
> 	}
> 
> 	q->data[q->end_idx] = target;
> 	q->end_idx++;
> }
> 
> struct TreeNode *popQueue(Queue *q)
> {
> 	// Empty
> 	if (q->begin_idx == q->end_idx)
> 		return NULL;
> 
> 	q->begin_idx++;
> 	return q->data[q->begin_idx - 1];
> }
> 
> /* Encode/decode utils */
> #define ENCODE(lv, val) (((lv) << 16) | (((val) + 100) & 0xFFFF))
> #define DECODE_LV(arg) (((arg) >> 16) & 0xFFFF)
> #define DECODE_VAL(arg) (((arg) & 0xFFFF) - 100)
> 
> int* rightSideView(struct TreeNode* root, int* returnSize)
> {
> 	Queue q;
> 	struct TreeNode *iter;
> 	int max_lv = -1;
> 	int *ret;
> 
> 	if (!root)
> 	{
> 		*returnSize = 0;
> 		return NULL;
> 	}
> 
> 	initQueue(&q);
> 
> 	// 1. Encode val & get max level
> 	root->val = ENCODE(0, root->val);
> 	pushQueue(&q, root);
> 
> 	while ((iter = popQueue(&q)))
> 	{
> 		int cur_lv = DECODE_LV(iter->val);
> 
> 		max_lv = cur_lv > max_lv ? cur_lv : max_lv;
> 
> 		if (iter->left)
> 		{
> 			iter->left->val = ENCODE(cur_lv + 1, iter->left->val);
> 			pushQueue(&q, iter->left);
> 		}
> 
> 		if (iter->right)
> 		{
> 			iter->right->val = ENCODE(cur_lv + 1, iter->right->val);
> 			pushQueue(&q, iter->right);
> 		}
> 	}
> 
> 	*returnSize = max_lv + 1;
> 
> 	// 2. Fill `ret`
> 	clearQueue(&q);
> 	pushQueue(&q, root);
> 
> 	ret = malloc(sizeof(int) * (max_lv + 1));
> 
> 	while ((iter = popQueue(&q)))
> 	{
> 		int cur_lv = DECODE_LV(iter->val);
> 
> 		ret[cur_lv] = DECODE_VAL(iter->val);
> 
> 		if (iter->left)
> 			pushQueue(&q, iter->left);
> 
> 		if (iter->right)
> 			pushQueue(&q, iter->right);
> 	}
> 
> 	freeQueue(&q);
> 
> 	return ret;
> }
> ```

- [[(LeetCode) 102. Binary Tree Level Order Traversal|LeetCode 102]] 에서처럼 queue capacity 를 동적으로 바꿔봤는데, 별반 다르지 않았음.

### 2. Compact circular queue

> [!info]- 결과
> ![[Pasted image 20260309131151.png]]

> [!info]- 코드
> ```c
> /**
>  * Definition for a binary tree node.
>  * struct TreeNode {
>  *     int val;
>  *     struct TreeNode *left;
>  *     struct TreeNode *right;
>  * };
>  */
> /**
>  * Note: The returned array must be malloced, assume caller calls free().
>  */
> 
> /* Queue */
> 
> #define MAX_Q_CAP (65)
> #define MAX_Q_BYTE_CAP (64 * 7) // 10 cacheline
> 
> unsigned char q_data[MAX_Q_BYTE_CAP];
> 
> typedef struct {
> 	unsigned char begin_idx;
> 	unsigned char end_idx;
> } Queue;
> 
> void clearQueue(Queue *q)
> {
> 	q->begin_idx = 0;
> 	q->end_idx = 0;
> }
> 
> #define CONV_BYTE(ptr, pos) ((((intptr_t)(ptr)) >> ((pos) * 8)) & 0xFF)
> #define CONV_BYTE_IDX(idx, pos) ((idx) * 6 + (pos))
> #define CONV_PTR(base, idx) ((struct TreeNode *)((((intptr_t)((base)[(idx) * 6 + 0])) << (8 * 0)) \
> 							| (((intptr_t)((base)[(idx) * 6 + 1])) << (8 * 1)) \
> 							| (((intptr_t)((base)[(idx) * 6 + 2])) << (8 * 2)) \
> 							| (((intptr_t)((base)[(idx) * 6 + 3])) << (8 * 3)) \
> 							| (((intptr_t)((base)[(idx) * 6 + 4])) << (8 * 4)) \
> 							| (((intptr_t)((base)[(idx) * 6 + 5])) << (8 * 5))))
> 
> void pushQueue(Queue *q, struct TreeNode *target)
> {
> 	q_data[CONV_BYTE_IDX(q->end_idx, 0)] = CONV_BYTE(target, 0);
> 	q_data[CONV_BYTE_IDX(q->end_idx, 1)] = CONV_BYTE(target, 1);
> 	q_data[CONV_BYTE_IDX(q->end_idx, 2)] = CONV_BYTE(target, 2);
> 	q_data[CONV_BYTE_IDX(q->end_idx, 3)] = CONV_BYTE(target, 3);
> 	q_data[CONV_BYTE_IDX(q->end_idx, 4)] = CONV_BYTE(target, 4);
> 	q_data[CONV_BYTE_IDX(q->end_idx, 5)] = CONV_BYTE(target, 5);
> 
> 	q->end_idx = (q->end_idx + 1) % MAX_Q_CAP;
> }
> 
> struct TreeNode *popQueue(Queue *q)
> {
> 	struct TreeNode *ret;
> 
> 	// Empty
> 	if (q->begin_idx == q->end_idx)
> 		return NULL;
> 
> 	ret = CONV_PTR(q_data, q->begin_idx);
> 
> 	q->begin_idx = (q->begin_idx + 1) % MAX_Q_CAP;
> 
> 	return ret;
> }
> 
> /* Encode/decode utils */
> #define ENCODE(lv, val) (((lv) << 16) | (((val) + 100) & 0xFFFF))
> #define DECODE_LV(arg) (((arg) >> 16) & 0xFFFF)
> #define DECODE_VAL(arg) (((arg) & 0xFFFF) - 100)
> 
> int* rightSideView(struct TreeNode* root, int* returnSize)
> {
> 	Queue q;
> 	struct TreeNode *iter;
> 	int max_lv = -1;
> 	int *ret;
> 
> 	if (!root)
> 	{
> 		*returnSize = 0;
> 		return NULL;
> 	}
> 
> 	clearQueue(&q);
> 
> 	// 1. Encode val & get max level
> 	root->val = ENCODE(0, root->val);
> 	pushQueue(&q, root);
> 
> 	while ((iter = popQueue(&q)))
> 	{
> 		int cur_lv = DECODE_LV(iter->val);
> 
> 		max_lv = cur_lv > max_lv ? cur_lv : max_lv;
> 
> 		if (iter->left)
> 		{
> 			iter->left->val = ENCODE(cur_lv + 1, iter->left->val);
> 			pushQueue(&q, iter->left);
> 		}
> 
> 		if (iter->right)
> 		{
> 			iter->right->val = ENCODE(cur_lv + 1, iter->right->val);
> 			pushQueue(&q, iter->right);
> 		}
> 	}
> 
> 	*returnSize = max_lv + 1;
> 
> 	// 2. Fill `ret`
> 	clearQueue(&q);
> 	pushQueue(&q, root);
> 
> 	ret = malloc(sizeof(int) * (max_lv + 1));
> 
> 	while ((iter = popQueue(&q)))
> 	{
> 		int cur_lv = DECODE_LV(iter->val);
> 
> 		ret[cur_lv] = DECODE_VAL(iter->val);
> 
> 		if (iter->left)
> 			pushQueue(&q, iter->left);
> 
> 		if (iter->right)
> 			pushQueue(&q, iter->right);
> 	}
> 
> 	return ret;
> }
> ```

- Idea 는:
	1. Pointer 는 64bit 자료형이지만 실제로는 48bit 만 사용한다. 그래서 [[#최종|static array 이용한 구현체]] 에서 각 entry 가 6byte 만 사용하도록 packing 해주었다.
	2. 최대 node 의 수가 100 개 이므로 queue 에 한번에 담기는 최대 node 의 수를 계산할 수 있다.
		- 간단히 말하면, 한번에 최대한 많은 node 가 queue 에 들어가려면 full binary tree 이어야 하고, 이때의 최대 level 수는 6 (root 가 level 0) 이다.
		- Queue 에 들어간 다음 child 두개를 넣고 빠진다는 점을 생각하여 각 시점에서 최대로 queue 에 담기는 최대 개수를 추려보면, 대략 65개가 나온다.
		- 이것을 이용해 idea 1 과 연관지어서 $65 \times 6 = 390$ byte 이므로 cacheline 을 생각해 7 cacheline ($64 \times 7 = 448$ byte) 을 static 으로 잡아두었다.
- 근데 별로 나아지진 않아 헛수고.