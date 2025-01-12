---
tags:
  - database
  - db-format
  - db-parquet
aliases:
  - Parquet RLE-BP Hybrid Encoding
  - Parquet Bit-packed Encoding
date: 2025-01-09
---
> [!info]- 참고한 것들
> - [공홈 (RLE-BP Hybrid)](https://parquet.apache.org/docs/file-format/data-pages/encodings/#run-length-encoding--bit-packing-hybrid-rle--3)
> - [공홈 (Bit-packed)](https://parquet.apache.org/docs/file-format/data-pages/encodings/#bit-packed-deprecated-bit_packed--4)

## RLE-BP Hybrid Encoding

- [[Parquet (Database Format)|Parquet]] 에서는 [[Run Length Encoding, RLE (Encoding)|RLE]] 와 [[Bit Packing, BP (Encoding)|BP]] 를 섞은 encoding 을 사용한다.
	- 이 encoding 방식이 사용되는 경우는 한정적이다:
		1) [[4. Nested Columnar Storage (Dremel, VLDB 10)|Repetition Level]] 와 [[4. Nested Columnar Storage (Dremel, VLDB 10)|Definition Level]] encoding 할 때
		2) [[RLE Dictionary Encoding (Parquet Format)|RLE Dictionary Encoding]] 에서 dictionary indices 를 encoding 할 때
		3) Boolean value 를 encoding 할 때 [[Plain Encoding (Parquet Format)|Plain Encoding]] 대신 사용
- 일단 deprecated 된 BP Encoding 부터 알아보자.

## Bit-packed (Deprecated) (`BIT_PACKED=4`)

- 간단하다. 어떤 값을 fixed-width 로 bit-packing 해서 MSB 부터 채우는 방식이다.
- 공식 문서에 있는 예시를 보면,

```
dec value: 0   1   2   3   4   5   6   7
bit value: 000 001 010 011 100 101 110 111
bit label: ABC DEF GHI JKL MNO PQR STU VWX
```

- 이렇게 width 가 3 인 8 개의 값을 BP 하면,

```
bit value: 00000101 00111001 01110111
bit label: ABCDEFGH IJKLMNOP QRSTUVWX
```

- 이렇게 MSB 부터 차곡차곡 채워지게 된다.
- 이 방식은 Parquet 2.0 spec 부터는 deprecated 되었다. 이제부터 설명할 RLE-BP Hybrid 가 이 encoding 의 superset 이기 때문.

## Run Length Encoding, Bit-Packing Hybrid (`RLE=3`)

- 이건 RLE 와 BP 를 "Hybrid" 해놓은 것이다.
	- 여기서 "Hybrid" 를 강조해 놓은 이유는, RLE 와 BP 가 fusing 된 것이 아니기 때문이다.
	- 즉, RLE 를 한 다음에 이것을 BP 해서 저장하는게 아니고, RLE "혹은" BP 로 encoding 하는 방식이다.
- Encoding 방식을 차근차근 보자. 일단 전체 구조는 다음과 같다.

### Overall Layout

```
+--------+--------------+
| LENGTH | ENCODED DATA |
+--------+--------------+
```

- 저 `LENGTH` 는 `ENCODED DATA` 에 대한 byte 단위 사이즈인데, 이놈이 항상 붙는 것은 아니다.
- 만약에 page header 같은데에 이 길이가 적히는 경우에는 굳이 적지 않게 된다.
	- 가령 [data page header v1](https://github.com/apache/parquet-format/blob/d784f11f4485e64fdeaa614e0bde125f5132093d/src/main/thrift/parquet.thrift#L593-L615) 의 경우에는, [[4. Nested Columnar Storage (Dremel, VLDB 10)|Definition Level]] 이나 [[4. Nested Columnar Storage (Dremel, VLDB 10)|Repetition Level]] 에 RLE-BP Encoding 을 사용할 때 이놈의 데이터 사이즈를 적어줄 방법이 없기 때문에 이런 `LENGTH` 가 붙는다.
	- 하지만 [data page header v2](https://github.com/apache/parquet-format/blob/d784f11f4485e64fdeaa614e0bde125f5132093d/src/main/thrift/parquet.thrift#L637-L673) 에서는 이 사이즈를 적어주는 field 가 추가되었고, 따라서 더이상 저 `LENGTH` 가 붙지 않는다.
- 공식문서에 나와있는 저 `LENGTH` 를 붙이냐 마냐에 대한 표는 다음과 같다.

| Page kind    | RLE-encoded data kind | Prepend length? |
| ------------ | --------------------- | --------------- |
| Data page v1 | Definition levels     | Y               |
|              | Repetition levels     | Y               |
|              | Dictionary indices    | N               |
|              | Boolean values        | Y               |
| Data page v2 | Definition levels     | N               |
|              | Repetition levels     | N               |
|              | Dictionary indices    | N               |
|              | Boolean values        | Y               |

### `ENCODED DATA` = `RUN`s

- 그리고 저 `ENCODED DATA` 는 `RUN` 들로 이루어져있고, `RUN` 은 `HEADER` 와 `VALUE` 로 구성되어 있다.
	- 여기서 조심할 것은 저 `RUN` 이라는 것이 RLE 에서의 Run 으로 이해하면 안된다는 것이다.
	- 즉, 이 `RUN` 은 그냥 하나의 단위이고, 저 단위는 RLE 로 encoding 되어있을 수도 있고 BP 로 encoding 되어있을 수도 있는 것.

```
<----- RUN -----><----- RUN -----><----- RUN ------> ...
+--------+-------+--------+-------+--------+-------+
| HEADER | VALUE | HEADER | VALUE | HEADER | VALUE | ...
+--------+-------+--------+-------+--------+-------+
```

### `HEADER`

- 여기서 저 `VALUE` 의 길이와, 이 `VALUE` 가 RLE 인지 BP 인지를 나타내는 정보가 `HEADER` 이다.
- 일단 BP 의 경우에는 다음과 같이 `HEADER` 가 구성된다.

```
HEADER = VARINT( BP VALUE COUNT << 1 | 1 )
```

- 그리고 RLE 의 경우에는 다음과 같이 `HEADER` 가 구성된다.

```
HEADER = VARINT( RLE VALUE COUNT << 1 )
```

- 보면 모두 `... VALUE COUNT` 라는 것이 일단 왼쪽으로 shift 되고, BP 의 경우에만 1 이 `OR` 된 뒤에 [[Little Endian Base 128, LEB128 (Encoding)|LEB128]] 로 encoding 된다는 것을 알 수 있다.
- 따라서 LEB128 을 decoding 한 다음에 LSB 가 1인지 0인지를 확인하면 이것이 BP encoding 인지 RLE encoding 인지 알 수 있게 된다.

> [!tip]- DuckDB CodeRef
> - [DuckDB (NextCount)](https://github.com/duckdb/duckdb/blob/c28ce393504163a415670d5267ddf5b6a0d75582/extension/parquet/include/parquet_rle_bp_decoder.hpp#L84-L114)

- 여기서 저 `VALUE COUNT` 가 의미하는 바는 BP 와 RLE 각각에 대해 다르다.
- 일단 BP 는 다음과 같다.

```
BP VALUE COUNT = (NUMBER OF VALUES) / 8
```

- 왜 이렇게 하냐:
	- BP 는 bit 단위이기 때문에, 항상 8의 배수 개수의 value 들을 BP 해야만 byte 단위로 끊어지게 된다.
	- 따라서 실제 encoding 된 value 들의 개수를 8로 나누어 저장하게 되는 것.
- 그리고 RLE 는 다음과 같다.

```
RLE VALUE COUNT = (NUMBER OF REPEATED VALUES)
```

- 보다시피 RLE 는 반복되는 값을 "몇번 반복되냐" 와 "뭐가 반복되냐" 두가지 정보로 encoding 하기 때문에, 이 `RLE VALUE COUNT` 로서 "몇번 반복되냐" 가 저장되는 것을 알 수 있다.

### `VALUE`

- RLE 는 이 `VALUE` 로서 그냥 "반복되는 값" 이 적혀있다.
- 다만, byte 단위의 packing 정도는 되어 있다. 즉, 어떤 값이 3bit 로 표현된다면 이 값은 1byte 로 저장되는 것 (*round-up-to-next-byte*).
- 골치아픈건 BP 이다. 위의 deprecated 된 [[#Bit-packed (Deprecated) (`BIT_PACKED=4`)|Bit-packed]] 방식과는 다르게, BP 된 값들이 LSB 부터 채워진다.
- 즉, 공식문서의 예시를 가져오면, 아래와 같은 값들이

```
dec value: 0   1   2   3   4   5   6   7
bit value: 000 001 010 011 100 101 110 111
bit label: ABC DEF GHI JKL MNO PQR STU VWX
```

- 이렇게 packing 된다는 것.

```
bit value: 10001000 11000110 11111010
bit label: HIDEFABC RMNOJKLG VWXSTUPQ
dev value: 22111000 54443332 77766655
```

- 이놈을 unpacking 하는 것은 코드로 한번 확인해 보자.

### BP Unpacking (DuckDB)

> [!tip]- DuckDB CodeRef
> - [DuckDB (BP decoder)](https://github.com/duckdb/duckdb/blob/c28ce393504163a415670d5267ddf5b6a0d75582/extension/parquet/include/decode_utils.hpp#L34-L59)
> - [DuckDB (BP decoder constants)](https://github.com/duckdb/duckdb/blob/c28ce393504163a415670d5267ddf5b6a0d75582/extension/parquet/column_reader.cpp#L38-L106)

- BP unpack 하는 DuckDB 코드는 다음과 같다.

```C++
template <class T>
static void BitUnpack(ByteBuffer &src, bitpacking_width_t &bitpack_pos, T *dst, idx_t count,
					  const bitpacking_width_t width) {
	CheckWidth(width);
	const auto mask = BITPACK_MASKS[width];
	src.available(count * width / BITPACK_DLEN); // check if buffer has enough space available once
	if (bitpack_pos == 0 && count >= BitpackingPrimitives::BITPACKING_ALGORITHM_GROUP_SIZE) {
		idx_t remainder = count % BitpackingPrimitives::BITPACKING_ALGORITHM_GROUP_SIZE;
		idx_t aligned_count = count - remainder;
		BitUnpackAlignedInternal(src, dst, aligned_count, width);
		dst += aligned_count;
		count = remainder;
	}
	for (idx_t i = 0; i < count; i++) {
		auto val = (src.unsafe_get<uint8_t>() >> bitpack_pos) & mask;
		bitpack_pos += width;
		while (bitpack_pos > BITPACK_DLEN) {
			src.unsafe_inc(1);
			val |= (static_cast<T>(src.unsafe_get<uint8_t>())
					<< static_cast<T>(BITPACK_DLEN - (bitpack_pos - width))) &
				   mask;
			bitpack_pos -= BITPACK_DLEN;
		}
		dst[i] = val;
	}
}
```

- 여기서 눈여겨봐야할 곳은 저기 `for` loop 안쪽이다. 이부분을 차근차근 살펴보자.
	- 일단 저기서 `mask` 는 width 에 대해서 모두 LSB 부터 `1` 로 bit 가 켜져있는 값이다.
		- 즉, 예를들어 만약에 width 가 3이라면 `111b` (`0x07`) 이고, width 가 7 이면 `1111111b` (`0x007F`) 인것.
		- 이렇게 32bit 기준 33 개의 가능한 width 에 대해 모두 mask 를 계산해서 constant array 에 넣어놓고, 요청된 width 에 맞는 mask 를 가져와 저장한 변수가 `mask` 이다.
	- 그리고 `val` 은 현재 처리중인 byte 를 저장하는 변수이고, `bitpack_pos` 는 mask 가 씌워질 offset 를 의미한다.
- 이렇게만 말하면 뭔소린지 이해가 안될텐데, `width=5` 인 예시를 가지고 살펴보자.
- 우선 `val` 에 byte 를 하나 읽어왔다고 해보자.
	- `bitpack_pos` 의 초기값은 0이다.

![[Pasted image 20250109123948.png]]

- 그리고 `bitpack_pos` 부터 width 만큼 `mask` 를 씌워서 가져온 뒤, width 만큼 `bitpack_pos` 를 움직인다.

![[Pasted image 20250109124001.png]]

- 보면 알 수 있다시피, 이 경우에는 width 만큼의 bit 를 모두 unpack 했으므로 더이상 할게 없다.
	- 코드에서 생각해 보면 `bitpack_pos` 가 5 이고, byte 의 크기를 의미하는 constant 인 `BITPACK_DLEN` 는 8 이기 때문에 `while` loop 은 돌지 않고 끝난다.
- 그리고 `for` loop 을 돌아 다음 값을 unpack 할 때를 보자.
- 이전의 byte 를 `bitpack_pos` 만큼 shift 하고, mask 를 씌우는 것은 다음과 동일하다.

![[Pasted image 20250109124131.png]]

- 그리고 `bitpack_pos` 를 width 만큼 움직이면 다음과 같다.

![[Pasted image 20250109124344.png]]

- 즉, 이번에는 8 을 넘어가게 되어 `while` loop 을 돌게 된다.

![[Pasted image 20250109131837.png]]

- 여기서는 일단 `src.unsafe_inc(1)` 로 다음 byte 를 가져오게 되고, 이놈을 저 "파란색 점선 화살표" 만큼 shift 한 뒤 mask 를 씌워 이전에 갖고온 값과 `OR` 를 해주면 될 것이다.
- 그럼 저 "파란색 점선 화살표" 의 크기는 어떻게 구할까.

![[Pasted image 20250109132450.png]]

- 사실 그림으로 보는게 더 편하다: 검은색 점선의 크기가 `bitpack_pos - 8` 이기 때문에 저 파란색 점선의 크기는 `8 - (bitpack_pos - width)` 가 된다.
- 이 로직을 통해 1byte 안에 들어오는 값과 여러 byte 에 걸치는 값을 깔끔하게 unpacking 할 수 있게 된다.