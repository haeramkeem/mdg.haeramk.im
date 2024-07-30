---
tags:
  - Database
  - db-encoding
date: 2024-07-30
---
> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/Prefix_code)

## Comma Free Code

- 어떤 값들의 sequence 를 표현하는 것은 다음과 같이 두가지 접근이 있다고 볼 수 있다.

### Fixed-size

- 첫번째 접근은 각 "값" 들이 동일한 크기를 가지고 있게 하는 것이다.
- 이 방식을 사용하는 것이 프로그래밍 언어에서의 배열이다:
	- C 언어에서 어떤 배열을 담는 변수는 사실 배열을 담고 있는게 아니라 배열의 시작 주소를 담고 있는 포인터라는 것을 이미 알고 있을 것이다.
	- 근데 왜 "시작 주소" 만 가지고 배열을 표현할 수 있을까? 그건 각 배열 원소들의 사이즈가 이미 정해져 있기 때문이다.
		- 가령 `int a[];` 의 경우, 각 원소는 `int` 자료형이므로 4byte (32bit) 사이즈를 가지고,
		- 따라서 `a[7]` 에 접근하기 위해서는 `a` 에 담긴 주소에 `7 * 4byte` 를 더한 주소를 읽으면 될 것이야.

### Variable size

- 근데 만약 각 원소의 크기가 고정적이지 않다면 어떻게 할까?
- 가장 먼저 생각나는 것은 *delimiter* 를 사용하는 것이다.
	- 가령 `,` 를 delimiter 로 해서 `ab,cde,f,g` 로 표현할 수 있을 것이다.
	- 이러한 접근 방식의 대표적인 예시가 *CSV* (*Comma-Separated Values*) 이다.
- 근데 이런 *delimiter* 도 사용하지 않고 표현할 수 있을까? 즉, comma-free code 가 가능할까?
- 이에 대한 해답이 *Prefix Code* 이다.

## Prefix Free Code

- *Prefix Code* 혹은 *Prefix Free Code* 라고도 불리는데, 이건 쉽게 말하면 ==한 code 가 다른 code 의 prefix 로 들어가지 않게 하는 것== 를 의미한다.
- 만약 prefix-free 하지 않은 code 를 한번 보자.
	- 먼저 세 값 (`0`, `1`, `10`) 들의 나열은 prefix-free 하지 않다.
	- 왜냐면 일단 `1` 은 `10` 의 prefix 이기 때문이다.
	- 이러한 값들의 문제는 나열하게 되면 "모호함" 이 생기게 된다는 것이다.
	- 가령 위의 세 값으로 표현한 `1010` 가 (CSV 로 바꿔보자면) `1`, `0`, `10` 인지 `10`, `10` 인지 알 방법이 없다.
- 그럼 prefix-free 한 code 는 어떨까?
	- 위의 예시에서 `1` 을 `11` 로 바꿔보자. 그럼 (`0`, `11`, `10`) 는 prefix-free 하다는 것을 금방 알 수 있다.
	- 그럼 위의 세 값들을 나열한 `10011` 은 (CSV 로 바꿔보자면) `10`, `0`, `11` 로 밖에 해석될 여지가 없다는 것을 알 수 있다.
		- 가운데 `00` 이 `0`, `0` 으로 해석될 여지는 없다. 왜냐면 그렇게 하면 앞에 `1` 이 남고, 이 `1` 은 세 값 중에 없기 때문이다.
- 이렇듯 prefix-free 한 값들을 사용하면, 해당 값들이 variable size 여도 comma 없이 나열할 수 있다는 것을 알 수 있다.
- 물론 [[#Comma Free Code|위]] 에서의 문맥과는 약간 다르긴 하다. 위에서는 이 "값" 들에 대한 제약조건은 없었는데 여기서는 생겨버렸으니까.
	- 따라서 이런 "값" 들을 prefix-free code 에 1:1 대응시키면 제약조건이 없는 가변사이즈의 "값" 들을 comma 없이 표현할 수 있게 된다.

## 어디에 쓸까?

- Compression 에서 쓸 수 있다. 대표적으로는 [[Huffman Coding (Encoding)|허프만 코딩]] 이 있다.
- 또는 CPU 의 instruction 도 이런 prefix code 를 사용한다.
	- 물론 MIPS 나 RISC 와 같이 instruction 의 bit 수를 일정하게 맞추는 fixed-size instruction 도 있지만,
	- x86 같은 애들은 variable size 이고, 이때 각 instruction 이 prefix-free 하게 설계한다.
	- 이건 왜냐면 cpu 에 흘러들어오는 것은 bit stream 이고 comma 따위는 없기 때문이다. 이러한 bit stream 에서 각 instruction 을 구분해서 실행하기 위해서는 instruction 이 fixed-size 이던가, 아니면 prefix-free 이어야 할 것이다.