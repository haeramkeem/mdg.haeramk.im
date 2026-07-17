---
tags:
  - mdg
  - algorithm
  - interview/retry
  - gcd
date: 2026-07-17
aliases:
  - LeetCode 3312
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/sorted-gcd-pair-queries)

> [!tip] 요약
> - 약수 카운팅하기

## 최종

> [!info]- 결과
> ![[Pasted image 20260717151013.png]]

- [[#Brute force|아래]] 처럼 풀리면 제일 좋겠지만, $10^5$ 의 testcase 에서 $O(n^2)$ 을 돌리는건 미친짓이다.
- 그래서 이렇게 접근하면 된다:
	- `cnt[a] == b` 를 `a` 로 나누었을 때 나누어지는 (나머지가 0이 되는) 숫자의 개수를 `b` 개라고 하자. 즉, `a` 를 약수로 갖는 숫자의 개수가 `b` 인 것이다.
		- 이때 `cnt[a]` 를 build 할 때는 `nums` 의 어떤 숫자에 `num` 대해 1부터 $\sqrt{num}$ 까지만 나눠보면 된다. 만약 이 범위에 있는 숫자 `x` 에 대해 `num % x == 0` 이라면 자동으로 `num % (num / x) == 0` 도 되기 때문.
	- 그럼 `a` 를 공약수로 갖는 두 숫자 pair 의 개수는 `b * (b - 1) / 2` 개 이다.
	- 근데 우리는 공약수가 아닌 최대공약수가 같은 두 숫자 pair 를 찾아야 된다. 그럼 `a` 를 큰수부터 시작해서 내려오며 pair 의 개수를 찾아야 한다. 또한, 이렇게 하면 중복 카운팅이 되므로 중복된 것도 없애야 한다.
	- 뭔소린지 모르겠다면 `{4, 4, 3, 3}` 으로 예를 들어보자.
		- `cnt[]` 를 만들어 보면,
			- `cnt[1] == 4`
			- `cnt[2] == 2`
			- `cnt[3] == 2`
			- `cnt[4] == 2` 가 될것이다.
		- 그럼 가장 큰 `4` 부터 시작하는거다.
			- `cnt[4] == 2` 이므로, `4` 를 약수로 갖고 있는놈이 2개란 소리다. 지금 우리는 가장 큰 `4` 부터 시작했으니까, 이 두 숫자에 대해 이것보다 큰 공약수는 없다. 따라서 이들로 만들 수 있는 pair 의 개수는 `2 * (2 - 1) / 2 == 1` 이다.
			- 다음으로는 `3` 을 보자. `cnt[3] == 2` 이므로, `3` 을 약수로 갖고있는놈이 2개란 소리다. 위에서와 마찬가지로, 만들 수 있는 pair 의 개수는 `2 * (2 - 1) / 2 == 1` 이다.
			- 또 `2` 를 보자. `cnt[2] == 2` 이므로, `2` 을 약수로 갖고있는놈이 2개란 소리다. 근데 이때는 위에서랑 약간 다르다. `4` 를 약수로 갖고있는놈은 `2` 도 약수로 갖고있다. 이게 위에서 말한 중복 카운팅이다. 따라서 이때는 `2` 를 약수로 갖고있는 놈들의 pair 수 (2개) 에서 `4` 를 약수로 갖고있는 놈들의 pair 수 (2개) 를 빼줘야 한다. 그래서 결과는 0이 된다.
			- 마지막으로 `1` 을 보면 `cnt[1] == 4` 인데, `2`, `3`, `4` 을 약수로 갖는 애들은 모두 `1` 도 약수로 갖고 있다.
				- 그래서 `1` 을 공약수로 갖는 pair 수: `4 * (4 - 1) / 2 == 6` 에서
				- `2` 를 최대공약수로 갖는 pair 수: 0개
				- `3` 를 최대공약수로 갖는 pair 수: 1개
				- `4` 를 최대공약수로 갖는 pair 수: 1개
				- 를 빼면 가능한 pair 수는 4개인 것을 알 수 있다.
	- 즉, `nums` 의 최대값이 `nums_max` 라고 하면 `nums_max` 부터 시작해 `1` 로 감소하는 `a` 에 대해:
		1) `cnt[a] = cnt[a] * (cnt[a] - 1) / 2` 로 `cnt[a]` 를 숫자의 개수에서 pair 의 개수로 바꿔주고
		2) 중복제거를 위해 `cnt[a]` 에서 `cnt[a * 2]`, `cnt[a * 3]`, `cnt[a * 4]` ... 를 빼준다.
	- 위처럼 하면 `cnt[a]` 는 `a` 를 최대공약수로 하는 pair 의 개수로 바뀌게 된다. 그럼 이때 `queries` 를 처리하는건 좀만 생각해봐도 금방 알 수 있기에 설명은 생략.
		- 물론 여기도 최적화를 해야 하는데, 그냥 누적합 + binary search 로 충분하다.
- 그래서 코드는:

```cpp
class Solution {
public:
	vector<int> gcdValues(vector<int>& nums, vector<long long>& queries) {
		int n = nums.size();
		int nums_max = -1;

		// Get nums_max
		for (int num : nums) {
			nums_max = max(nums_max, num);
		}

		// Build cnt array
		vector<long long> cnt(nums_max + 1, 0);

		for (int num : nums) {
			int divisor_max = (int)sqrt(num);

			for (int d = 1; d <= divisor_max; d++) {
				if (num % d == 0) {
					cnt[d]++;

					if (d != num / d) {
						cnt[num / d]++;
					}
				}
			}
		}

		// Conv to # pairs
		for (int i = nums_max; 1 <= i; i--) {
			// Calc # pairs
			cnt[i] = cnt[i] * (cnt[i] - 1) / 2;

			// Remove duplicates
			for (int m = 2; m * i <= nums_max; m++) {
				cnt[i] -= cnt[m * i];
			}
		}

		// Accumulate for binary search
		for (int i = 1; i <= nums_max; i++) {
			cnt[i] += cnt[i - 1];
		}

		int q_n = queries.size();
		vector<int> ret(q_n);

		for (int i = 0; i < q_n; i++) {
			// Answer the query w/ binary search (lower_bound)
			auto it = lower_bound(cnt.begin(), cnt.end(), queries[i] + 1);
			ret[i] = (it - cnt.begin());
		}

		return ret;
	}
};
```

## 삽질 기록

### Brute force

> [!info]- 코드
> ```cpp
> class Solution {
> 	int getGCD(int a, int b) {
> 		while (b) {
> 			int rem = a % b;
> 			a = b;
> 			b = rem;
> 		}
> 		return a;
> 	}
> public:
> 	vector<int> gcdValues(vector<int>& nums, vector<long long>& queries) {
> 		int n = nums.size();
> 		int q_n = queries.size();
> 		map<int, int> gcd_cnt;
> 		vector<int> ret(q_n);
>
> 		for (int i = 0; i < n; i++) {
> 			for (int j = i + 1; j < n; j++) {
> 				gcd_cnt[getGCD(nums[i], nums[j])]++;
> 			}
> 		}
>
> 		for (int i = 0; i < q_n; i++) {
> 			for (auto &p : gcd_cnt) {
> 				queries[i] -= p.second;
>
> 				if (queries[i] < 0) {
> 					ret[i] = p.first;
> 					break;
> 				}
> 			}
> 		}
>
> 		return ret;
> 	}
> };
> ```

- 무지성풀이. 당연히 timeout 난다.