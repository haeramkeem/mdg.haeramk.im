---
tags:
  - arch
date: 2024-12-01
aliases:
  - Little endian
  - Big endian
---
> [!info]- 참고한 것들
> - [티스토리 블로그](https://softtone-someday.tistory.com/20)
> - [스댕](https://stackoverflow.com/a/13001446)

## Little, Big Endian

- CS 를 공부해 봤다면 다들 endianness 는 알고 있다. 다만 까먹을 뿐
- 복기하자면, 이 둘은 byte 를 배치하는 순서에 대한 것이다.
	- *Little endian* 은 작은 자리수의 byte 가 먼저 등장하는 방식이고,
	- *Big endian* 은 큰 자리수의 byte 가 먼저 등장하는 방식이다.
- 이렇게만 말하면 처음 접하는 사람들은 뭔소리고?? 라고 할 수 있다. 예시를 들어보자.

### Little Endian

- 16진수 32bit integer 숫자 `0x12345678` 는 *Little endian* 에서는 다음과 같이 표현된다.
	- 즉, *Little endian* 에서는 작은 자리수의 byte 인 `0x78` 부터 등장한다.

```
| 0x78 | 0x56 | 0x34 | 0x12 |
-----------------------------> Memory address
```

- C 언어로는 이렇게 되는 셈.

```C
char little_endian[4] = {0x78, 0x56, 0x34, 0x12};
```

### Big Endian

- 그리고 *Big endian* 에서는 다음과 같이 표현된다.
	- 즉, *Big endian* 에서는 큰 자리수의 byte 인 `0x12` 부터 등장한다.

```
| 0x12 | 0x34 | 0x56 | 0x78 |
-----------------------------> Memory address
```

- C 언어로는 이렇게 되는 셈.

```C
char big_endian[4] = {0x12, 0x34, 0x56, 0x78};
```

## 조심할 것: 사용되는 사례

- 사실 중요한 것은 "언제" little, big endian 을 사용해야 하는가? 이다.
	- Byte 순서가 반대이기 때문에 까딱 잘못하면 이상한 값이 튀어나오게 되는 것.
- 흔히 사용하는 computer architecture 에서는 전부 little 을 사용한다.
	- `AMD64` 나 (요즘은 Apple silicon 을 사용하는 사람이 많아졌기 때문에) `ARM` 에서는 little endian 을 사용하면 된다.
	- 이 둘 말고 다른 이상한 architecture 를 사용하는 경우에는 직접 검색해서 확인해보는 것이 좋다.
- 하지만 network packet 의 경우에는 big 을 사용한다.
	- 그래서 little endian 기반의 CPU 를 위한 network driver 에서는 packet 을 처리할 때 항상 endianness 를 바꿔준다.

## 변환 코드

- 어차피 big endian 은 little endian 에서 순서만 바꿔주면 되니까, byte stream 을 little endian primitive type 으로 바꾸는 코드만 살펴보자.
	- 대부분 little endian 을 쓰면 되기 때문에 사실 그냥 [[C - Memory utils (memcpy, memset)|memcpy]] 만 해주면 된다.
	- 근데 혹시나 architecture-free 한 코드를 짜고자 한다면, 요래하면 되니라

```c
int little_endian(char *bytes) {
	return (bytes[0] & 0xFF)
			| (bytes[1] & 0xFF) << 8
			| (bytes[2] & 0xFF) << 16
			| (bytes[3] & 0xFF) << 24;
}
```

- 아니면 이런 macro 를 활용해도 된다.

```C
#define LITTLE(arg) ((*(arg) & 0xFF) | \
					((*((arg) + 1) & 0xFF) << 8) | \
					((*((arg) + 2) & 0xFF) << 16) | \
					((*((arg) + 3) & 0xFF) << 24))
```