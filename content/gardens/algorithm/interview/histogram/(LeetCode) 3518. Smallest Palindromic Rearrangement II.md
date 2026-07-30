---
tags:
  - mdg
  - algorithm
  - interview/retry
  - histogram
date: 2026-07-30
aliases:
  - LeetCode 3518
  - LeetCode 3518. Smallest Palindromic Rearrangement II
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/smallest-palindromic-rearrangement-ii)

> [!tip] 요약
> - 나중에 다시 풀어보기

## 최종

> [!info]- 결과
> ![[Pasted image 20260730092653.png]]

- 어떤 alphabet histogram 이 주어지면, 그것으로 만들 수 있는 문자열의 개수를 구할 수 있다.
- 그럼 일단 주어진 string 으로 histogram 을 만들고, 그것으로 문자열의 개수를 구해서 `k` 를 넘으면 빈 문자열을 제출하도록 하면 된다.
- 하지만, `k` 를 넘지 않으면, 실제로 palindrome 을 만들어야 한다. 그건 이렇게 하면 된다.
	- `s[i]` 의 character 가 뭔지 아래처럼 결정할 수 있다. 그럼 모든 `i` 에 대해 이짓을 반복하면 정답이 된다.
		1) 일단 histogram 에서 lexicographical minimum character 를 하나 고른다.
		2) 이놈을 하나 사용했다고 가정하고 histogram 에서 이놈의 cnt 를 하나 뺀다.
		3) 남은 histogram 을 이용해 만들 수 있는 문자열의 개수를 구한다. 이걸 `permutations` 라고 하자.
		4) 만약 `permutations` 가 `k` 보다 작다면, 이놈을 사용해서는 `k` 번째를 만들 수 없다는 이야기가 된다. 그렇다면 `k` 에서 `permutations` 를 빼줘 이놈을 사용했을 때의 경우의 수는 제외시킨다. 그리고 다음 lexicographical minimum character 를 고른 다음 (2) 으로 돌아간다.
		5) 만약 `permutations` 가 `k` 보다 크거나 같다면, 이놈을 사용해야 `k` 번째를 만들 수 있다. 그래서 `s[i]` 는 지금 고른 character 로 확정하고, 다음 `i` 로 넘어간다 (`i++`).
	- 여기서 한가지 트릭은 `permutations` 가 `k` 보다 작을 때만 이 값 자체가 의미있다는 것이다.
		- 즉, 이 값이 정확히 뭔지 알아야 하는 경우는 (4) 번 밖에 없고, 나머지 경우에는 그냥 `k` 보다 큰지만 알면 된다.
		- 그래서 `permutations` 를 구할 때는 `k` 를 upper bound 로 해서 만약 `k` 보다 커지면 `permutations` 를 계산하는 것을 멈추면 된다.
		- 이렇게 하는 것은 단순한 최적화가 아니고, overflow 를 방지하기 위함이다.
- 근데 결과를 보면 개느리다. 뭐 `permutations` 를 구하는 과정이 좀 비효율적으로 짜여진거같은데, 어쨋든 위의 발상이 중요하기 때문에 일단 이걸로 최종 결정.

```cpp
class Histogram {
	static constexpr int alphabets = 'z' - 'a' + 1;
	array<int, alphabets> data{};
	int cnt = 0;

	// Get total permutations w/ upper-bounded to k
	int masked_permutation(int k) {
		int total = cnt;
		int idx = alphabets - 1;
		int a = 1;
		int b = 1;
		int acc = 1;

		for (; 0 <= idx; idx--) {
			if (0 < data[idx]) {
				break;
			}
		}

		for (a = 1; a <= cnt && 0 <= idx; a++) {
			acc *= a;
			acc /= b;

			// When the permutations exceeds k, stop here.
			if (k <= acc) {
				return k;
			}

			if (b == data[idx]) {
				for (idx -= 1; 0 <= idx; idx--) {
					if (0 < data[idx]) {
						break;
					}
				}
				b = 0;
			}

			b++;
		}

		return acc;
	}
public:
	Histogram() {}

	Histogram(string &s) {
		cnt = s.size() >> 1;

		for (int i = 0; i < cnt; i++) {
			data[s[i] - 'a']++;
		}
	}

	// Get k-th palindrome
	bool get_kth(string &dst, int k) {
		int n = dst.size();

		if (masked_permutation(k) < k) {
			return false;
		}

		for (int i = 0; i < (n >> 1); i++) {
			int idx = 0;

			while (true) {
				int permutations;

				for (; idx < alphabets; idx++) {
					if (0 < data[idx]) {
						break;
					}
				}

				// Shall we use this one?
				data[idx]--;
				cnt--;
				permutations = masked_permutation(k);

				if (k <= permutations) {
					// OK, this one fits.
					break;
				}

				// Nah, not this one.
				data[idx]++;
				cnt++;
				idx++;
				k -= permutations;
			}

			dst[i] = 'a' + idx;
			dst[n - i - 1] = 'a' + idx;
		}

		return true;
	}
};

class Solution {
public:
	string smallestPalindrome(string s, int k) {
		Histogram histogram(s);

		if (!histogram.get_kth(s, k)) {
			return "";
		}

		return s;
	}
};
```
