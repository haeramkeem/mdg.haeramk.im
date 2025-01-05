---
tags:
  - database
  - db-format
  - db-parquet
aliases:
  - Parquet Plain Encoding
date: 2024-12-30
---
> [!info]- 참고한 것들
> - [공홈](https://parquet.apache.org/docs/file-format/data-pages/encodings/#PLAIN)

## Raw Data Encoding

- [[Parquet (Database Format)|Parquet]] 에서는 다양한 type 의 데이터를 physical 하게는 한정된 방식으로 바꿔서 표현한다.
	- 가령 UTC time 같은 경우에는 byte array 로 표현하는 등
- 총 8개가 있는데, 하나씩 살펴보자.

### `BOOLEAN`

- Boolean 값은 0 과 1 이기 때문에 1bit 로 [[Bit Packing, BP (Encoding)|BP]] 된다.
- 다만 LSB 부터 시작한다는 점. 그래서 예를 들어보면 아래와 같은 boolean 배열은

```
label:    A     B     C     D    E    F     G     H
val:   TRUE FALSE FALSE FALSE TRUE TRUE FALSE FALSE
```

- 이렇게 encoding 된다는 것.

```
encoding: 00110001 (0x31)
label:    HGFEDCBA
```

### `INT32`, `INT64`, `INT96`

- 얘는 별 [[Endian (Arch)|Little endian]] 으로 4byte 혹은 8byte [[Integer (C++ Number)|Integer]] 로 저장된다.
	- 물론 `INT96` 은 12byte 로 저장된다. 근데 얘는 deprecated 되었으므로 신경쓰지 말자.

### `FLOAT`, `DOUBLE`

- 얘도 별 특이사항 없이 그냥 [[Float, Double Point, IEEE 754 (C++ Number)|IEEE 754]] 로 저장된다.

### `BYTE_ARRAY`, `FIXED_LEN_BYTE_ARRAY`

- 얘는 4byte little endian int32 로 byte array 의 길이를 저장한뒤, 그 다음에 해당 길이 만큼의 byte 들을 저장하는 식이다.
- `BYTE_ARRAY` 의 경우에는 모든 value 에 대해 이렇게 저장하고, `FIXED_LEN_BYTE_ARRAY` 는 맨 앞에다가 길이는 하나만 저장하고, 다음에는 모두 고정크기의 byte array 가 나온다.
- 예를 들어, 다음과 같은 애들을 저장하려고 한다면,

```
"AB" "CDE" "FGHI"
```

- `BYTE_ARRAY` 는 이렇게 저장하고,

```
|---- length -----| |0| |---- length -----| |-1-| |---- length -----| |--2--|
0x02 0x00 0x00 0x00 A B 0x03 0x00 0x00 0x00 C D E 0x04 0x00 0x00 0x00 F G H I
```

- `FIXED_LEN_BYTE_ARRAY` 는 이렇게 저장한다는 것.

```
|---- length -----| |-----0-----| |---1----| |--2--|
0x04 0x00 0x00 0x00 0x00 0x00 A B 0x00 C D E F G H I
```