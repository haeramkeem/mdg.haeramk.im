---
tags:
  - database
  - db-encoding
date: 2024-12-01
aliases:
  - Little endian base 128
  - LEB128
  - Variable int
  - Varint
---
> [!info]- 참고한 것들
> - [위키](https://en.wikipedia.org/wiki/LEB128)

## Varint

- 이건 $[0, \infty)$ 범위의 정수를 표현할 수 있는 방법으로 양의 정수를 variable-size byte array 로 나타내는것이다.
	- "가변길이" 이기 때문에 작은수라면 `int` 나 `long` 과 같은 fixed-size 보다 더 적은 수의 byte 로 수를 표현할 수 있긴 하지만
	- 근데 애매한 값들에 대해서는 fixed-size 보다 좀 더 많은 byte 를 사용할 수도 있다.
- 아이디어는 수를 [[Endian (Arch)|Little endian]] 으로 표현하되, MSB 는 "continuation bits", 즉 "계속할지 말지" 를 결정하는 것으로 reserve 해놓는 것이다.
	- 따라서 MSB 가 1이라면 다음 byte 가 더 있음을 나타내고
	- 0이라면 이것이 가장 마지막 byte 라는 것을 의미한다.

## 예시

### Encoding

- `50399` (`0xC4DF`) 를 LEB128 로 나타내 보자. 일단 이놈을 이진수로 바꾸면 다음과 같다.
	- 저 알파벳은 편의상 각 bit 를 식별하기 위해 붙여놓은 것이다. 각 bit 들이 어떻게 이동하나 확인하기 편할것이야

```
11000100 11011111
ABCDEFGH IJKLMNOP
```

- 이것을 LSB 부터 7bit 씩 자르면 다음처럼 되리라

```
11 0001001 1011111
AB CDEFGHI JKLMNOP
```

- 전부 다 7bit 가 될 수 있도록 padding 을 넣어준다.

```
0000011 0001001 1011111
     AB CDEFGHI JKLMNOP
```

- 가장 왼쪽의 byte 에는 MSB 를 0으로, 나머지는 1을 붙여준다.

```
00000011 10001001 11011111
      AB  CDEFGHI  JKLMNOP
```

- 마지막으로 이것을 [[Endian (Arch)|Little endian]] 으로 바꿔주면 완성이다.

```
11011111 10001001 00000011
 JKLMNOP  CDEFGHI       AB
--------------------------
    0xDF     0x89     0x03
```

### Decoding

- Decoding 은 반대로 해주면 된다. 위에서의 예시를 그대로 써보자.

```
    0xDF     0x89     0x03
11011111 10001001 00000011
```

- 우선 첫번째 byte 의 하위 7bit 를 가져와 결과값에 더해준다.

```
    0xDF
11011111
--------
 1011111
(Result: 1011111)
```

- MSB 를 봤더니 1이기 때문에, 다음 byte 를 가져온다.

```
    0x89
10001001
--------

(Result: 1011111)
```

- 마찬가지로 하위 7bit 를 가져오되, 이번에는 7 만큼 left shift 해서 결과값에 더해준다.

```
    0x89
10001001
--------
 0001001
(Result: 00010010000000 + 1011111 = 00010011011111)
```

- 이번에도 MSB 가 1이다. 다음놈을 가져온다.

```
    0x03
00000011
--------

(Result: 00010011011111)
```

- 하위 7비트를 가져오되, 이번에는 14만큼 left shift 한다.

```
    0x03
00000011
--------
 0000011
(Result: 000001100000000000000 + 00010011011111 = 000001100010011011111)
```

- 이번에는 MSB 가 0이다. 여기까지의 결과를 정수로 바꿔주면 기가막히게 `50399` 가 나온다.

```
Result: 000001100010011011111 = 50399
```

## 예시 코드

- 이걸 C 로 짜보면 대강 다음처럼 된다.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

long leb_decode(char *bytes, int length) {
	int shift = 0;
	long ret = 0;
	for (int i = 0; i < length; i++) {
		ret |= (bytes[i] & 0x7F) << (shift * 7);
		if (((bytes[i] >> 7) & 0x1) == 1) {
			shift++;
		} else {
			return ret;
		}
	}
	return -1;
}

char* leb_encode(long val, int *length) {
	char buf[16] = {0};
	int i = 0;
	for (; i < 16; i++) {
		if (val == 0)
			break;
		char msb = (val >> 7) > 0 ? 0x80 : 0;
		buf[i] = (val & 0x7F) | (msb);
		val >>= 7;
	}
	char *ret = (char *)malloc(i * sizeof(char));
	memcpy(ret, buf, i);
	*length = i;
	return ret;
}

void print(char *bytes, int length) {
	printf("{");
	for (int i = 0; i < length - 1; i++)
		printf("0x%02X, ", bytes[i] & 0xFF);
	printf("0x%02X}\n", bytes[length - 1] & 0xFF);
}

int main() {
	char bytes[3] = {0xDF, 0x89, 0x03};
	print(bytes, 3);
	long decode = leb_decode(bytes, 3);
	printf("%ld\n", decode);
	int enc_len = 0;
	char *encode = leb_encode(decode, &enc_len);
	print(encode, enc_len);
	free(encode);
}
```