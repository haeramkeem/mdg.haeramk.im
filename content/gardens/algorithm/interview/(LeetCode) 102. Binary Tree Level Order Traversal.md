---
tags:
  - algorithm
  - algorithm-leetcode
date: 2026-03-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/binary-tree-level-order-traversal)

> [!tip] 요약
> - BFS 는 queue 를 활용하자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260308184654.png]]

- 처음에는 그냥 DFS 로 돌면서 memoize 를 했으나 ([[#1. Memoize|여기]]) 뭔가 꼬롬해서 정답을 보니 queue 를 활용한다는 것을 알게 되었다.
	- Root 를 queue 에 넣어서 시작
	- Queue head 를 pop 하고 그놈의 child 를 push
	- Queue 가 empty 될 때까지 반복
	- 이렇게 하면 자연스레 BFS 로 순회하게 된다.
- 코드를 깔끔하게 짠 건 아니지만 어쨋든 결과는:
	- C 언어로 하면 개빡치게 queue 를 구현해서 써야 하고 solution function (`levelOrder`) 도 거지같이 준다. 그래서 코드가 좀 더러워짐

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
 * Return an array of arrays of size *returnSize.
 * The sizes of the arrays are returned as *returnColumnSizes array.
 * Note: Both returned array and *columnSizes array must be malloced, assume caller calls free().
 */

#define DEFAULT_Q_CAP (16)

typedef struct {
	struct TreeNode **data;
	unsigned short cap;
	unsigned short begin_idx;
	unsigned short end_idx;
} Queue;

void clearQ(Queue *q)
{
	q->begin_idx = 0;
	q->end_idx = 0;
}

void initQ(Queue *q)
{
	q->data = malloc(sizeof(struct TreeNode *) * DEFAULT_Q_CAP);
	q->cap = DEFAULT_Q_CAP;
	clearQ(q);
}

void freeQ(Queue *q)
{
	free(q->data);
	q->data = NULL;
	q->cap = 0;
	clearQ(q);
}

void pushQ(Queue *q, struct TreeNode *tree_node)
{
	if (q->end_idx == q->cap)
	{
		struct TreeNode **new_ptr;

		if (!(new_ptr = realloc(q->data, sizeof(struct TreeNode *) * q->cap * 2)))
		{
			// panic
			return;
		}

		q->data = new_ptr;
		q->cap *= 2;
	}
	q->data[q->end_idx] = tree_node;
	q->end_idx++;
}

struct TreeNode *popQ(Queue *q)
{
	// Empty
	if (q->begin_idx == q->end_idx)
		return NULL;

	q->begin_idx++;
	return q->data[q->begin_idx - 1];
}

#define PACK(lv, val) (((lv) << 16) | (((val) + 1000) & 0xFFFF))
#define UNPACK_LV(val) (((val) >> 16) & 0xFFFF)
#define UNPACK_VAL(val) (((val) & 0xFFFF) - 1000)

int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes)
{
	Queue q;
	int max_lv = 0;
	int *columnSizes;
	int **ret;
	int *ret_idxs;

	if (!root)
	{
		*returnSize = 0;
		*returnColumnSizes = NULL;
		return NULL;
	}

	// 1. Get `returnSize`
	root->val = PACK(0, root->val);

	initQ(&q);
	pushQ(&q,root);

	while (q.begin_idx < q.end_idx)
	{
		struct TreeNode *target;
		int cur_lv;

		target = popQ(&q);
		cur_lv = UNPACK_LV(target->val);
		max_lv = max_lv < cur_lv ? cur_lv : max_lv;

		if (target->left)
		{
			target->left->val = PACK(cur_lv + 1, target->left->val);
			pushQ(&q, target->left);
		}

		if (target->right)
		{
			target->right->val = PACK(cur_lv + 1, target->right->val);
			pushQ(&q, target->right);
		}
	}

	*returnSize = max_lv + 1;

	// 2. Get `returnColumnSizes`
	columnSizes = calloc(max_lv + 1, sizeof(int));

	clearQ(&q);
	pushQ(&q, root);

	while (q.begin_idx < q.end_idx)
	{
		struct TreeNode *target;
		int cur_lv;

		target = popQ(&q);
		cur_lv = UNPACK_LV(target->val);
		columnSizes[cur_lv]++;

		if (target->left)
			pushQ(&q, target->left);

		if (target->right)
			pushQ(&q, target->right);
	}

	*returnColumnSizes = columnSizes;

	// 3. Get `ret`
	ret = malloc(sizeof(int*) * (max_lv + 1));
	for (int i = 0; i < max_lv + 1; i++)
		ret[i] = malloc(sizeof(int) * columnSizes[i]);

	ret_idxs = calloc(max_lv + 1, sizeof(int));
	
	clearQ(&q);
	pushQ(&q, root);

	while (q.begin_idx < q.end_idx)
	{
		struct TreeNode *target;
		int cur_lv;

		target = popQ(&q);
		cur_lv = UNPACK_LV(target->val);
		ret[cur_lv][ret_idxs[cur_lv]] = UNPACK_VAL(target->val);
		ret_idxs[cur_lv]++;

		if (target->left)
			pushQ(&q, target->left);

		if (target->right)
			pushQ(&q, target->right);
	}

	freeQ(&q);

	return ret;
}
```

- 적용한 최적화는
	- `TreeNode` 에 있는 32bit `val` 을 상위 16bit 와 하위 16bit 로 나눠서 위에다는 해당 node 의 level 을, 아래다는 기존의 `val` 을 저장했다 ([[Bit Packing, BP (Encoding)|Bit-Packing]]).
		- 그리고 `val` 이 음수인 경우를 위해서는 +1000 을 해서 항상 양수이게 해두었다.
	- Queue 를 구현할 때는 다른 queue 구현체에서 흔히 그러듯이 부족할 때마다 2배씩 커지는 capacity 를 사용해 관리했다.

## 삽질 기록

### 1. Memoize

> [!info]- 결과
> ![[Pasted image 20260308160201.png]]

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
>  * Return an array of arrays of size *returnSize.
>  * The sizes of the arrays are returned as *returnColumnSizes array.
>  * Note: Both returned array and *columnSizes array must be malloced, assume caller calls free().
>  */
> 
> #define MAX_NODES (2000)
> 
> typedef struct {
> 	short lv;
> 	short val;
> } NodeMeta;
> 
> void traverse(struct TreeNode *cur, int cur_lv, NodeMeta *meta, int *meta_idx, int *max_lv, short *lv_num_nodes)
> {
> 	// Append node metadata
> 	meta[*meta_idx].lv = cur_lv;
> 	meta[*meta_idx].val = cur->val;
> 	*meta_idx += 1;
> 
> 	// Increase counter
> 	*max_lv = *max_lv < cur_lv ? cur_lv : *max_lv;
> 	lv_num_nodes[cur_lv]++;
> 
> 	// Traverse to child
> 	if (cur->left)
> 		traverse(cur->left, cur_lv + 1, meta, meta_idx, max_lv, lv_num_nodes);
> 
> 	if (cur->right)
> 		traverse(cur->right, cur_lv + 1, meta, meta_idx, max_lv, lv_num_nodes);
> }
> 
> int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes)
> {
> 	NodeMeta meta[MAX_NODES] = {0};
> 	int meta_idx = 0;
> 	int max_lv = -1;
> 	short lv_num_nodes[MAX_NODES] = {0};
> 	int **ret;
> 	int *ret_idxs;
> 
> 	if (!root)
> 	{
> 		*returnSize = 0;
> 		*returnColumnSizes = NULL;
> 		return NULL;
> 	}
> 
> 	// Traverse from lv 0
> 	traverse(root, 0, meta, &meta_idx, &max_lv, lv_num_nodes);
> 
> 	// Set `returnSize`
> 	*returnSize = max_lv + 1;
> 
> 	// Set `returnColumnSizes`
> 	*returnColumnSizes = malloc(sizeof(int) * (max_lv + 1));
> 	for (int i = 0; i < max_lv + 1; i++)
> 		(*returnColumnSizes)[i] = lv_num_nodes[i];
> 
> 	// Set `ret`
> 	ret = malloc(sizeof(int*) * (max_lv + 1));
> 	for (int i = 0; i < max_lv + 1; i++)
> 		ret[i] = malloc(sizeof(int) * lv_num_nodes[i]);
> 
> 	ret_idxs = calloc(max_lv + 1, sizeof(int));
> 	for (int i = 0; i < meta_idx; i++)
> 	{
> 		int lv = meta[i].lv;
> 
> 		ret[lv][ret_idxs[lv]] = meta[i].val;
> 		ret_idxs[lv]++;
> 	}
> 	free(ret_idxs);
> 
> 	return ret;
> }
> ```

- DFS 로 돌면서 metadata memoize 를 하는 방법. 속도는 빠르지만 메모리 사용량이 꼬롬해서 queue 를 이용한 접근으로 바꾸었다.

### 2. Linked list queue

> [!info]- 결과
> ![[Pasted image 20260308184837.png]]

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
>  * Return an array of arrays of size *returnSize.
>  * The sizes of the arrays are returned as *returnColumnSizes array.
>  * Note: Both returned array and *columnSizes array must be malloced, assume caller calls free().
>  */
> 
> typedef struct _QueueNode QueueNode;
> 
> struct _QueueNode {
> 	struct TreeNode *tree_node;
> 	QueueNode *next;
> };
> 
> typedef struct {
> 	QueueNode *begin;
> 	QueueNode *end;
> 	int size;
> } Queue;
> 
> void clearQ(Queue *q)
> {
> 	q->begin = NULL;
> 	q->end = NULL;
> 	q->size = 0;
> }
> 
> void freeQ(Queue *q)
> {
> 	QueueNode *iter = q->begin;
> 
> 	while (iter)
> 	{
> 		QueueNode *next = iter->next;
> 		free(iter);
> 		iter = next;
> 	}
> 
> 	clearQ(q);
> }
> 
> void pushQ(Queue *q, struct TreeNode *tree_node)
> {
> 	QueueNode *q_node;
> 
> 	q_node = malloc(sizeof(QueueNode));
> 	q_node->tree_node = tree_node;
> 	q_node->next = NULL;
> 
> 	if (q->begin && q->end)
> 	{
> 		q->end->next = q_node;
> 		q->end = q_node;
> 	}
> 
> 	else
> 	{
> 		q->begin = q_node;
> 		q->end = q_node;
> 	}
> 
> 	q->size++;
> }
> 
> struct TreeNode *popQ(Queue *q)
> {
> 	if (q->begin && q->end)
> 	{
> 		struct TreeNode *ret = q->begin->tree_node;
> 
> 		if (q->begin == q->end)
> 		{
> 			freeQ(q);
> 		}
> 
> 		else
> 		{
> 			QueueNode *target = q->begin;
> 			q->begin = q->begin->next;
> 			free(target);
> 			q->size--;
> 		}
> 
> 		return ret;
> 	}
> 
> 	return NULL;
> }
> 
> 
> #define PACK(lv, val) (((lv) << 16) | (((val) + 1000) & 0xFFFF))
> #define UNPACK_LV(val) (((val) >> 16) & 0xFFFF)
> #define UNPACK_VAL(val) (((val) & 0xFFFF) - 1000)
> 
> int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes)
> {
> 	Queue q;
> 	int max_lv = 0;
> 	int *columnSizes;
> 	int **ret;
> 	int *ret_idxs;
> 
> 	if (!root)
> 	{
> 		*returnSize = 0;
> 		*returnColumnSizes = NULL;
> 		return NULL;
> 	}
> 
> 	// 1. Get `returnSize`
> 	clearQ(&q);
> 	root->val = PACK(0, root->val);
> 	pushQ(&q, root);
> 
> 	while (q.size)
> 	{
> 		struct TreeNode *target;
> 		int cur_lv;
> 
> 		target = popQ(&q);
> 		cur_lv = UNPACK_LV(target->val);
> 		max_lv = max_lv < cur_lv ? cur_lv : max_lv;
> 
> 		if (target->left)
> 		{
> 			target->left->val = PACK(cur_lv + 1, target->left->val);
> 			pushQ(&q, target->left);
> 		}
> 
> 		if (target->right)
> 		{
> 			target->right->val = PACK(cur_lv + 1, target->right->val);
> 			pushQ(&q, target->right);
> 		}
> 	}
> 
> 	*returnSize = max_lv + 1;
> 
> 	// 2. Get `returnColumnSizes`
> 	columnSizes = calloc(max_lv + 1, sizeof(int));
> 
> 	clearQ(&q);
> 	pushQ(&q, root);
> 
> 	while (q.size)
> 	{
> 		struct TreeNode *target;
> 		int cur_lv;
> 
> 		target = popQ(&q);
> 		cur_lv = UNPACK_LV(target->val);
> 		columnSizes[cur_lv]++;
> 
> 		if (target->left)
> 			pushQ(&q, target->left);
> 
> 		if (target->right)
> 			pushQ(&q, target->right);
> 	}
> 
> 	*returnColumnSizes = columnSizes;
> 
> 	// 3. Get `ret`
> 	ret = malloc(sizeof(int*) * (max_lv + 1));
> 	for (int i = 0; i < max_lv + 1; i++)
> 		ret[i] = malloc(sizeof(int) * columnSizes[i]);
> 
> 	ret_idxs = calloc(max_lv + 1, sizeof(int));
> 	
> 	clearQ(&q);
> 	pushQ(&q, root);
> 
> 	while (q.size)
> 	{
> 		struct TreeNode *target;
> 		int cur_lv;
> 
> 		target = popQ(&q);
> 		cur_lv = UNPACK_LV(target->val);
> 		ret[cur_lv][ret_idxs[cur_lv]] = UNPACK_VAL(target->val);
> 		ret_idxs[cur_lv]++;
> 
> 		if (target->left)
> 			pushQ(&q, target->left);
> 
> 		if (target->right)
> 			pushQ(&q, target->right);
> 	}
> 
> 	return ret;
> }
> ```

- Linked list 로 queue 를 만들었더니 malloc/free 때문에 속도가 너무 느리다. 그래서 static array 를 사용하는 방법 ([[#3. Static array queue|이거]]) 로 바꾸었다.
### 3. Static array queue

> [!info]- 결과
> ![[Pasted image 20260308184750.png]]

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
>  * Return an array of arrays of size *returnSize.
>  * The sizes of the arrays are returned as *returnColumnSizes array.
>  * Note: Both returned array and *columnSizes array must be malloced, assume caller calls free().
>  */
> 
> typedef struct {
> 	unsigned short begin_idx;
> 	unsigned short end_idx;
> } Queue;
> 
> void clearQ(Queue *q)
> {
> 	q->begin_idx = 0;
> 	q->end_idx = 0;
> }
> 
> void pushQ(Queue *q, struct TreeNode **tree_q, struct TreeNode *tree_node)
> {
> 	tree_q[q->end_idx] = tree_node;
> 	q->end_idx++;
> }
> 
> struct TreeNode *popQ(Queue *q, struct TreeNode **tree_q)
> {
> 	// Empty
> 	if (q->begin_idx == q->end_idx)
> 		return NULL;
> 
> 	q->begin_idx++;
> 	return tree_q[q->begin_idx - 1];
> }
> 
> #define CAP_TREE_NODES (2000)
> #define PACK(lv, val) (((lv) << 16) | (((val) + 1000) & 0xFFFF))
> #define UNPACK_LV(val) (((val) >> 16) & 0xFFFF)
> #define UNPACK_VAL(val) (((val) & 0xFFFF) - 1000)
> 
> int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes)
> {
> 	struct TreeNode *tree_q[CAP_TREE_NODES];
> 	Queue q;
> 	int max_lv = 0;
> 	int *columnSizes;
> 	int **ret;
> 	int *ret_idxs;
> 
> 	if (!root)
> 	{
> 		*returnSize = 0;
> 		*returnColumnSizes = NULL;
> 		return NULL;
> 	}
> 
> 	// 1. Get `returnSize`
> 	root->val = PACK(0, root->val);
> 
> 	clearQ(&q);
> 	pushQ(&q, tree_q, root);
> 
> 	while (q.begin_idx < q.end_idx)
> 	{
> 		struct TreeNode *target;
> 		int cur_lv;
> 
> 		target = popQ(&q, tree_q);
> 		cur_lv = UNPACK_LV(target->val);
> 		max_lv = max_lv < cur_lv ? cur_lv : max_lv;
> 
> 		if (target->left)
> 		{
> 			target->left->val = PACK(cur_lv + 1, target->left->val);
> 			pushQ(&q, tree_q, target->left);
> 		}
> 
> 		if (target->right)
> 		{
> 			target->right->val = PACK(cur_lv + 1, target->right->val);
> 			pushQ(&q, tree_q, target->right);
> 		}
> 	}
> 
> 	*returnSize = max_lv + 1;
> 
> 	// 2. Get `returnColumnSizes`
> 	columnSizes = calloc(max_lv + 1, sizeof(int));
> 
> 	clearQ(&q);
> 	pushQ(&q, tree_q, root);
> 
> 	while (q.begin_idx < q.end_idx)
> 	{
> 		struct TreeNode *target;
> 		int cur_lv;
> 
> 		target = popQ(&q, tree_q);
> 		cur_lv = UNPACK_LV(target->val);
> 		columnSizes[cur_lv]++;
> 
> 		if (target->left)
> 			pushQ(&q, tree_q, target->left);
> 
> 		if (target->right)
> 			pushQ(&q, tree_q, target->right);
> 	}
> 
> 	*returnColumnSizes = columnSizes;
> 
> 	// 3. Get `ret`
> 	ret = malloc(sizeof(int*) * (max_lv + 1));
> 	for (int i = 0; i < max_lv + 1; i++)
> 		ret[i] = malloc(sizeof(int) * columnSizes[i]);
> 
> 	ret_idxs = calloc(max_lv + 1, sizeof(int));
> 	
> 	clearQ(&q);
> 	pushQ(&q, tree_q, root);
> 
> 	while (q.begin_idx < q.end_idx)
> 	{
> 		struct TreeNode *target;
> 		int cur_lv;
> 
> 		target = popQ(&q, tree_q);
> 		cur_lv = UNPACK_LV(target->val);
> 		ret[cur_lv][ret_idxs[cur_lv]] = UNPACK_VAL(target->val);
> 		ret_idxs[cur_lv]++;
> 
> 		if (target->left)
> 			pushQ(&q, tree_q, target->left);
> 
> 		if (target->right)
> 			pushQ(&q, tree_q, target->right);
> 	}
> 
> 	return ret;
> }
> ```

- Static array 를 사용하니 속도는 빠르게 나오는데 여전히 메모리 사용량이 아쉽다. 그래서 마지막으로 변경한게 최종본 ([[#최종|이거]]).

## C++

> [!info]- 결과
> ![[Pasted image 20260308190826.png]]

- 옛날에 C++ 로 구현해놓은게 있어서 여기로 옮겨버리기

```cpp
/**
* Definition for a binary tree node.
* struct TreeNode {
* int val;
* TreeNode *left;
* TreeNode *right;
* TreeNode() : val(0), left(nullptr), right(nullptr) {}
* TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
* TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
* };
*/

#define marshal(l, v) (10000 * (l) + (v) + 2000)
#define unmarshal_lv(v) ((v) / 10000)
#define unmarshal_val(v) ((v) % 10000 - 2000)
class Solution {
public:
	vector<vector<int>> levelOrder(TreeNode* root) {
		if (!root) {
			return {};
		}
	
		queue<TreeNode*> q;
		root->val = marshal(0, root->val);
		q.push(root);
	
		vector<vector<int>> result;
		while (!q.empty()) {
			auto head = q.front();
			int level = unmarshal_lv(head->val);
			int val = unmarshal_val(head->val);
	
			if (result.size() - 1 == level) {
				result[level].push_back(val);
			} else {
				result.push_back({val});
			}
	
			if (head->left) {
				head->left->val = marshal(level + 1, head->left->val);
				q.push(head->left);
			}
	
			if (head->right) {
				head->right->val = marshal(level + 1, head->right->val);
				q.push(head->right);
			}
	
			q.pop();
		}
	
		return result;
	}
};
```