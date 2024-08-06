---
tags:
  - Database
  - db-encoding
date: 2024-08-05
---
> [!info]- 참고한 것들
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.5. FOR & Bit-packing|BtrBlocks - Efficient Columnar Compression for Data Lakes, SIGMOD'23]]
> - [Lemire 교수 블로그 - 이거 진짜 도움 많이 됨](https://lemire.me/blog/2012/02/08/effective-compression-using-frame-of-reference-and-delta-coding/)

## FOR, BP

- 일반적으로 말하는 어떤 "정수" 는 다르게 말하면 "0과의 차이" 이다.
- 이때 *Frame Of Reference* (*FOR*) 는 이 =="~과의 차이" 를 바꿈으로써 큰 값들을 작은 값들로서 표현== 하는 것이다.
- 그리고 이렇게 작은 값들로 표현한 뒤에 그 ==작은 값들을 표현할 수 있는 더 적은 수의 bit 로만 표현== 하는 것을 [[Bit Packing, BP (Encoding)|Bit Packing (BP)]] 라고 한다.
- 이 둘은 함께 다니는 것이 일반적이다. 즉, 보통 FOR 뒤에는 BP 를 적용시켜 compression 을 한다.
	- 물론

### 예시

- 다음의 예시 수열을 보자.

```
107,108,110,115,120,125,132,132,131,135
```

- 보면, 최소값은 107 이고 최대값은 135 가 된다는 것을 알 수 있다.
- 최대값이 135 이기에, 이 숫자들을 표현하기 위해서는 적어도 8bit 는 필요하다. 따라서 전체적으로는 $10 \times 8 = 80bit$ 의 공간이 필요하다.
- 하지만 만약에 이것을 최소값인 "107과의 차이" 로 표현한다면?

```
0,1,3,8,13,18,25,25,24,28
```

- 여기다가 BP 를 적용해 보자. 이때는 최대값이 28 이기에, 이 값들을 표현하기 위해서는 5bit 면 충분할 것이다.
- 그럼 이때는 전체적으로 훨씬 더 적은 bit 로 숫자들을 표현할 수 있다:
	- 기준값이 "107"임: 이것은 기존대로 $8bit$ 로 표현하자.
	- 각각의 값들은 "5bit" 으로 표현되어 있음: 이것을 나타내기 위해서는 "숫자 5"를 위한 $3bit$ 가 필요하다.
	- 그리고 각각의 값들: $(10 \times 5)bit$
	- 따라서: $8 + 3 + 10 \times 5 = 61bit$ 면 충분하다.

### 장점

- 일단 장점은
1) 빠르다는 것이다.
	- Compression, decompression 과정 모두 단순한 덧셈뺄셈만 하면 되기 때문.
2) 그리고, 몇가지 자잘한 장점들이 있다.
	1. [[Fast Static Symbol Table, FSST (Encoding)#특징 3) Static|FSST]] 에서도 말한 것처럼, compressed query 가 가능하다. 즉, 값 전체를 decompression 하지 않고 필요한 값만 부분적으로 decompression 하여 활용하는 것이 가능하다.
	2. 최소값과 값들을 표현하는데에 필요한 bit 수 를 보고 값들의 범위를 예측할 수 있다.
		- 가령 위의 예시에서 처럼 최소값 107 과 5bit 라면, 적어도 138 보다 큰 숫자가 포함되어 있지 않다는 것 쯤은 알 수 있다.
		- 따라서 당연히 1000 과 같은 숫자가 포함될까? 와 같은 질문에 명확하게 "납!" 이라고 할 수 있는 것.

### 단점... 언제 사용하면 좋을까?

- 하지만 단점은...
1) 아무때나 쓸 수 있는 것이 아니다.
	- 위의 예시를 보면 알 수 있겠지만, =="원본값을 표현하기 위해 bit 수" 가 "값의 범위를 표현하기 위한 bit 수" 보다 작아야 의미== 가 있다.
	- 가령 최소값과 최대값의 차이가 254 정도 된다면, 이 값들을 그냥 8bit 로 표현하는 것이나 별 다를바가 없다.
	- 하지만 만약 이상하게 큰 값이 가끔씩 등장한다면 이 "가끔씩 등장하는 이상한놈" 때문에 FOR 를 포기하는게 너무 아쉬울 것이다. 이를 위해 제안된 것이 [[Patched Frame Of Reference, PFOR (Encoding)|PFOR]] 이다.