---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-02
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/plus-one)

> [!tip] 요약
> - 쉬운 문제

## 최종

> [!info]- 결과
> ![[Pasted image 20260702093852.png]]

- 그냥 1을 더하고 carry (1을 다음자리로 올리는 것) 을 처리하면 된다.
- 다만, `vector` 에 높은자리수부터 들어있기 때문에 마지막에 carry 가 하나 남는 경우에는 원소를 앞에 하나 낑가넣어야 한다. 하지만 알다시피 `vector` 는 이렇게 앞에 넣는 연산이 느리다.
- 그래서 `vector` 를 뒤집는 방식으로 풀긴 했는데 생각해보니 딱히 시간복잡도 입장에서 이득은 아닌거같다. 어쨋든 코드는:

```cpp
class Solution {
	void reverse(vector<int> &digits) {
		int n = digits.size();

		for (int i = 0; i < (n >> 1); i++) {
			int buf = digits[i];
			digits[i] = digits[n - i - 1];
			digits[n - i - 1] = buf;
		}
	}
public:
	vector<int> plusOne(vector<int>& digits) {
		reverse(digits);

		// Plus one
		digits[0] += 1;

		// Carry the extra digits
		int carry = 0;
		for (int i = 0; i < digits.size(); i++) {
			digits[i] += carry;
			carry = digits[i] / 10;
			digits[i] %= 10;
		}

		// Process the last carry
		if (carry) {
			digits.push_back(carry);
		}

		reverse(digits);
		
		return digits;
	}
};
```

## 다른 풀이

### 앞에 넣기

> [!info]- 결과
> ![[Pasted image 20260702093832.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	vector<int> plusOne(vector<int>& digits) {
> 		int n = digits.size();
> 		int carry = 0;
>
> 		// Plus one
> 		digits[n - 1] += 1;
>
> 		// Process the carry
> 		for (int i = n - 1; i >= 0; i--) {
> 			digits[i] += carry;
> 			carry = digits[i] / 10;
> 			digits[i] %= 10;
> 		}
>
> 		// Process the remaining carry
> 		if (carry) {
> 			digits.insert(digits.begin(), carry);
> 		}
>
> 		return digits;
> 	}
> };
> ```

- 이건 `vector` 앞에 낑가넣는건데, `push_front()` 따위는 없기 때문에 `insert()` 를 사용해야 한다.
- 뭐 어쨋든 딱히 위 풀이에 비해 성능측면에서 또이또이인듯.