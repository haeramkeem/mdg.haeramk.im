---
tags:
  - mdg
  - algorithm
  - gcd
date: 2026-07-15
aliases:
  - Euclidean Algorithm
  - 유클리드 호제법
---
> [!info] 작물단계: #seed 

## 란?

- *유클리드 호제법* (*Euclidean Algorithm*) 은 최대공약수 (GCD) 를 구하는 효율적인 방법이다.
- 그냥 이렇게만 알고있으면 된다:

```cpp
int gcd(int a, int b) {
	while (b) {
		int rem = a % b;
		a = b;
		b = rem;
	}
	return a;
}
```