---
tags:
  - database
  - db-encoding
date: 2024-09-07
aliases:
  - Elias Gamma Coding
  - Elias Gamma
---
> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/Elias_gamma_coding)

## 란?

- 어떤 값들을 표현하는 방법은 크게 fixed-sized, variable-sized 두가지라고 생각할 수 있다.
	- Fixed-sized 는 말 그대로 값을 표현하는 bit 수가 정해져 있는 것이다. 가령 `int` 자료형은 4byte 로 고정이 되어 있기에, data 를 4byte 씩 자르면 `int` array 가 된다.
	- Variable-sized 는 반대로 bit 수가 정해져있지 않은 것이다. 따라서 고정된 bit 개수로 나눠 array 로 만드는 것은 불가능하고, delimiter (가령 CSV 에서의 `,`) 를 사용하거나 [[Huffman Coding (Encoding)|Huffman Coding]] 처럼 특정한 규칙을 사용해야 한다.
- *Elias Gamma Coding* (혹은 *Elias* $\gamma$ *Coding*) 은 MIT 의 [Peter Elias](https://en.wikipedia.org/wiki/Peter_Elias) 가 제시한 variable-sized positive integer representation 방법이다.

### 핵심 아이디어

- Variable-sized 에서는 해당 수가 몇개의 bit 으로 이루어져 있는지를 알아야 할 것이다.
- 이때의 bit size 를 알아내는 핵심 아이디어는 "모든 *자연수* 는 이진수가 1로 시작" 한다는 것이다.
	- "이진수가" 1로 시작한다는 말이다. byte 내에서의 MSB가 1이라는 것이 아님
- 따라서 어떤 수가 $N$ 개의 bit 로 이루어져 있다는 것을 나타내기 위해 이 most significant bit `1` 앞에다가 $N-1$ 개의 `0` 을 붙이는 것이 *Elias Gamma Coding* 이다.

### Encoding 예시

- $12345$ 를 *Elias Gamma Coding* 해보자.

$$
12345_{10}
$$

- 이건 이진수로 나타내면,

$$
11000000111001_{2}
$$

- 가 된다. 즉, $N=14$ 이다. 따라서 여기 앞에 $13$ 개의 $0$ 을 붙여준다.

```
000000000000011000000111001
```

- 이것이 *Elias Gamma Coding* 으로 표현된 $12345$ 이다.

### Decoding 예시

- 아래의 code 를 다시 자연수로 되돌려 보자.

```
0000001100010000001001100
```

- 일단 처음부터 0의 개수를 세보면 6개인 것을 알 수 있다.
- 그럼 그 다음에 오는 1 이후로 6개의 bit 까지가 하나의 묶음인 것을 알 수 있다.

```
<-06->1<-06->
0000001100010000001001100
```

- 그 다음부터 다시 0의 개수를 세보면 이번에도 6개인 것을 알 수 있고, 동일하게 이후의 7 (첫 1 + 뒤이어 오는 6개) bit 가 한 묶음인 것을 알 수 있다.

```
<-06->1<-06-><-06->1<-06->
00000011000100000001001100
```

- 따라서 이 두 수를 10진수로 바꿔보면 다음과 같다.

$$
98_{10}, 76_{10}
$$

## 활용

- 일단 보다시피 MSB 가 1이어야 한다. 즉, 자연수 (positive integer) 에 대해서만 사용할 수 있다.
	- 이런 무한대의 자연수를 표현할 수 있다는 것 때문에 lower bound 가 자연수이지만, upper bound 는 알 수 없는 데이터에 대한 encoding 에 종종 사용된다고 한다.
- 따라서 이 방법을 사용하려면 자연수로 바꾸는 것이 선행되어야 한다. 그러한 방법에는 대표적으로:
	- (최소값 + 1)을 더하는 방법이 가능하다. 즉, 어떤 수열에 대해 (최소값 + 1) 을 더한다면 해당 수열에 음수가 존재할 지라도 수열은 자연수로 바뀐다.
	- 아니면 *Bijection* 을 사용할 수도 있다. 이건:
		- 0 이상의 정수는 $2 \times x + 1$ 을 취한다. ($0, 1, 2, 3, ...$ -> $1, 3, 5, 7, ...$)
		- 음수는 $-2 \times x$ 를 적용한다. ($-1, -2, -3, -4, ...$ -> $2, 4, 6, 8, ...$)