---
tags:
  - cpp
  - cpp-number
date: 2024-07-22
---
> [!info]- 참고한 것들
> - [어떤 회사 글](https://www.log2base2.com/storage/how-float-values-are-stored-in-memory.html)
> - [어떤 블로그 글](https://velog.io/@hi_potato/Java%EC%9D%98-%EC%A0%95%EC%84%9D-%EC%8B%A4%EC%88%98%ED%98%95-float-double)
> - [IEEE 754](https://ieeexplore.ieee.org/document/8766229)

## Bitwise

- [[Integer (C++ Number)|여기]] 에서 사용한 bitwise printer 를 그대로 사용해서 float, double 에 대해 알아보자.

## Float

- Float 는 *Floating-point number* (*부동소수점*) 으로 실수를 표현한다. 즉,

$$
±M * 2^{E}
$$

- 각 기호는 다음과 같다.
	- $±$ (*Sign*, 부호): 말 그대로 부호.
	- $M$ (*Mantissa*, *가수*): 2의 제곱으로 표현되지 않는 부분. $E$ 를 조절해서 $1 ≤ M < 2$ 에 들어오도록 한다.
	- $E$ (*Exponent*, *지수*): 2의 몇제곱인지.
- Float 의 경우에는 32비트로 구성되며 다음과 같은 layout 을 가진다:
	- 첫 1비트는 *부호* (*Sign*)
	- 그다음 8비트는 *지수* (*Exponent*)
	- 나머지 23 비트는 *가수* (*Mantissa*)
- 다만, 얘네들이 그대로 저장되는 것은 아니고, bit 로 표현하기 위한 변환을 거친다.
	- *부호* (*Sign*) 의 경우에는 양수일 때 `0`, 음수일 때 `1`로 저장된다.
	- *지수* (*Exponent*) 의 경우에는 *Bias* 라고 불리는 $2^{7} - 1$ 를 더해준다.
		- 이것은 지수를 위한 부호 bit 없이도 양수와 음수를 전부 표현할 수 있게 해준다.
			- 2의 보수를 이용한 정수 표현보다 이렇게 하는 것이 뭐 여러모로 더 좋댄다.
		- 양, 음수의 지수와 무한대, NaN 등은 8bit 로 다음과 같이 표현된다.
			- Exponent bit 가 모두 1인 경우 (`11111111`), 양의 무한대, 음의 무한대, 숫자가 아님 (NaN) 셋 중의 하나다.
				- 양의 무한대는 *Sign bit* 가 0, *Mantissa bit* 가 모두 0
				- 음의 무한대는 *Sign bit* 가 1, *Mantissa bit* 가 모두 0
				- NaN 은 *Sign bit* 은 상관없고 *Mantissa bit* 가 모두 1
	- *가수* (*Mantissa*) 의 경우에는 어차피 $1 ≤ M < 2$ 이기 때문에 1을 빼서 저장한다.
- 정리하면, 다음과 같다.

```
Float: S EEEEEEEE MMMMMMMMMMMMMMMMMMMMMMM
```

| BIT          | DESC.                | CALC             |
| ------------ | -------------------- | ---------------- |
| 0 (1bit)     | *Sign* (*부호*) 표현     | 양수면 `0`, 음수면 `1` |
| 1~8 (8bit)   | *Exponent* (*지수*) 표현 | $E + 2^{7} - 1$  |
| 9~31 (23bit) | *Mantissa* (*가수*) 표현 | $M - 1$          |

- 그리고 특수값들은 다음과 같이 표현된다.

| TYPE | SIGN             | EXP.       | MANT.               |
| ---- | ---------------- | ---------- | ------------------- |
| +inf | `0` (positive)   | `11111111` | `0~` (All-zero)     |
| -inf | `1` (negative)   | `11111111` | `0~` (All-zeo)      |
| NaN  | `s` (don't care) | `11111111` | `1~` (All-non-zero) |

### 예시

- $0.125$ 는 다음과 같이 표현된다.

$$
0.125 = 1 * 2^{-3}
$$
- 따라서,
	- *Sign*: $0_{2}$
	- *Exponent*: $-3 + 127 = 124 = 01111100_{2}$
	- *Mantissa*: $1 - 1 = 00000000000000000000000_{2}$
- 그리고 실제로 그렇게 출력된다.

```cpp
int main() {
	PrintBits<float>(0.125);
}
```

```
00111110000000000000000000000000
```

## Double

- Double 은 [[#Float]] 과 동일하고, 다만 각 field 길이만 다르다.

| FIELD      | LEN (DOUBLE) | LEN (FLOAT) |
| ---------- | ------------ | ----------- |
| *Sign*     | 1            | 1           |
| *Exponent* | 11           | 8           |
| *Mantissa* | 52           | 23          |
| `SUM`      | 64 (8byte)   | 32 (4byte)  |

- 가령 위의 float 에서와 동일한 예시는 다음과 같이 출력된다.

```cpp
int main() {
	PrintBits<double>(0.125);
}
```

```
0011111111000000000000000000000000000000000000000000000000000000
```

### Float 과의 차이점

- 둘 간의 차이점은 얼마나 정확하게 (*precision*) 어떤 값을 표현할 수 있는가 이다.
	- 보통 float 은 7-precision 을 가지고, double 은 15-precision 을 가진다고 하는데,
	- 이 숫자는 "몇개의 decimal 을 보장할지" 라고 생각하면 된다.
- 가령 다음 예를 보자.

```cpp
#include <iostream>
#include <iomanip>

int main() {
	double val_d = 5.123456789012345;
	float val_f = 5.123456789012345;
	std::cout << std::setprecision(15);
	std::cout << val_d << std::endl;
	std::cout << val_f << std::endl;
}
```

- 중간에 `std::setprecision()` 는 표준출력에 대한 precision 을 설정하는 부분이다.

```
5.12345678901235
5.12345695495605
```

- 이때, double 의 경우에는 15개의 숫자가 정확하게 출력되었지만, float 의 경우에는 7개까지는 제대로 출력되다 그 이후부터는 이상한 값이 들어감을 알 수 있다.