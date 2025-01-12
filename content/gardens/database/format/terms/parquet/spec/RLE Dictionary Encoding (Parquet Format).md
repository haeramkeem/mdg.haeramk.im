---
tags:
  - database
  - db-format
  - db-parquet
aliases:
  - Parquet RLE Dictionary Encoding
  - Parquet Plain Dictionary Encoding
date: 2025-01-09
---
> [!info]- 참고한 것들
> - [공홈](https://parquet.apache.org/docs/file-format/data-pages/encodings/#dictionary-encoding-plain_dictionary--2-and-rle_dictionary--8)

## RLE-Dictionary Encoding

- [[Parquet (Database Format)|Parquet]] 에서 [[Dictionary Encoding (Encoding)|DICT]] encoding 을 사용할 때, dictionary array 에 대한 indices 들은 [[Run Length Encoding, RLE (Encoding)|RLE]] 로 encoding 하는 RLE-DICT Encoding 을 사용한다.
- 원래는 Plain Dictionary Encoding 방식도 있었지만, 이 방식은 Parquet 2.0 spec 에서 deprecated 되었다.
- 일반적으로는 [[Column Chunk (Parquet Format)|ColumnChunk]] 를 encoding 할 때, 이 RLE-DICT Encoding 으로 encoding 으로 시작하되 만약에 Dictionary 가 너무 커지면 (즉, unique value 가 너무 많다면) 끊고 새로운 data page 를 시작해 [[Plain Encoding (Parquet Format)|Plain Encoding]] 으로 fall back 된다고 한다.

### Layout

- Dictionary 는 column chunk 별 dictionary page 하나로 별도로 저장되며, data page 들에는 이 dictionary page 에 대한 indices 들만 담기게 된다.
- 즉, Dictionary encoding 이 사용되면 column chunk 가 다음과 같이 구성된다는 것.

```
Column Chunk Layout:
+-----------------+-----------+-----------+-----------+
| DICTIONARY PAGE | DATA PAGE | DATA PAGE | DATA PAGE | ...
+-----------------+-----------+-----------+-----------+
```

- Dictionary page 는 [[Plain Encoding (Parquet Format)|Plain Encoding]] 으로 encoding 되며, data page 는 이 dictionary 의 indices 가 [[RLE-BP Hybrid Encoding (Parquet Format)|RLE-BP Hybrid Encoding]] 으로 encoding 되지만, 이에 앞서 BP bit width 가 1byte 로 저장된다.
- 즉, 아래와 같은 layout 을 가지게 된다는 것.

```
Dictionary Page Layout:
+-------------+--------------------------+
| PAGE HEADER | PLAIN ENCODED DICT ARRAY |
+-------------+--------------------------+
```

```
Data Page Layout:
+-------------+-------+-------------------+-----------------------------+
| PAGE HEADER | LEVEL | BIT WIDTH (1BYTE) | RLE-BP ENCODED DICT INDICES |
+-------------+-------+-------------------+-----------------------------+
```