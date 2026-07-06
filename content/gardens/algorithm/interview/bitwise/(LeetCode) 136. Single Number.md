---
tags:
  - mdg
  - algorithm
  - interview
  - bitwise
date: 2026-07-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/single-number)

> [!tip] 요약
> - XOR 을 활용하자

## 최종

> [!info]- 결과
> ![[Pasted image 20260704092229.png]]

- 같은 수가 XOR 되면 0 이 된다. 이 점을 이용하면 그냥 `int` 변수 하나에 모든 숫자를 XOR 하면 같은 수는 전부 0으로 날라가고 하나만 있는 숫자가 튀어나오는 매-직

```cpp
class Solution {
public:
	int singleNumber(vector<int>& nums) {
		int xord = 0;

		for (int num : nums) {
			xord ^= num;
		}

		return xord;
	}
};
```

## 다른 풀이

### Bitmap Set

> [!info]- 결과
> ![[Pasted image 20260704091928.png]]

> [!info]- 코드
> ```cpp
> class Solution {
> public:
> 	int singleNumber(vector<int>& nums) {
> 		// (30000 + 30000) / 32 == 1875
> 		vector<unsigned int> bset(1875, 0);
>
> 		for (int num : nums) {
> 			// Make positive
> 			num += 30000;
> 			bset[num >> 5] ^= (1 << (num & 0x1F));
> 		}
>
> 		for (int i = 0; i < BMS_NUM_CHUNKS; i++) {
> 			if (bset[i]) {
> 				for (int j = 0; j < 32; j++) {
> 					if ((bset[i] >> j) == 0x1) {
> 						return i * 32 + j - 30000;
> 					}
> 				}
> 			}
> 		}
>
> 		// Should not happen
> 		return -1;
> 	}
> };
> ```

- [[Bitmap (Encoding)|BMS]] 를 사용하는건 메모리 사용량이 엄청 크다는 단점과 빠르게 생각해내어 풀 수 있다는 장점이 있는 풀이다.
