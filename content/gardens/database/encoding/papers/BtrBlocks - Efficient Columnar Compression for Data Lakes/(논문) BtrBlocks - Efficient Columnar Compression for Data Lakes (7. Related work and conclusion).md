---
tags:
  - Database
  - 논문
date: 2024-07-17
---
> [!info] 본 글은 논문 [BtrBlocks - Efficient Columnar Compression for Data Lakes (SIGMOD '23)](https://dl.acm.org/doi/10.1145/3589263) 를 읽고 정리한 글입니다.

> [!info] 별도의 명시가 없는 한, 본 글의 모든 그림은 위 논문에서 가져왔습니다.

> [!info]- 목차 - 진짜 너무 길어서 section 별로 식물을 쪼갰습니다.
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (1. Abstract, Intro)|1. Abstract, Intro]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)|2. Background]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (3. Scheme selection and compression)|3. Scheme selection and compression]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (4. Pseudodecimal encoding)|4. Pseudodecimal encoding]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (5. Fast decompression)|5. Fast decompression]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (6. Evaluation)|6. Evaluation]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (7. Related work and conclusion)|7. Related work and conclusion (현재 글)]]

## 7. Related Work

### 7.0. *Overview*

> [!tip] [[#7.0. *Overview*|Section 7.0.]] Overview
> - 마찬가지로 논문에는 없는 section 이고, 형식상 주인장이 끼워 넣은 것이다.
> - Column store 과 관련된 것들이 많이 있지만, 여기서는 BtrBlock 과 관련된 애들만 추려서 살펴볼 예정이다.

#### 7.0.1. SQL Server.

> [!info] 참고
> - [MS SQL Server Columnstore Index](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/columnstore-indexes-overview)
> - [SIGMOD'10](https://dl.acm.org/doi/pdf/10.1145/1989323.1989448)

- MS 의 SQL Server 에서 제공하는 columnar data format 을 *Columnstore Index* 라고 한다.
- 여기서는 table 의 최대 1,048,576 개의 row 를 모아 *Rowgroup* 을 만들고, 이때의 각 column data 들을 *Column Segment* 라고 한다.
- 이 *Column Segment* 단위로 compression 을 진행하는데, 다음과 같은 순서로 진행한다고 한다:
1) 모든 값을 정수로 표현하기
	- 각 자료형별로는 이렇게 정수로 바꾼다고 한다:
	1. String: 이놈은 dictionary 를 사용한다.
		- 최근 버전에서는 4byte `int` 로 변환하는 것이 아닌 short string 을 사용해서 더욱 최적화했다고 한다 [^sql-server-short-string].
	2. Double: 이놈에게는 smallest common exponent 를 찾아 그것을 곱하여 정수로 바꾼다고 한다.
		- 가령 $123 * 2^{-3}$ 과 $456 * 2^{-5}$ 두 값이 있을 때, $2^{5}$ 를 곱해서 $492$ 와 $456$ 로 만든다.
	3. Integer: 이놈은 leading zero ($12300$ 에서 $00$) 를 지우고, [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.5. FOR & Bit-packing|FOR]] 를 적용한다.
2) *Rowgroup* 내의 row 들을 재배치하여 compression 하기 쉽게 변환
	- Row 를 재배치하는 이유는 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.2. RLE & One Value.|RLE]] 를 위해서이다; compression scheme 를 적용할 때에는 순서를 바꿔 run length 가 최대가 되게 하면 좋기 때문.
	- 또한 column 단위가 아니고 row 단위로 재배치하는 이유는 column data 들을 재배치할 경우 row 방향으로 읽었을 때 다른 값이 읽일 수 있기 떄문이다.
	- RLE 말고 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.5. FOR & Bit-packing|Bit-packing]] 를 적용하기도 한다.
3) Compress
- 구체적인 과정은 공개되어있지 않고, MS 내부 데이터로 실험한 결과 5.1배 더 compression ratio 가 좋았다고 한다.

#### 7.0.2. DB2 BLU.

> [!info] 참고
> - [VLDB'13](https://www.vldb.org/pvldb/vol6/p1080-barber.pdf)

- IBM 의 DB2 에는 columnar store compression 을 위해 *BLU* 라는 방법이 추가되었다.
- 이놈은 대략 다음과 같이 한다:
	- 여러 *Column Segment* 들을 하나의 고정된 크기의 page 에 저장한다.
		- 참고로 [[#7.0.1. SQL Server.|SQL Server]] 에서는 이렇게 안한다고 하네.
	- 각 Column Segment 들은 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.4. Frequency|Frequency encoding]] 으로 압축된다.
	- 이후에 data distribution 에 따라 한번 더 local dictionary [^local-directory] 나 offset-coding [^offset-coding] 으로 압축될 수도 있다고 한다.
- 이놈의 장단점은 다음과 같다.
	- 우선 장점은, ([[#7.0.1. SQL Server.|SQL Server]] 도 마찬가진데) decompression 하지 않고 range query 가 가능하도록 디자인 되어 있다.
	- 하지만 단점은, bitwise-operation 이 되어 있기 때문에 point acccess (random access 라고 생각하자) 는 decompression 을 동반한다고 한다.

#### 7.0.3. SIMD decompression and selective scans.

#### 7.0.4. Compressed data processing in BtrBlocks.

#### 7.0.5. HyPer Data Blocks.

#### 7.0.6. SAP BRPFC.

## 8. Conclusion

[^sql-server-short-string]: 구체적으로 어떻게 되는지는 모르겠지만, 별로 중요한건 아니니 나중에 궁금하면 찾아보자.
[^local-directory]: 이게 뭔지 (그냥 Dictionary 와는 뭐가 다른지) 정확히는 모르겠다. 
[^offset-coding]: 이것도 뭔지 모르겠다. 느낌으로는 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.5. FOR & Bit-packing|FOR]] 하고 비슷해보인다.