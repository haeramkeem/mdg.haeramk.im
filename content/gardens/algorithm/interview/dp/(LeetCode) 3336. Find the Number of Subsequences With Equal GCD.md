---
tags:
  - mdg
  - algorithm
  - interview/retry
  - dp
date: 2026-07-14
aliases:
  - LeetCode 3336
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-the-number-of-subsequences-with-equal-gcd)

> [!tip] 요약
> - 예시를 이용해 차근차근 규칙을 찾으면 된다.

## 최종

> [!info]- 결과
> 

- 예시를 이용해 차근차근 규칙을 찾으면 되는 쉬운 문제다.
- 그렇게 쉬우면 이 문제의 난이도가 hard 가 아니겠지. 진짜 개어렵다. 힌트 안보고 푼 문제중에서는 지금까지는 가장 어려운듯.

### 차근차근맨

#### Insight

- 예시로 준 `A={1, 2, 3, 4}` 로 생각해 보자. 우선 가능한 모든 subsequence pair 를 다 적어보는걸로 시작한다.
- 근데 생각해보면, `A={1, 2, 3, 4}` 로 만들 수 있는 모든 subsequence pair 는 다음과 같이 세 가지로 나눌 수 있다.
	1) Index 3 (`4`) 을 어느 subsequence 에도 갖고있지 않은 놈
	2) Index 3 (`4`) 을 왼쪽 subsequence 에 갖고있는 놈
	3) Index 3 (`4`) 을 오른쪽 subsequence 에 갖고있는 놈
- 여기서 (1) 은 `A'={1, 2, 3}` 의 가능한 subsequence pair 경우의 수와 같다.
- 그리고 (2) 와 (3) 은 경우의 수가 대칭이다. 즉, 하나만 알면 나머지 하나를 알게 된다.
- 이렇게 정의해보자:
	- `SP[i]`: Index 0 ~ `i` 의 원소들에 대한 모든 subsequence pair 의 집합
	- `LS[i]`: Index `i` 에 해당하는 놈을 왼쪽 subsequence 에 갖고 있는 pair 의 집합
	- `RS[i]`: Index `i` 에 해당하는 놈을 왼쪽 subsequence 에 갖고 있는 pair 의 집합
- 그럼 `SP[i]` 는 `SP[i - 1]`, `LS[i]`, `RS[i]` 의 합집합과 같다.
- 여기까지 하고, 무엇이든 insight 를 얻기 위해 `LS[i]` 와 `RS[i]` 를 쭉 적어보자.

```
i == 0:
	LS, RS:
		NULL
i == 1:
	LS:
		({2},{1})
	RS:
		({1},{2})
i == 2:
	LS:
		({3},{1})
		({3},{2})
		({3},{1,2})
		({3,1},{2})
		({3,2},{1})
	RS:
		({1},{3})
		({2},{3})
		({1,2},{3})
		({2},{3,1})
		({1},{3,2})
i == 3:
	LS:
		({4},{1})       <+
		({4},{2})        |
		({4},{3})        |
		({4},{1,2})     (a)
		({4},{1,3})      |
		({4},{2,3})      |
		({4},{1,2,3})   <+
		({4,1},{2})     <+
		({4,1},{3})      |
		({4,1},{2,3})    |
		({4,2},{1})      |
		({4,2},{3})      |
		({4,2},{1,3})   (b)
		({4,3},{1})      |
		({4,3},{2})      |
		({4,3},{1,2})    |
		({4,3,2},{1})    |
		({4,3,1},{2})    |
		({4,2,1},{3})   <+
	RS: 생략
```

- 설명을 위해 구역을 좀 나눠봤다.
	- (a): 여기는 왼쪽에 `{4}` 밖에 없고, 오른쪽에는 `{1, 2, 3}` 으로 만들 수 있는 모든 subsequence 들이 들어가 있다.
	- (b): 여기는 잘 생각해 보면 `LS[1]` 와 `RS[1]`, `LS[2]`, `RS[2]` 의 모든 pair 들에 대해 왼쪽 subseqence 에 `4` 를 추가했다는걸 알 수 있다.
- (b) 를 좀 시각화해보면 다음과 같다.

![[Pasted image 20260714162400.png]]

#### Key idea

> [!warning] 설명/예시 추가 #draft 
> - 이문제에 시간을 너무 많이 쓰고 있어서 자세한 설명과 예시는 생략한다.
> - 위에 Insight 와 이 내용을 조합하면 문제를 풀 수 있다.
> - 나중에 다시 한번 풀 때 설명 추가하기.

- 좋다이거야. 근데 `nums` 의 크기가 최대 200이다. 대충생각해도 subsequence 의 수가 $3^{200}$ 이다 (그냥 간단히 각 element 에 대해 미포함/왼쪽포함/오른쪽포함의 경우의 수를 가진다고 생각했을 때 저렇게 된다는거고 디테일하게 계산해보진 않았다. 어쨋든 저 언저리일것). 이거 다 계산하고 있으면 미친놈이다.
- 핵심 아이디어는 GCM(최대공약수)의 특징을 이용하는거다.
	- 간단하게 `1, 2, 3, 4` 의 GCM을 생각해보자.
	- 눈으로 계산하면 GCM이 1인 것을 알 수 있다.
	- 근데 생각해보면 이건 `1, 2, 3` 의 GCM인 1 과 `4` 의 GCM이라는 것을 알 수 있다.
	- 즉, `GCM(GCM(1, 2, 3), 4)` 와 같다는 것.
- 그리고 위의 특징을 활용할 수 있는 두가지의 자료구조를 사용한다.
	1. `S_MAP[i]`: `GCM -> cnt`
		- Index `0 ~ i` 의 원소들로 만들 수 있는 모든 subsequence 집합이 있다고 해보자.
		- 그럼 `S_MAP[i]` 의 어떤 원소 `a -> b` 는, GCM 이 `a` 인 subsequence 가 집합 내에 `b` 개 있다는 소리이다.
	2. `P_MAP[i]`: `(GCM, GCM) -> cnt`
		- Index `0 ~ i` 의 원소들로 만들 수 있는 모든 subsequence pair 의 집합이 있다고 해보자.
		- 그럼 `P_MAP[i]` 의 어떤 원소 `(a, b) -> c` 는, 왼쪽 subsequence 의 GCM 이 `a` 이고, 오른쪽 subsequence 의 GCM 이 `b` 인 pair 가 집합 내에 `c` 개 있다는 소리이다.
- 이때 관계식을 생각해보면 다음과 같다.
	1. `S_MAP[i + 1]`:
		- `S_MAP[i]` 의 어떤 원소 `a -> b` 에 대해, `GCM(nums[i + 1], a) -> b` 를 만족한다.
		- 이들의 집합을 `S_MAP'[i + 1]` 라고 하면, `S_MAP[i + 1]` 은 `S_MAP[i]` 와 `S_MAP'[i + 1]` 의 합집합이다.
	2. `P_MAP[i + 1]`:
		- `P_MAP[i]` 의 어떤 원소 `(a, b) -> c` 에 대해, `(GCM(nums[i + 1], a), b) -> c` 를 만족하고, `(a, GCM(nums[i + 1], b)) -> c` 도 만족한다.
		- 이들의 집합을 `P_MAP'[i + 1]` 라고 하면, `P_MAP[i + 1]` 은 `P_MAP[i]` 와 `P_MAP'[i + 1]` 의 합집합이다.
- 코드는 다음과 같다:

```cpp
#define ull unsigned long long
#define MOD(a) ((a) % 1000000007)
#define ADD(a, b) (MOD((ull)(a) + (ull)(b)))
#define ACC(a, b) ((a) = ADD((a), (b)))

class Solution {
	int getGCD(int a, int b) {
		while (b) {
			int rem = a % b;
			a = b;
			b = rem;
		}

		return a;
	}
public:
	int subsequencePairCount(vector<int>& nums) {
		int n = nums.size();

		// Early termination
		if (n == 1) {
			return 0;
		} else if (n == 2) {
			return (nums[0] == nums[1]) ? 2 : 0;
		}

		// num_seq[a] equals:
		// # of seqs where the GCD of elements in the seq is `a`.
		map<int, int> num_seq;

		num_seq[nums[0]]++;
		num_seq[nums[1]]++;
		num_seq[getGCD(nums[0], nums[1])]++;

		// num_pair[{a, b}] equals:
		// # of seq pairs where the GCD of elements in each seq is
		// `a` and `b` resp.
		map<pair<int, int>, int> num_pair;

		num_pair[{nums[1], nums[0]}] = 1;

		for (int i = 2; i < n; i++) {
			// Update num_pair
			map<pair<int, int>, int> pair_buf;

			for (auto &p : num_seq) {
				pair_buf[{nums[i], p.first}] += p.second;
			}

			for (auto &p : num_pair) {
				int gcd;

				gcd = getGCD(p.first.first, nums[i]);
				ACC((pair_buf[{gcd, p.first.second}]), p.second);

				gcd = getGCD(p.first.second, nums[i]);
				ACC((pair_buf[{gcd, p.first.first}]), p.second);
			}

			for (auto &p : pair_buf) {
				ACC(num_pair[p.first], p.second);
			}

			// Update num_seq;
			map<int, int> seq_buf;

			for (auto &p : num_seq) {
				int gcd = getGCD(p.first, nums[i]);
				ACC(seq_buf[gcd], num_seq[p.first]);
			}

			for (auto &p : seq_buf) {
				ACC(num_seq[p.first], p.second);
			}

			num_seq[nums[i]]++;
		}

		int ret = 0;
		for (auto &p : num_pair) {
			ACC(ret, (p.first.first == p.first.second) ? p.second : 0);
		}

		return MOD(2UL * ret);
	}
};
```
