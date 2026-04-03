---
tags:
  - mdg
  - algorithm
  - interview
  - dp
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/house-robber-ii)

> [!tip] 요약
> - 코드가 좀 더러워지더라도 case 를 나누어 처리하는것에 부담을 느끼지 말자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260403174058.png]]

- 집을 털었을때와 안털었을 때를 나누어 DP 로 풀면 된다.
- 근데 복병은 집들이 원형으로 있다는 것이다; 즉, 마지막 집의 경우에는 첫번째 집이랑 이웃해있기 때문에 둘 다 털수는 없다.
- 이걸 타파하는 방법은 그냥 첫번째 집을 털었을 경우와 안털었을 경우를 따로 코드로 작성하고, 이 둘중에 더 큰 값으로 정답을 제출하면 된다.
	- 물론 머리를 좀 더 쓰면 코드 하나로 깔끔하게 풀 수는 있겠지만, 이런거 고민할시간에 그냥 나눠서 풀자.
- 그래서 코드는:

```cpp
#define MAX(a, b) (a > b ? a : b)
#define MAX3(a, b, c) (MAX(MAX(a, b), c))
#define MAX4(a, b, c, d) (MAX(MAX(a, b), MAX(c, d)))

class Solution {
public:
	int rob(vector<int>& nums) {
		int size = nums.size();
		auto dp = vector<vector<int>>(size, vector<int>(2, 0));
		int case0, case1;

		// Edge cases
		if (size == 1) {
			return nums[0];
		}

		if (size == 2) {
			return MAX(nums[0], nums[1]);
		}

		/* Case 0: Rob first one */
		{
			// Can't rob second one
			dp[1][0] = nums[0];
			dp[1][1] = nums[0];

			// Rob middle houses
			for (int i = 2; i < size - 1; i++) {
				dp[i][0] = MAX(dp[i - 1][0], dp[i - 1][1]);
				dp[i][1] = dp[i - 1][0] + nums[i];
			}

			// Can't rob last one
			case0 = MAX3(nums[0], dp[size - 2][0], dp[size - 2][1]);
		}

		/* Case 1: Don't rob first one */
		{
			// Can rob second one
			dp[1][0] = 0;
			dp[1][1] = nums[1];

			// Rob middle houses (Can rob last one)
			for (int i = 2; i < size; i++) {
				dp[i][0] = MAX(dp[i - 1][0], dp[i - 1][1]);
				dp[i][1] = dp[i - 1][0] + nums[i];
			}

			case1 = MAX(dp[size - 1][0], dp[size - 1][1]);
		}

		return MAX(case0, case1);
	}
};
```

- 사실 위 코드에서 `case1` 은 필요없으나, 이걸 빼면 코드가 너무 개판이라서 최소한의 가독성을 챙기고자 넣어놨다.

## Java

- 옛날에 Java 로 구현해놓은게 있어서 여기로 옮겨버리기

### Solution 1

> [!info]- 결과
> ![[Pasted image 20260403175049.png]]

```java
class Solution {
	private static final int INT_MIN = -2147483648;
	private int[] nums;

	private int adjustIdx(int idx) {
		return idx < 0
			? (this.nums.length - 1) - ((-idx - 1) % this.nums.length)
			: idx % this.nums.length;
	}

	public int rob(int[] nums) {
		this.nums = nums;

		int max = INT_MIN;
		for (int i = 0; i < nums.length; i++) {
			max = nums.length < 4
				? Math.max(max, nums[i])
				: Math.max(max, this.seqRob(i + 2, i - 2) + nums[i]);
		}

		return max;
	}

	private int seqRob(int begin, int end) {
		begin = this.adjustIdx(begin);
		end = this.adjustIdx(end);
		int[] cache = new int[this.nums.length];
		cache[begin] = this.nums[begin];

		for (int i = this.adjustIdx(begin + 1); i != this.adjustIdx(end + 1); i = this.adjustIdx(i + 1)) {
			cache[i] = Math.max(cache[this.adjustIdx(i - 2)] + this.nums[i], cache[this.adjustIdx(i - 1)]);
		}

		return cache[end];
	}
}
```

### Solution 2

> [!info]- 결과
> ![[Pasted image 20260403175145.png]]

```java
class Solution {
	private static final int INT_MIN = -2147483648;

	public int rob(int[] nums) {
		// Filtering
		if (nums.length < 4) {
			int max = INT_MIN;
			for (int num : nums) {
				max = Math.max(max, num);
			}
			return max;
		}

		// Sequesntial robbery
		int[] seqCache = new int[nums.length];
		seqCache[0] = nums[0];
		seqCache[1] = Math.max(nums[0], nums[1]);
		for (int i = 2; i < nums.length; i++) {
			seqCache[i] = Math.max(seqCache[i - 1], seqCache[i - 2] + nums[i]);
		}

		// wtf
		int[] rotCache = new int[nums.length];
		rotCache[0] = nums[1];
		rotCache[1] = Math.max(nums[1], nums[2]);
		for (int i = 2; i < nums.length - 1; i++) {
			rotCache[i] = Math.max(rotCache[i - 1], nums[i + 1] + rotCache[i - 2]);
		}

		return Math.max(seqCache[nums.length - 2], rotCache[nums.length - 2]);
	}
}
```
