---
tags:
  - Database
  - 논문
date: 2024-07-17
---
> [!info] 본 글은 논문 [BtrBlocks - Efficient Columnar Compression for Data Lakes (SIGMOD '23)](https://dl.acm.org/doi/10.1145/3589263) 를 읽고 정리한 글입니다.

> [!info] 별도의 명시가 없는 한, 본 글의 모든 그림은 위 논문에서 가져왔습니다.

> [!fail] 본 문서는 아직 #draft 상태입니다. 읽을 때 주의해 주세요.

## 1. Abstract & Intro.

### 1.1. Data warehousing is moving to the cloud.

- 엄청나게 많은 양의 데이터를 저장하는 것과 그것들을 연산하는 방법에 대한 요즘 근황의 제일 큰 특징은 다음의 두 가지이다:
	- Cloud 생태계를 이용한다.
		- 사용자들은 데이터를 cloud 가 제공하는 data warehouse solution 들을 이용하여 데이터를 저장하고 분석한다.
	- 데이터의 "저장" 과 "연산" 을 분리한다.
		- 데이터를 저장하는 것은 cloud 의 object storage 에, 데이터 분석을 위한 연산은 on-demand 로 computing power 를 변경할 수 있는 computing instance 를 사용한다.

### 1.2. Data warehouses can become proprietary data traps.

- Cloud-native data warehouse 에서는 analytical query 의 "연산" 부분이 최적화 되어 왔다.
	- 가령, Vectorized processing [^vectorized-processing] 이나 Compilation [^compilation] 으로 최적화하는 등.
- 근데 이 논문의 저자들은 "연산" 부분이 아닌 "저장" 부분을 최적화 하려는 갑다.
- 이 모든 data warehouse 들은 object storage 에 저장할 때 compressed columnar data 형태로 저장한다.
- 하지만 대부분의 시스템들은 다른 시스템과는 호환되지 않는 데이터 형식 (즉, *proprietary data format*) 을 사용해 왔고, 이것은 데이터들이 하나의 시스템이나 서비스 제공자에게 종속되도록 했다.
- 또한 AI-ML 분야에서의 (SQL 와 같은) 정형화된 형태가 아닌 데이터의 경우에는 커다란 크기의 데이터를 불러와 연산하는 경우가 부지기수였고, 이것은 비쌀 뿐 아니라 비효율적이었다.
	- 가령 어떤 경우에는 데이터가 storage 에 이미 있는데도 불구하고, 데이터들을 불필요하게 복사하며 비용과 효율성을 안좋게 했다.

### 1.3. Data lakes and open storage formats.

- Data lake 는 Data warehouse 에서의 "다른 시스템과의 호환되지 않는 데이터 형식" 에서 벗어나, 여러 시스템에서 호환되는 데이터 형식으로 object storage 에 데이터를 때려 넣고 그 "데이터의 호수" 에 여러 analytical system 을 붙여 사용할 수 있게
	- 이 "여러 시스템에서 호환되는 데이터 형식" 이 [ORC](https://github.com/apache/orc) 나 [Parquet](https://github.com/apache/parquet-java/) 이다.
- 하지만 이 개념은 제시된지 오래되었음에도 불구하고 [^data-lake-proposal], 아직까지 proprietary system 들이 더 흔하게 사용되는데 그 이유는:
	1) Data lake 와 analytical system 간의 네트워크가 너무 느리다 [^data-lake-network-bottleneck].
	2) Data format 들이 다른 proprietary solution 들에 비해 scan throughput 도 안나오고, 별로 compression ratio 가 높지도 않다.
		- 즉, compression ratio 가 낮으면 compression, decompression speed 라도 빨라야 하는데 딱히 그렇지도 않다는 것.
		- 그래서 보통은 다른 general-purpose compression solution 과 엮어서 Parquet + [Snappy](https://github.com/google/snappy) 나 Parquet + [Zstd](https://github.com/facebook/zstd) 와 같이 사용한다고 한다.
- 논문의 저자들은 위 두가지 문제점 중에서 (1) 은 해결된 것으로 보고 (가령 요즘의 AWS EC2 들은 100G 네트워크도 제공해주니까), (2) 에 집중한다.

### 1.4. BtrBlocks

- 그래서 제시한 것이 이 비띠알블럭인데, 이놈의 특징은:
	- 높은 압축률
		- 즉, 네트워크 대역폭 + object storage 용량을 덜 먹음.
	- 빠른 decompression
		- 즉, analytical system 에의 적은 CPU 부하
- 이라고 한다. 이것을 위해서 BtrBlock 은 각 block 을 compress 하기 위해 7가지 기존의 compression 알고리즘과 1가지 새로운 알고리즘 총 8개 중에 하나를 자동으로 선택한다고 한다.
	- 이 알고리즘들은 모두 decompression 이 매우 빠르고, 연속해서 실행할 수 있다 (cascade).
	- 즉, BtrBlock 을 한마디로 정리하면, data lake 를 위한 새로운 data compression scheme 을 제시하고 이것과 기존의 scheme 들을 포함한 것들 중에 하나를 adaptive 하게 선택하는 algorithm 을 제시했다고 할 수 있겠다.
- 그 결과 BtrBlock 은 상당히 좋은 결과를 냈는데, evaluation 에 대한 스포를 하자면:

![[Pasted image 20240717164138.png]]

- 일단 그래프는 가로축은 scan throughput 이기에 당연히 클 수록 좋고, 세로축은 1$ 당 몇번 scan 을 할 수 있냐 이기 때문에 클 수록 가성비가 좋은 셈이다.
	- 즉, 오른쪽 위로 갈 수록 좋다는 것.
- 대략 봐도 Parquet 를 사용했을 때 보다 더 좋다는 것을 알 수 있죠?

### 1.5. Related Work and Contributions

- 기존의 연구들은 대략:
	- 정수값에 대한 encoding 이 주로 연구되어 왔고, 문자열이나 실수값에 대한 encoding 은 흔치 않았다.
	- 또한, 한 알고리즘에 대한 대안책을 제시하고, 이들 간에 어떤 것을 선택할지에 대한 알고리즘을 제시하는 연구는 극히 적었다고 한다.

> [!tip] *Complete*, *End-to-end* 란?
> - 논문에서는 이러한 여러 scheme 들 중에 하나를 동적으로 선택하여 encoding 하는 방식을 *Complete* 혹은 *End-to-end* 라고 표현한다.

- 그래서 BtrBlock 의 contribution 은 다음과 같다:
	1) 주어진 data 에 대한 최적의 compression algorithm 을 선택하는, sampling-based algorithm.
	2) 새로운 실수값 encoding scheme: *Pseudodecimal Encoding*
	3) 그리고 위의 것들을 포괄하는 complete, one-size-fits-all compression solution.
	4) 마지막으로 이것에 대한, 실제 비즈니스 데이터에 대한 Public BI Benchmark 방법론.

> [!tip] BI 란?
> - BI 는 *Business Intelligence*, 즉 실제 비즈니스 환경에서 수집되고 사용되는 정보들을 일컫는다.

## 2. Background

### 2.1. Existing Open File Formats

#### 2.1.1. Parquet & ORC.

- Apache 의 Parquet 와 ORC 는 모두 OLAP 에서 사용하기 위한 오픈소스 column data format 이다.
- 이들 (그리고 대부분의 column data format 들이) block 단위 compression 을 진행한다고 한다.
- 논문에서는, 이 둘 중 Parquet 가 더 많이 사용되고 유명하기 때문에 이놈에 집중했다고 한다.

#### 2.1.2. Column encoding in Parquet.

- Parquet 에서는 이렇게 data compression (encoding) 을 한다고 한다:
	- RLE, Dictionary, Bit-packing, Delta Encoding 중 하나를 유저가 static 하게 선택하거나, 아니면 하드코딩된 규칙에 따라 선택된다고 한다.
- 여러 column 에 대한 chunk 들을 encoding 한 뒤에는 이것을 *Rowgroup* 라는 이름으로 묶고, 그리고 이 *Rowgroup* 들이 모으고 뒤에 footer 를 붙여 하나의 *Parquet File* 를 만든다.

#### 2.1.3. Metadata & Statistics

- 위에서 말한 것 처럼, *Parquet File* 의 맨 뒤에는 footer 가 붙고, 여기에는 metadata, statistics, 그리고 lightweight index 가 들어간다.
- 근데 이것은 좀 별로이다.
	- 이러한 정보들이 footer 에 들어가 있기 때문에 만약에 statistics 와 index 를 이용해 데이터를 지우고자 한다면, 무조건 파일을 끝까지 읽어 footer 를 찾아야 한다.
	- 하지만 가령 low latency 환경에서는 파일을 끝까지 읽는 것이 굉장한 부담이기 때문에, 파일을 읽기 전에 이런 statistics 와 index 에 접근할 수 있다면 더 좋다는 것.
	- 따라서 BtrBlock 에서는 이것을 해결하기 위해 compressed block 과 나머지 metadata 등을 분리했다고 한다.
		- 즉, 이 metadata 등의 정보들은 header, footer 어디든 붙일 수 있고 아니면 아예 별도로 관리할 수도 있게 했다.

#### 2.1.4. Additional general-purpose compression.

- 기존의 Parquet 가 사용하는 compression scheme 들은 너무 선택지가 적고, 이 선택지 중에 하나를 선택하는 방법 또한 너무나 단순하다.
	- 가령, Dictionary compression 을 하는 경우에는 압축 중에 dictionary 가 너무 커지면 그냥 데이터를 압축되지 않은 상태로 냅둔다고 한다.
- 따라서 순정의 Parquet 의 경우에는 compression ratio 가 너무나 작고, 따라서 일반적으로 Parquet file 을 general purpose compression scheme 으로 한번 더 압축한다.
	- 이 scheme 들에는 [Snappy](https://github.com/google/snappy), [Brotli](https://github.com/google/brotli), [Zstd](https://github.com/facebook/zstd), [Gzip](https://www.gnu.org/software/gzip/), [LZ4](https://github.com/lz4/lz4), [LZO](https://www.oberhumer.com/opensource/lzo/), [BZip2](https://sourceware.org/bzip2/) 가 있다.
- 하지만 이들은 모두 decompression overhead 가 너무 크거나 compression ratio 가 너무 적다고 한다.
	- 이것에 관해서는, overhead <-> ratio 간의 trade-off 양 극단에 위치한 Zstd 와 Snappy 를 BtrBlock 와 비교했다고 한다.

#### 2.1.5. A better way to compress.

- 저자들은 *Parquet File* 생성시에 이미 한 가지 방법으로 encoding 하였기에, 이것을 또 다시 다른 compression scheme 으로 압축하는 것은 decompression overhead 측면에서 비효율적인 것을 확인했다고 한다.
- 따라서, BtrBlock 에서는 이런 짓을 하지 않고, Parquet 에 선택할 수 있는 compression scheme 을 늘리고 (+ 심지어 하나는 더 개발해서 추가하고) 그들 중에 적절한 것을 선택할 수 있는 알고리즘과 compression scheme 을 연속해서 적용하는 방법에 대해 제시한다.

### 2.2. Compression Schemes Used In BtrBlocks

#### 2.2.1. Combining fast encodings.

- BtrBlock 은 위에서 설명한 대로 일련의 encoding scheme 들을 조합해 compression 을 진행한다.
- 이 encoding scheme 들은 모두 커버하는 자료형이 정해져 있다.
	- 즉, 어떤 알고리즘은 정수만 처리하고, 어떤 알고리즘은 문자열만 처리하는 등.
	- 각 encoding 과 궁합이 잘 맞는 Data distribution 이 각 encoding 마다 상이하기 때문에, 각 encoding 들은 서로에게 영향을 주지 않고 따라서 여러 encoding 을 연달아 적용하는 것이 가능하다.
	- 이것은 결과적으로 decompression speed 의 손해를 보지 않고 compression ratio 는 늘릴 수 있게 해준다.

> [!tip] *Data Distribution* 이란?
> - 잘 감이 안온다면, 값들이 연속적인지, 중복된 값들이 많이 있는지 등의 데이터 특성이라고 생각하자.

- 그리고 encoding 하는 단위는 column 을 고정된 크기로 나눈 block 이다.
	- 여기서 block 은 storage 에서의 block 과는 다른 단위이다; 기본적으로 64,000 entry 를 하나의 block 으로 묶어 처리한다고 한다.
	- 이렇게 block 단위로 encoding 하는 것에는 다음과 같은 장점이 있다:
		1) 각 block 의 data distribution 에 따라 다른 encoding 을 선택할 수 있게 해준다.
			- 즉, 하나의 큰 data 보다 그것을 잘게 쪼갠 단위에 대해서는 더 올바른 최적화가 가능하기 때문.
		2) 여러 block 을 한번에 처리할 수 있다 (parallel).

![[Pasted image 20240718194834.png]]

- 위 표는 BtrBlock 에서 사용하는 8개의 encoding scheme 을 나타낸 것이다. 이제 이것들에 대해 (자체 개발한 pseudodecimal 을 제외하고) 하나하나 살펴보자.

#### 2.2.2. RLE & One Value.

- *Run Length Encoding* (*RLE*) ([코드](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/templated/RLE.hpp)) 은 말 그대로 "연속된 개수" 로 encoding 하는 것이다.
	- 가령 `{42, 42, 42}` 의 경우에는 `(42, 3)` 으로 줄이는 방식이다.
	- 따라서 이 방식은 자료형에 상관 없이 universal 하게 사용할 수 있다.
- 그리고 *One Value* ([코드](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/string/OneValue.cpp)) 는 한 block 의 entry 들이 모두 동일한 값을 가지는 특수한 경우에만 사용할 수 있는 encoding [^one-value] 이다.

#### 2.2.3. Dictionary

- *Dictionary Encoding* 은 `[원본:대체]` 의 mapping 인 *Dictionary* (가령 C++ 문법으로 설명하자면, `std::map<원본, 대체>`) 을 가지고 해당 `원본` 값들을 `대체` 값으로 전부 대체하는 encoding 방법이다.
	- 당연히 `대체` 의 데이터 크기는 `원본` 보다 작도록 하기 때문에, 더 많이 대체할 수록 더 많이 압축된다.

> [!tip] 논문에서의 표현
> - 논문에서는 이 `[원본:대체]` 가 `[distinct:code]` 로 표현된다.

- 이때 저 `대체` 를 어떤 것으로 할지, *Dictionary* 로 어떤 자료구조를 쓸 지는 encoding 대상에 따라 다르다.
	- 만약 column data 가 고정 크기라면 (가령, `VARCHAR(255)` 등), 배열로서 Dictionary 를 구현한다.
		- 이때는 당연히 저 `대체` 는 배열의 index 가 될 것이다.
	- 만약 가변크기라면, offset 이 있는 문자열 풀 [^string-pool] 을 이용한다.

#### 2.2.4. Frequency

- *Frequency Encoding* 은 *Dictionary Encoding* 이랑 유사하지만, 어떤 값이 등장하는 빈도에 따라 추가적인 최적화가 들어간 것이다.
- 여기서의 `대체` 는 고정 크기의 값이 아니고, 빈도가 많은 값에 대해서는 적은 크기의 `대체` 로 대체하고, 반대로 빈도가 적은 값에 대해서는 큰 크기의 `대체` 로 대체한다.
- 가령 다음처럼 구현할 수 있다.
	- 가령 가장 빈번하게 등장하는 두 값의 경우에는, `대체` 를 1bit 로 구성할 수 있고, 따라서 해당 값들은 1bit 로 대체할 수 있다.
	- 그 다음으로 빈도가 높은 8개 (3등 ~ 10등) 까지는, `대체` 를 3bit 로 구성해 대체하고,
	- 나머지의 빈도는 그냥 Dictionary 처럼 배열 index (offset) 으로 배체하는 방식
- 이 방법은 처음에 [IBM DB2 BLU 논문](https://www.vldb.org/pvldb/vol6/p1080-barber.pdf) 에서 제시되었는데, BtrBlock 에서는 여기에 추가적으로 최적화를 했다고 한다:
	- 현실의 데이터를 분석해본 결과, 값의 빈도가 대략 지수적 (exponentially) 감소한다는 관찰에 따라서,
	- 빈도가 높은 몇개의 값과 비트맵 등을 저장한다고 한다 [^freq-end]

#### 2.2.5. FOR & Bit-packing

- *Frame of Reference* (*FOR*) 는 기준값을 바꾸는 것이다.
	- 이게 뭔이야기인고 하니, 일반 정수값은 따지고 보면 0과의 차이 이다.
	- 이때 이 기준값을 바꾼다면, 해당 값들을 더 작게 만들 수 있을 것이다.
- 그리고 값들이 더 작아지게 되면, *Bit-packing* 을 이용해 더 적은 bit 로 해당 값들을 표현할 수 있다.
	- 가령 `[105, 101, 113]` 를 기준값을 100 으로 FOR 를 하면, `[5, 1, 13]` 으로 표현될 수 있다.
	- 이때 *Bit-packing* 을 하게 되면 $8 * 3 = 24bit$ 로 표현되던 것이 각각 4bit 씩 $4 * 3 = 12bit$ 로 표현될 수 있다.
- 하지만 위 방식에서는 돌발상황이 생길 수 있다.
	- 만일 위 예시에서 118 이 튀어나온 다면, 18 은 4bit 으로는 표현하지 못하기 때문에 모든 값들을 5bit 으로 바꿔야 한다.
	- 이러한 문제를 막기 위해 저런 돌발상황에 대해서는 별도로 관리하여 bitbase 를 올리지 않아도 되게 할수 있다.
		- 이것을 *Patched FOR* (*PFOR*) 라고 부르고, 이 아이디어를 SIMD 에 적용한 알고리즘인 *SIMD- FastPFOR* 와 *SIMD-FastBP128* [^simd] 이 BtrBlock 에 적용됐다고 한다.
- 보다시피 이 encoding scheme 은 당연히 정수값에 대해서만 사용할 수 있다.

#### 2.2.6. FSST

![[Pasted image 20240724100253.png]]

> 출처: [FSST: fast random access string compression, PVLDB'20](https://dl.acm.org/doi/10.14778/3407790.3407851)

- *Fast Static Symbol Table* (*FSST*) 도 *Dictionary Encoding* 와 유사한 원리를 가진다:
	- String 의 8byte 길이의 (즉, 문자 8개) substring 을 1byte `대체` 로 바꾸는 것이다.
- 이때의 dictionary 는 *Symbol Table* 이라고 불리는데, 빈도가 높은 순서대로 $2^{8} = 256$ 개의 substring 을 entry 로 넣어 관리한다.
	- 그리고 이 *Symbol Table* 은 block 당 하나를 생성한다고 한다.
- 당연히 저 *Symbol Table* 을 구성하기 위해 빈도 높은 순서대로 정렬하고 막 해야 할 것이기 때문에, compression 과정은 다소 오래걸린다.
- 하지만, decompression 에 대해서는 그냥 치환만 하면 되기 때문에, 아주 빠르다.

#### 2.2.7. NULL Storage Using Roaring Bitmaps.

- *Roaring Bitmap* 은 bitmap 을 압축하기 위한 algorithm 이다.
	- 이놈을 요약하면 전체 bitmap 을 일정 크기의 chunk 로 자르고, 해당 chunk 에 1이 얼마나 있냐를 가지고 동적으로 해당 chunk 를 저장할 자료구조를 선택하는 방식으로 작동한다고 한다.
	- 오픈소스 Roaring Bitmap 라이브러리는 HW-aware optimization 이 들어가 있고 (가령 bit 를 세는 것은 x86 이나 ARM 에서 하나의 instruction 으로 제공해 준다고 한다), BtrBlock 에서는 이것을 활용한다고 한다.
- 따라서 block 의 `NULL` entry 를 bitmap 으로 표현한 뒤, 이것을 압축하는 형태인 것으로 보인다 [^roaring-bitmap].
	- `NULL` 말고도 다른 [[#2.2.4. Frequency|Frequency Encoding]] 에서의 예외사항 들에 대해서도 이 방식으로 추적한다고 한다.

#### 2.2.8. Cascading Compression

- *Cascading Compression* 은 [[#2.2.5. FOR & Bit-packing|FOR & Bit-packing]] 에서 처럼 하나의 compression output 을 다른 compression 의 input 으로 넣는 것을 의미한다.
- [이 논문](https://dl.acm.org/doi/abs/10.1145/3323991) 에서는 여러 compression algorithm 들을 분류하고, 이들을 어떻게 cascading 할 수 있을지에 대해 제시했다.
	- 여기서는 algorithm 들을 logical, physical 두가지 분류로 나누고,
	- Gray-box cost model 이라는 것을 통해 정수값 compression 을 위한 algorithm 선택법을 제시했다.
- 하지만 위 논문에서 제시한 것은 정수값에 대한, 최대 2가지 algorithm 을 조합하는 방법이기에, 저자들은 n 가지 algorithm 을 조합하며 type 또한 정수에 한정되지 않는 방법을 개발했다고 한다.
	- 또한 이 개발한 방법은 cost model 을 사용하지 않고, sampling-based 이기에 더 확장성이 좋다고 한다. 자세한 것은 더 읽어보자.

## 3. Scheme Selection & Compression

#### 3.0. *Overview*

> [!tip] [[#3.0. *Overview*|Section 3.0]] Overview
> - ... 는 논문에는 없는 section 이고, 형식상 주인장이 끼워 넣은 것이다.

#### 3.0.1 Scheme selection algorithms.

- Data 에 맞는 compression scheme 을 고르는 알고리즘은 당연히 중요하다.
	- 각 compression scheme 은 대상으로 하는 자료형도 다르고, 어떤 data distribution 에 대해 효율적인지 등의 특성이 다르기 때문.
- 하지만 지금까지의 data format 들은 다소 정확하지 않은 방법으로 알고리즘을 선택해 왔다.
	- 가령 맨날 비교만 당하는 Parquet 의 경우에는, 문자열의 경우에는 무조건 [[#2.2.3. Dictionary|Dictionary]] 을 사용하고 정수의 경우에는 무조건 [[#2.2.5. FOR & Bit-packing|Bit-packing]] 을 사용하는 등의 단순하고 static 한 방식을 사용했다.
		- 하지만 예상하듯이 이러한 방식은 데이터를 최대로 압축하지 못한다.
	- 다른 방식은 통계를 이용하는 것이다. 가령 [Data Block 형식](https://dl.acm.org/doi/10.1145/2882903.2882925) 의 경우에는 $min()$, $max()$, $unique()$ 정도의 통계 연산으로 세 알고리즘 ([[#2.2.5. FOR & Bit-packing|FOR]], [[#2.2.3. Dictionary|Dictionary]], [[#2.2.2. RLE & One Value.|Single Value]]) 중 하나를 선택했다.
- 하지만 더 복잡한 encoding 방식까지 사용하기 위해서는, 더 범용적인 선택 알고리즘이 필요할 것이고, 이렇게 해야만 데이터를 더 꽉꽉 눌러담을 수 있을 것이다.

#### 3.0.2. Challenges

- 따라서 저자들은 올바른 scheme 을 선택하기 위한 방법으로 데이터에서 sample 을 추출하는 방식 (*Sampling*) 을 채택했다.
- 하지만 이 sample 을 추출하는 것은 생각보다 쉽지 않다; Compression scheme 과 관련된 데이터의 특성이 잘 드러나도록 sample 을 추출해야 하기 때문.
	- 가령 random 하게 값들을 추출하는 경우에는 연속된 값들이 추출되지 않아, [[#2.2.2. RLE & One Value.|RLE]] 를 사용할 수 있는지 없는지가 샘플을 통해서는 알 수 없다.
	- 또는 첫 $K$ 개의 값들을 샘플로 고르는 방식 또한 아주 편향된 샘플일 수 있기에 올바르지 않다.
- Scheme selection algorithm 을 개발하는 데에는 이 샘플 추출의 어려움 외에도 어떻게 Cascading 이 가능하게 할까 또한 난관이었다고 한다. 이것에 대해선 [[#3.2. Cascading|Section 3.2]] 에서 살펴보자.

#### 3.0.3. Solution Overview

- 기본적인 BtrBlock 의 sample-based selection 의 아이디어는 block 에 대해 sample 을 추출해 그것을 compression 하여 compression scheme 선택을 위한 힌트를 얻는 것이다.
- 다음과 같은 5단계를 반복적으로 수행하며 compression 을 진행한다고 한다.
	1) Block 에 대한 statistics 를 계산한다.
	2) 이 statistics 를 이용해, 몇가지 compression scheme 들을 걸러낸다.
	3) Sample 을 추출하고, 이 sample 에 대해 남은 compression scheme 을 적용해 compression ratio 을 확인한다.
	4) Sample 에 대해 compression ratio 가 가장 높은 놈을 이용해, 전체 block 에 대해 압축을 진행한다.
	5) 만일 압축의 결과가 cascading 이 가능하다면, (1) 으로 되돌아가 반복한다.

### 3.1. Estimating Compression Ratio with Samples

#### 3.1.1. Choosing samples.

- 샘플을 추출하는 데에는 *Spatial locality* 와 "Unique 한 값들이 얼마나 포진해 있는지" 간에 trade-off 가 있다.
	- 즉, block 의 연속된 일부 구간을 추출한다면 이 "연속된 데이터의 특성" 을 더 잘 반영하는 반면, block 내에 흩뿌려져 있는 unique 한 값들은 추출될 가능성이 낮아진다.

> [!tip] *Spatial Locality* 란?
> - 논문에서 등장하는 *Spatial Locality* 는 cache replacement algorithm 에서의 그것과는 사뭇 다른 말이다.
> - 여기서의 *Spatial Locality* 는 "연속된 데이터로 부터 알아낼 수 있는 특성" 정도로 이해하면 된다.
> - 가령 위의 [[#2.2.2. RLE & One Value.|RLE]] 의 경우에는 어떤 값이 얼마나 연속적으로 등장하냐를 이용한 것이기 때문에, RLE 를 사용할 수 있는지 판단하기 위해서는 이 *Spatial Locality* 를 확인해야만 하는 것이다.

- 또한 그렇다고 샘플의 크기를 늘려버리게 되면, 샘플을 compression 하는 것에만 overhead 가 너무 커질 수도 있다.
- 따라서 BtrBlock 에서는 샘플의 크기를 작게 유지하면서 trade-off 를 절충하기 위해, "연속된 공간을 무작위로 추출하기" 의 방법을 사용한다.
- BtrBlock 에서 샘플을 추출하는 구체적인 방법은 다음과 같다:

![[Pasted image 20240719175037.png]]

- 일단 전체 block 을 몇개의 *Partition* 으로 나눈 후, 각 *Partition* 의 random offset 부터 일정 개수의 연속된 값들을 추출하고 합치는 식으로 샘플을 만든다.
	- 기본적으로는 6400 개의 entry 를 하나의 *Partition* 으로 묶어 총 10개의 *Partition* 을 만든다. (하나의 block 에는 64,000 개의 entry 가 들어가기 때문)
	- 그리고 각 *Partition* 에서는 64개의 연속된 entry 를 랜덤한 위치에서 추출한다.
	- 이렇게 해서 block 사이즈 대비 1/100 사이즈의 샘플이 완성된다.
- 이 방식이 진짜 좋을까? 이것에 관해서는 뒤의 evaluation 파트에서 설명될 것이다.

#### 3.1.2. Estimating compression ratio.

- 위에서 말한 것 처럼, 샘플을 추출하기 전에 우선 몇가지 통계를 내어 compression scheme 을 몇개 걸러낸다.
- 일단 여기서 구하는 통계는 대략 다음의 네가지 이다:
	1) 최소값
	2) 최대값
	3) Unique value 의 개수
	4) 평균 run length - 즉, 하나의 값이 연속적으로 등장하는 횟수의 평균
- 이 통계를 이용해 compression scheme 을 거르는 것은 그냥 heuristic 을 사용한다.
	- 가령, "평균 run length" 가 2 보다 작으면 [[#2.2.2. RLE & One Value.|RLE]] 는 후보에서 제외되고,
	- "Unique value 의 개수" 가 전체의 50% 을 넘으면 [[#2.2.4. Frequency|Frequency Encoding]] 이 제외된다.

#### 3.1.3. Performance.

- 이 방식이 효율적이려면 다음의 두 가지를 실제로 보여야 한다:
	1) 우선 이 방법이 lightweight 해야 한다.
	2) 또한 이 방법이 accurate 해야 한다 - 즉, 이 방법으로 예측한 compression scheme 이 실제로 다른 compression scheme 을 이용했을 때 보다 compression ratio 가 높아야 한다.
- Evaluation 결과, 전체 compression 과정 중 이 selection 과정은 1.2% 만의 비중을 차지했고, accuracy 도 높았다고 한다. 더 자세한 것은 뒤에서 확인하자.

### 3.2. Cascading

#### 3.2.1. Recursive application of schemes.

- 한 scheme 을 적용하고 난 뒤에 어떤 scheme 을 적용할 수 있는가에 대한 decision tree 는 다음과 같다:

![[Pasted image 20240719181405.png]]

- 우선, 색깔이 중허다.
	- "녹색" 은 recursion step 을 뜻한다. 즉, output 으로 나온 leaf node 과 같은 자료형의 input (root node) 로 recursive 하게 처리될 수 있다는 것.
	- "파란색" 은 compression scheme 을 뜻한다. 이 scheme 을 고르는 것은 위에서 설명한 [[#3.1. Estimating Compression Ratio with Samples|scheme selection]] 을 이용한다.
	- "회색" 은 recursion end 를 뜻한다. 이 node 에 대해서는 더 이상 recursion 이 불가능하다는 것.
- 그럼 recursion 진사 갈비를 무한으로 즐길 수 있느냐; 그렇지는 않다.
	- 최대 몇번까지 recursion 할지는 static configuration 으로 설정하게끔 되어 있고, 그 이후의 recursion 은 이루어지지 않는다.
	- 왜냐면 recursion 을 계속 하면 물론 ratio 는 높아지겠지만 compression 이 너무 오래걸리기 때문.
	- 기본값으로는 3번만 recursion 하도록 설정되어 있다.
- 각 recursion 을 거치면서 적용 순서 또한 저장을 해 decompression 에 사용될 수 있게끔 한다.

#### 3.2.2. Cascading compression example.

- [여기,](https://www.youtube.com/@%EC%96%B4%ED%8D%BC%EC%BB%B7) 뭉게질 위기에 처한 실수 (double) 값이 있습니다.

```
[3.5, 3.5, 18, 18, 3.5, 3.5]
```

- 이때 scheme selection 에 의해 [[#2.2.2. RLE & One Value.|RLE]] 가 선택되었다고 가정해 보자.
- 그럼 다음과 같이 결과가 나올 것이다.
	- 첫번째 배열은 run value 이고, 두번째 배열은 run count 이다.

```
[3.5, 18, 3.5]
[2, 2, 2]
```

- 여기에 대해서는 또 scheme selection 를 돌려 value 에 대해서는 [[#2.2.3. Dictionary|Dictionary]] 가 선택되고, count 에 대해서는 [[#2.2.2. RLE & One Value.|One Value]] 가 선택되었다고 해보자.
- 그럼 다음처럼 된다.
	- 첫번째는 dictionary index, 두번째는 dictionary, 세번째는 one value 이다.

```
[0, 1, 0]
[3.5, 18]
2
```

- 마지막 recursion 에서는 첫번째 배열에 [[#2.2.5. FOR & Bit-packing|FOR & Bit-packing]] 을 도입해서 첫번째 배열을 1bit 으로 표현하는 등의 작업을 거칠 수 있을 것이다.

#### 3.2.3. Code example.

![[Pasted image 20240720153412.png]]

- 위의 pseudocode 는 [[#2.2.2. RLE & One Value.|RLE]] 를 cascading 하는 예시이다.
- `compress()` 부터 따라가 보자.
	- 일단 `res` 는 결과를 저장하는 객체의 포인터이고, `value` 와 `count` 는 RLE 의 결과물이 저장되는 배열이다.
		- 여기서 `value`, `count` 는 알아서 적당히 RLE 로직을 통해 계산된다고 가정한다.
	- 그 다음에는 `value` 와 `count` 각각에 대해 `pickScheme()` 으로 scheme 을 정해서, 그것으로 전체 데이터를 재귀적으로 compress 하는것으로 마무리 된다.
- 이때, `pickScheme` 은 다음처럼 작동한다:
	- `pool` 은 가능한 전체 scheme 들이 담겨있는 곳이고, 여기를 iterate 하며 각각의 scheme 에 대해 `estimateRatio()` 로 compression ratio 를 계산한다.
	- 그리고 ratio 가 가장 큰 scheme 을 반환하게 된다.
- 마지막으로, 이 `estimateRatio()` 는 다음과 같다:
	- 일단 인자로 받은 `stat` 으로 해당 scheme 을 사용할 수 있는지 확인한다.
		- 위 코드에서는 RLE 이기 때문에 average run length 가 2 이상인지 확인하는 heuristic 으로 검사한다.
	- 위 확인작업이 끝나면, sample 에 대해 compression 하여 compression ratio 를 계산해 반환한다.

#### 3.2.4. The encoding scheme pool.

- [[#3.2.1. Recursive application of schemes.|Section 3.2.1]] 에 소개한 scheme pool 은 public BI dataset 을 이용해 선택되었다고 한다.
- 다음의 과정을 거쳐서 선택되었다:
	1) BI dataset 에서 compression ratio 가 (Bzip2 와 같은) 무거운 scheme [^heavyweight-scheme] 에 비해 더 안좋은 column 을 찾는다.
	2) 해당 column 의 데이터들의 특성을 분석한다.
	3) 해당 특성과 잘 맞는 compression scheme 을 도입하고
	4) Compression ratio 가 높지 않거나 decompression overhead 가 큰 scheme 은 제외한다.
- 위와 같은 과정을 통해 multi-level cascading 이 가능하고 확장성이 좋은 scheme pool 을 만들수 있었다고 한다.
- 이 pool 에 들어갈 scheme 을 고르는 것은 BtrBlock 성능 전체에 영향을 미치기에, 아주 중요하다.
	- 가령 scheme 을 pool 에 너무 많이 추가하면 sample evaluation 에 너무나 많은 시간이 소요되지만 compression ratio 는 늘어나는 장단점이 있고,
	- Compression ratio 가 높지만 decompression overhead 가 큰 scheme 의 경우에도 마찬가지의 장단점이 있기 때문.

## 4. Pseudodecimal Encoding

### 4.0. *Overview*

> [!tip] [[#4.0. *Overview*|Section 4.0]] Overview
> - ... 는 논문에는 없는 section 이고, 형식상 주인장이 끼워 넣은 것이다.

#### 4.0.1. Floating-point numbers in relational data.

- 기존까지는 floating-point number 에 대한 encoding 방법이 몇개 없었다고 하는데, 이것은 다음과 같은 이유에서였다.
	- 기존의 RDBMS 에서는 floating-point 를 별로 사용하지 않고, 정수의 형태인 `DECIMAL` 이나 `NUMBER` 을 사용했기 때문.
- 하지만 이 기조는 Data Lake 으로 넘어오며 많이 바뀌게 된다.
	- RDBMS 뿐 아니라 NoSQL 에서는 이런 floating-point number 를 많이 사용하고,
	- 그리고 AI-ML 에서도 이런 값들을 많이 사용하는데
	- 이 값들이 Data Lake 에 흘러들어오기 때문이다.
	- 가령 [여기에](https://dl.acm.org/doi/10.1145/3209950.3209952) 따르면, [Tableau](https://www.tableau.com/) 에서 내부적으로 사용하는 분석시스템의 경우에도, 모든 "숫자" 들을 floating-point 로 저장한다고 한다.

#### 4.0.2. Pseudodecimal Encoding.

- [[#3.2.1. Recursive application of schemes.|Section 3]] 에 나온 compression scheme 들 중 일부는 floating-point number 를 encoding 하는 것이 가능했지만,
- [[#2.2.5. FOR & Bit-packing|Bit-packing]] 이나 [[#2.2.6. FSST|FSST]] 을 적용하는 것은 효율적이지 못했고, 따라서 새로운 *Pseudodecimal Encoding* 을 고안하게 됐다고 한다.

### 4.1. Compressing Floating-Point Numbers

#### 4.1.1. Challenges.

- 우선 public BI dataset 을 분석하여 나온 결론은 다음과 같다:
	- 많은 경우 float (fixed-precision floating point) 로 충분한 데이터들이 double (double-precision floating point) 로 표현되고 있다는 것이다.
		- 가령 금액을 나타내는 경우 (예를 들어 $0.99) 에는 float 로도 충분하다.
- 보기에는 이러한 값들이 compression 이 간단할 것 같지만, 여기에는 두 가지 문제가 있다.
	1) 우선 [IEEE-754](https://ieeexplore.ieee.org/document/8766229) 표준 (1bit sign + 11bit exponent + 52bit mantissa) 을 따르는 값들이 [[#2.2.5. FOR & Bit-packing|FOR + Bit-packing]] 으로 encoding 되기 어렵다는 것이다.
		- 왜냐면 수치상으로는 근접한 두 값이라 할 지라도 bit 로 표현되는 수치는 매우 차이가 크기 때문이다.
		- 가령 `0.99` 는 `00111111011111010111000010100100` 인 반면, `3.25` 는 `01000000010100000000000000000000` 이다.
	2) 두번째는 binary encoding 의 문제다.
		- 어떤 double 값은 이진수로 딱 떨어지지 않고, 따라서 그의 근사치로 저장되는데 이때의 Mantissa 값이 아주 흉악스럽기 때문이다.
		- 동일한 값이 여러개 있거나 아니면 범위 내의 비슷한 애들이 많아야 encoding scheme 을 적용하기가 용이한데, 저런 흉악범이 포함돼 있으면 적용하기가 쉽지 않은 것.
- 두번째 문제를 좀 더 자세히 살펴보자. 가령, `0.99` 는 IEEE-754 로 변환하면 다음처럼 바뀐다.

```
0011111111101111101011100001010001111010111000010100011110101110
```

- 이것을 다시 double 로 바꿔보자. 각각의 field 들로 쪼개면 이렇게 된다.

```
SIGN: 0
EXPN: 01111111110
MANT: 1111101011100001010001111010111000010100011110101110
```

- 그리고 여기에서 실질적인 값을 꺼내보면 다음과 같다.
	- Exponent - Bias = $01111111110_{2} - 1023_{10}$ = $1022_{10} - 1023_{10}$ = $-1$
	- Mantissa = $1_{2} + 0.1111101011100001010001111010111000010100011110101110_{2}$ = $1.97999999999999998224_{10}$
- 즉, $1.97999999999999998224 * 2^{-1}$ = $0.98999999999999999112$ 라는 요사스러운 값이 나오게 된다.
- $0.99$ 대신 저런 조악스러운 것이 저장되기 때문에, encoding 이 쉽지 않은 것.

#### 4.1.2. Floating-point numbers as integer tuples.

- *Pseudodecimal* 이라는 말에서 알 수 있듯이, 이 encoding 은 double 을 두개의 decimal (*Significant with sign* 와 *Exponent*) 로 쪼개게 된다.
	- *Significant with sign* 은 *Mantissa* 와 비슷한 역할이다: "정수로 표현되는 가수" 정도로 말할 수 있다.
	- 즉, `3.25` 는 `[325, 2]` 로 표현된다.
- 그럼 이때 precision 문제는 어떻게 해결할까?
	- `0.99` 의 실제 bitwise, 가령 `0.9899...` 을 가지고 `[9898..., 17]` 로 저장할 수도 있지만
	- 그냥 `[99, 2]` 로 저장해도 충분하다.
		- 왜냐면 어차피 decompression 시에 이것은 다시 `0.99` 가 되어 bitwise 로는 `0.9899...` 가 될것이기 때문.
- 이를 위해, compressing 과정에서는 다음의 두 작업을 한다고 할 수 있다. ([[#4.1.2. Encoding Algorithm.|다음 Section]] 에서 볼 수 있듯이, 이 두개를 순서대로 하는 것은 아니다.)
	1) IEEE-754 floating point 를 두 decimal 로 나누기
	2) *Compact decimal representation* 생성하기

> [!tip] *Compact decimal representation* 란?
> - 여기서 *Compact decimal representation* 는 위에서 말한 "binary representation 에 의한 오차를 decimal representation 으로 없애기" 정도로 이해하면 된다.

#### 4.1.2. Encoding Algorithm.

![[Pasted image 20240722201253.png]]

- 그래서, *Pseudodecimal Encoding* 의 전체적인 pseudo-code 는 위와 같다.
- 일단 큰 흐름은 다음과 같다.
	1) `digit` 변수: `input` 값에다 $10^{exp}$ 를 곱한 뒤, 소수점을 날린다.
		- 여기서 $10^{exp}$ 를 곱하고 나누고 하는 것은 전부 pre-calculated array `frac10[]` 를 이용한다. 그냥 매번 계산하는 것을 막고자 요래 했다고 하네.
	2) `orig` 변수: `digit` 변수를 다시 $10^{exp}$ 으로 나눈다.
	3) `input` 변수와 `orig` 변수를 비교한다.
		1. 이때, 만약 두 변수의 값이 다르다면 (1) 과정에서 날라간 소수점이 있다는 소리이다. 즉, 아직 *Mantissa* 가 완벽히 정수 *Significant* 로 변환되지 않았다는 소리이기 때문에, $exp$ 을 증가시켜서 다시 (1) 로 돌아간다.
			- 말로만 설명하니까 좀 그런데, 예를 들어 `3.25` 에서 `exp = 1` 이면 `orig = 3.2` 일 것이므로 일치하지 않는다. 이것은 `0.05` 가 날라갔기 때문이고, 예상하는 결과는 `[32, 1]` 이 아니라 `[325, 2]` 이기 때문에 `exp` 을 1 증가시켜 다시 시도하는 것.
		2. 만약 두 변수의 값이 같다면, `input` 이 완벽하게 `digit * 10^exp` 로 표현된 것이기에 `[digit, exp]` 를 반환한다.
		3. 만약 두 변수가 $exp = 23$ 가 될 때까지 같아지지 않는다면, $±inf$ 혹은 $±NaN$ 로 판단해 exception 으로 처리한다.
- 여기서 decimal tuple 로 변환되지 않는 것은 *Exception* 으로 처리한다.
	- $±inf$ 혹은 $±NaN$ 는 당연히 decimal tuple 로 변환되지 않을 것이므로 이놈들이 *Exception* 가 되고
	- *Sign* 이 `digit` 에 들어가기 때문에 [^sign-digit] $-0$ 에 대해서도 *Exception* 으로 처리한다고 한다.
- *Exception* 처리는 그냥 단순하다. $exp = 23$ 로 해놓고, 그냥 input double 그대로 세번째 field 에 처박아놓으면 된다.
- 따라서 결과적으로 *Pseudodecimal Encoding* 을 거치게 되면 decimal column 두개, double column (*Patch* column) 하나가 나오게 된다.
	- 이때 *Significant* column 의 경우에는 32bit,
	- *Exponent* column 의 경우에는 5bit 을 사용한다고 한다.

### 4.2. Pseudodecimal Encoding in BtrBlocks

#### 4.2.1. Cascading to integer encoding schemes.

- 위에서 말한 것처럼, 결과적으로 *Significant*, *Exponent* decimal column 두개와 하나의 *Patch* double column 이 나오게 된다.
- 그리고 이것들이 cascading 되어 새로 encoding 되게 되는 것.
- 가령, 다음의 예시 (여기서 선택된 cascading encoding scheme 또한 당연히 예시이다) 처럼 된다는 것.

![[Pasted image 20240722211346.png]]

> [!tip] 위 그림에 대한 첨언
> - 여기서 Input 은 세로방향이고, 그 옆의 Significant, Exponent, Patch 는 가로방향이다.
> - 즉, `0.989` 가 Significant 의 첫 원소 (`99`), Exponent 의 첫 원소 (`2`) 로 변환되는 것.

#### 4.2.2. When to choose Pseudodecimal Encoding.

- [[#3.1.2. Estimating compression ratio.|Section 3.1.2]] 에서 heuristic 으로 compression scheme 을 걸러낸다고 했는데, 그럼 *Pseudodecimal Encoding* 의 경우에는 언제 걸러질까?
	1) 첫번째는 *Exception* 이 너무나 많을 때이다.
		- 이 경우에 *Pseudodecimal Encoding* 을 사용하면 compression ratio 는 살짝 증가하긴 하지만, *Exception* 처리가 너무 빈번해져 decompression overhead 가 너무 커지게 된다.
		- 따라서 *Exception* 이 50% 이 넘어가게 되면, 이놈이 제외된다.
	2) 두번째는 unique value 가 너무 적을 때이다. 이때에는 [[#2.2.3. Dictionary|Dictionary]] 를 사용하는 것이 훨씬 더 decompression overhead 가 적기 때문에, unique value 가 10% 이하로 떨어지면 이놈이 제외된다.

## 5. Fast Decompression

### 5.0. *Overview*

> [!tip] [[#5.0. *Overview*|Section 5.0]] Overview
> - 마찬가지로 논문에는 없는 section 이고, 형식상 주인장이 끼워 넣은 것이다.

#### 5.0.1 Decompression speed is vital.

- Decompression speed 는 중요하다. 근데 왜?
- Cloud 에서 compute node 는 드럽게 비싸고 이놈의 사용시간을 줄이는 것이 비용최적화에 핵심이 된다.
- 이 드럽게 비싼 compute node 의 사용시간을 줄이는 것은 compression 의 관점에서 보자면 (1) compression ratio 를 늘려 Data Lake 에서 받아오는 속도를 빠르게 하는 것과 (2) 받아온 것을 빠르게 decompression 하는 것일 것이다.
	- 근데 왜 decompression 만 생각할까? 그것은 OLAP 의 관점에서 봤을 때 decompression 만 하기 때문이다.
	- Compression 작업은 뭐 OLTP 가 할 수도 있고 다른 누군가가 할 수도 있다. 어차피 Data Lake 이기 때문에 누군가가 compression 해서 여기에 투척하기만 하면 된다.
	- 중요한 것은 이 데이터를 사용하려고 할 때는 OLAP 이 직접 decompression 해야 한다는 것이다.
- 어쨋든 (1) 는 위에서 충분히 설명 했고, 본 section 에서는 (2) 에 집중하려고 한다.

#### 5.0.2. Improving decompression speed.

- [[#2.2.1. Combining fast encodings.|Section 2.2.1]] 의 표를 참고하면, SIMD-FastPFOR, SIMD-FastBP128, FSST, Roaring 은 이미 공개된, 최적화된 구현체를 사용했다고 한다.
- 따라서 여기서는 나머지 scheme 들 (RLE, One-value, Dictionary, Frequency, Pseudodecimal) 에 대한 fast implementation 에 대해 이야기 해보려고 한다.
- 최적화를 위한 evaluation 은 다음의 고려사항이 있다고 한다.
	- Dataset 은 (저자가 진짜 질리도록 강조하는 것 같은데) public BI dataset 을 사용했다고 한다.
	- Evaluation 은 *End-to-end* 방식으로 진행됐다고 한다.
		- 즉, 어떤 scheme `B` 를 최적화 하는 과정에서 만약 `A-B-C` 의 순서로 cascading 이 진행됐다면, `B` 하나만의 시간을 측정한 것이 아니라 `A-B-C` 전체 시간을 측정해서 어느정도 개선되었는지를 비교했다고 한다.
		- 더 쉽게 말하면 `A-B-C` 와 `A-B'-C` 간에 총 시간을 비교해서 개선율을 계산했다는 것.
		- BtrBlock 에서 모든 scheme 들이 cascading 될 수 있기 때문에, 개선한 scheme 이 cascading 되는 상황에서의 개선율을 계산한 것으로 보인다.

#### 5.0.3. Run Length Encoding.

- [[#2.2.2. RLE & One Value.|RLE]] 을 decompression 하는 것은 단순하게 생각하면 그냥 어떤 값을 해당 횟수 반복하기만 하면 될 것이다.
- 근데 당연히 이것은 최적화가 *들* 된것이다. 요즘은 21세기라, SIMD 라는 더 좋은 방법이 있기 때문.
	- 간단히 말하면, SIMD 는 여러 데이터를 하나의 instruction 에서 처리하는 기술이다.
	- 즉, 여기서는 하나의 instruction 으로 여러 값을 set 해버리기 위해 사용한 것.
- BtrBlock 에서는 AVX2 instruction 을 사용하여, decimal 의 경우에는 한번에 8개, floating-point 의 경우에는 한번에 4개를 처리한다.
	- AVX2 의 경우에는 256bit 의 레지스터를 사용한다.
	- 따라서 32bit decimal 의 경우에는 한번에 8개를 처리할 수 있고,
	- 64bit double 의 경우에는 한번에 4개를 처리할 수 있는 것.
- 하지만 문제는 block 내 데이터들이 항상 8개 혹은 4개로 딱 떨어지지는 않는다는 것.
	- 딱 떨어지지 않는 짜투리 부분에 대해서는 별도로 처리할 수 있겠지만, 그렇게 하면 당연히 값비싼 branch instruction 을 사용해야 한다.
	- 따라서 overflow 로 이것을 해결한다. 즉, 만약 decimal 값을 29번 반복하는 경우에는, SIMD 로 8개씩 4번을 반복해서 32 개를 만들고, 크기가 29 인 버퍼에 넣어서 overflow 를 이용해 뒤를 자르는 것이다.

![[Pasted image 20240723112702.png]]

> [!info] 원본 코드: [BtrBlocks](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/templated/RLE.hpp#L165-L184)

> [!info]- SIMD 함수 [Reference](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#techs=AVX_ALL)
> - `_mm256_set1_epi32`
> 
> ![[Pasted image 20240723145325.png]]
> 
> - `_mm256_storeu_si256`
> 
> ![[Pasted image 20240723145348.png]]

- 위 그림이 decimal RLE 에 대한 pseudo code 이다. 찬찬히 읽어보자.
	- 우선 parameter 는 다음과 같다.
		- 일단 `dst` 는 현재 처리중인 주소이다. 이놈을 iterator 처럼 쭉 이동시키며 값을 써넣는다.
		- `runlen` 과 `value` 는 RLE 의 run length 와 value 가 담긴 배열이다.
			- 즉, `value[i]` 에는 $i$ 번째 value 가, `runlen[i]` 에는 해당 value 에 대한 run length 가 담겨있는 것.
		- `runcnt` 는 위 두 배열의 크기이다.
	- 그리고 여기서 loop 을 돌며 처리하는데,
		- `target` 은 끝 주소이다.
			- C++ STL 에서 `.end()` 함수와 비슷한 역할을 한다고 생각하면 된다.
			- 시작주소인 `dst` 에 run length 를 더해 끝 주소를 지정해 놓는 것.
		- 그리고 `vals` 에다가 값들을 전부 채워넣고,
		- 다음 loop 에서 `vals` 를 복사하며 `dst` 에 8개씩 값을 채워넣는다.
			- 이 loop 은 `dst` 를 8씩 움직이고, `dst` 가 `target` 을 넘어가면 멈추게 된다.
				- 여기서 당연히 `dst` 는 `target` 을 넘어갈 수 있다. 위에서 말한 것처럼, run length 는 8의 배수가 아닐 수도 있기 때문.
		- 그리고 마지막으로 `dst` 를 `target` 으로 세팅한다.
			- 이부분이 위에서 말한 overflow 부분이다. `dst` 를 `target` 으로 설정함으로써, 넘어간 부분에 대해서는 다음 iteration 에서 overwrite 될 수 있게 한다.
- 위와 같은 SIMD 를 활용한 RLE 는 꽤나 성능이 좋았다고 한다.
	- 일단 *End-to-end* evaluation 을 했을 때, 평균적으로 76% 성능 향상이 있었고,
	- Decimal 의 경우에는 128% (!!) 성능 향상이 있었다.
		- 이것은 [[#3. Scheme Selection & Compression|Section 3]] 에서 설명한 scheme selection algorithm 에 의해 RLE 가 선택된 것이기 때문에,
		- 반대로 생각하면 해당 block 은 RLE 를 적용하기 아주 좋은 형태인 것이고 따라서 이러한 극적인 성능 향상이 가능했던 것이다.
	- String dictionary 의 경우에도 code sequence (즉, 이놈은 dictionary 를 통해 string sequence 에서 decimal sequence 로 바뀐 것이다.) 에 RLE 를 cascading 했을 때, 78% 의 성능 향상이 있었다.
	- 마지막으로, double 의 경우에는 14% 정도의 성능 향상이 있었다고 한다.

#### 5.0.4. Dictionaries for fixed-size data.

- 이것은 decimal 이나 double 와 같은 fix-size data type 을 가지는 block 을 dictionary 로 encoding 했을 때 decompression 하는 것이다.
- 일반적인 dictionary 는 그냥 code sequence 를 쭉 훑으며 각 code 를 원래의 value 로 교체하는 것이다.
- 근데 [[#5.0.3. Run Length Encoding.|위의 RLE]] 에서와 마찬가지로, SIMD 를 사용하여 이것을 가속할 수 있다.
	- 즉, 한번에 하나의 code 를 교체하는 것이 아니고, 8개의 code 를 교체하는 것.

![[Pasted image 20240723142738.png]]

- 그래서 위와 같은 pseudo code 가 되는데,, 저기 variable naming 이 좀 그지가치 돼있으니까 이걸 좀 고쳐 써보면 이래된다.

```cpp
void decodeDictAVX (int *dst, const int *codes, const int *values, int cnt)
	int idx = 0 // not shown: 4x loop unroll
	if (cnt >= 8)
		while (idx < cnt-7)
			__m256i codes_m = _mm256_loadu_si256(codes)
			__m256i values_m = _mm256_i32gather_epi32(values, codes_m, 4)
			_mm256_storeu_si256(dst, values_m)
			dst += 8; codes += 8; idx += 8
	for (;idx < cnt; idx++)
		*dst++ = values[*codes++]
```

> [!info] 원본 코드: [BtrBlocks](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/templated/DynamicDictionary.hpp#L127-L153)

> [!info]- SIMD 함수 [Reference](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#techs=AVX_ALL)
> - `_mm256_loadu_si256`
> 
> ![[Pasted image 20240723145037.png]]
> 
> - `_mm256_i32gather_epi32`
> 
> ![[Pasted image 20240723145153.png]]

- 찬찬히 읽어보자.
	- 인자를 먼저 보자.
		- `dst`: 결과를 저장하는 위치를 나타내는 포인터다. 즉, Iterator 로, 이놈이 움직이며 값이 써내려져 간다.
		- `codes`: 얘는 code sequence 이다. 이놈도 Iterator 로, `dst` 와 같이 움직이며 처리된다.
		- `values`: 얘가 dictionary 이다.
		- `cnt`: 얘는 code sequence entry 개수를 의미한다.
	- 일단 [[#5.0.3. Run Length Encoding.|이전]] 과는 다르게, 이번에는 overflow 를 사용하지 않고 그냥 짜투리 부분은 별도의 loop 으로 SIMD 를 사용하지 않고 처리한다. (맨 아래 `for` 문)
	- 이제 SIMD 를 사용하는 부분을 보면, 일단 decimal dictionary 이기 때문에 한번에 8개씩 처리하고 있는 모습을 볼 수 있다.
	- 그리고 한번 처리할 때:
		- `_mm256_loadu_si256` 로 code sequence 에서 8개의 code 를 읽어오고,
		- `_mm256_i32gather_epi32` 로 읽어온 8개의 code 에 대해 dictionary 에서 찾아 변환한다.
		- 마지막으로 `_mm256_storeu_si256` 로 변환한 것을 `dst` 에 심는 것으로 마무리된다.
- 원본 코드를 보면 알겠지만, 실제로는 위 코드가 4번 반복된다 (`4x loop unroll`).
	- 가령 `code_0` ~ `code_3` 4개를 선언하는 등.
- 위와 같은 방법으로 cascading 에 decimal dictionary 가 포함된 경우에 대해 18%, 그리고 double dictionary 가 포함된 경우에 대해서는 8% 의 성능 향상이 있었다고 한다 [^fixed-size-dict].

#### 5.0.5. String Dictionaries

- String dictionary 의 경우에는 decompression 시에 string 값을 복사하는 것을 피했다고 한다.
- 어떤 code 를 대응하는 string 으로 바꾼 것이 아니고, 그 string 의 길이 (`std::string::size()`) 와 그 스트링의 dictionary 내에서의 *Offset* (즉, 포인터) 두 값으로 바꾼다 [^string-dict].
- 근데 이때 이 두 값이 64bit 이기 때문에, 이러한 변환 작업은 [[#5.0.4. Dictionaries for fixed-size data.|Double dictionary]] 와 동일하게 SIMD 로 처리될 수 있다.
- 이렇게 string copy 를 피하는 것 만으로도, 중복되는 값이 많은 (즉, low cardinality) block 에 대해 최대 10배 (!!) 의 성능차이가 나는 것을 확인할 수 있었다.
- 또한 추가적인 SIMD 최적화를 수행해 [^string-dict-simd], *End-to-end* evaluation 에서 13% 정도의 성능 개선이 있었다고 한다.

#### 5.0.6. Fusing RLE and Dictionary decompression.

- [[#2.2.3. Dictionary|Dictionary Encoding]] 의 결과로 나온 code sequence 는 decimal array 이기에, 꽤나 종종 RLE 로 cascading 된다.
- 그래서 이놈에 대한 decompression 을 최적화할 수 있으면 아주 좋을것이리라.
- 기존에는 이 경우에 대해 (1) RLE 를 풀어 다시 code sequence 로 되돌리고 (2) code sequence 를 dictionary 로 원상복구 하는 과정을 거친다.
- 하지만 이때 중간에 code sequence 가 불필요하게 발생하기 때문에, 이런식으로 decompression 을 진행해 code sequence 의 생성을 제거한다.
	1) RLE 에다가 먼저 dictionary 를 적용해 runs of code sequence 를 runs of values 로 변환한다.
	2) 그다음에 이것을 풀어 원래의 값으로 원상복구하는 것.
- 이때에도 SIMD 를 이용해 최적화를 진행했다 [^fuse-rle-simd].
- 하지만 이 방법을 항상 적용하는 것은 아니다. Run length 가 평균 3 이상은 되어야 이 방법을 사용한다고 한다.
	- 왜냐면 구체적으로 이유를 언급하지는 않았지만 3보다 작은 경우에는 성능이 오히려 나빠졌다고 한다.
- 이 방법을 적용해, *End-to-end* evaluation 에서 7% 정도의 성능 향상이 있음을 확인했다고 한다.

#### 5.0.7. FSST.

- FSST open source implementation 이 제공하는 decompression API 를 이용하면 compressed string element 하나에 대해 decompression 이 가능하다.
	- 이 decompression API 에는 원하는 compressed string element 의 compressed string sequence 에서의 offset 과 length 를 parameter 로 전달해서 수행한다.
	- 즉, symbol table 과 compressed string sequence 는 이미 알고 있다고 전제하고, string offset 을 전달해 sequence 에서의 decompression 시작점을 알려주고, string length 도 전달해 종료지점 또한 알려주는 것.
	- 참고로 이 점은 FSST 의 장점이기도 하다. string sequence 전체를 decompression 할 필요 없이 하나의 string 만을 decompression 할 수 있는 이른바 *Random Access* 가 되기 때문.
- 단순하게는 loop 를 돌며 각 string 들을 decompression 할 수 있겠지만, 이렇게 하면 문제가 있다고 한다.
	- FSST 의 decompression 은 최적화가 되어 있기 때문에, loop 를 돌게 되면 "최적화된 구간" <-> "최적화 안된 구간" 을 반복적으로 왔다갔다 하게 된다.
- 따라서 BtrBlock 에서는 전체를 그냥 하나의 string 으로 생각해서, offset 은 첫 string 의 offset, length 는 모든 string length 의 합으로 decompression API 를 실행한다.
	- 이렇게 하면 위에서 말한 구간 전환 없이 한번의 "최적화된 구간" 으로 쭉 진행할 수 있게 된다.
- 결과적으로, 각각의 string element 를 loop 을 돌며 decompression 할 때보다 string element 1개 당 50 instruction 을 줄일 수 있게 된다.
- 추가적으로, 어차피 첫 string element offset 을 offset parameter 로 넘겨주고 string length 합을 length parameter 로 넘겨주기 때문에, 이들을 저장할 필요 없이 그냥 uncompressed string length 만 저장한하는 것으로도 충분하다고 한다.

#### 5.0.8. Pseudodecimal.

- [[#4. Pseudodecimal Encoding|Pseudodecimal Encoding]] 만큼이나 decompression 하기 쉬운 것은 없다.
	- 그냥 $Significant * 10^{Exponent}$ 만 계산해주면 되기 때문.
	- 그리고 이것 또한 SIMD 를 이용해서 64bit-double 4개를 한번에 계산하는 방법으로 착착 찍어내 주면 훨씬 빨라진다.
- 근데 문제는 *Exception* 이다.
	- 그냥 SIMD 를 이용해서 4개씩 쭉쭉 계산하고 싶은데, 중간에 저 *Exception* 이 끼어있으면 그렇게 못하기 때문이다.
	- 따라서 이 *Exception* 들에 대해서는 [[#2.2.7. NULL Storage Using Roaring Bitmaps.|Roaring Bitmap]] 을 이용해 관리를 하고, 이 bitmap 을 확인했을 때 *Exception* 이 없다면 SIMD 로, 있다면 그냥 하나하나 decompression 하게 된다.
		- "하나하나 decompression" 은 구체적으로 그냥 double 의 경우에는 $Significant * 10^{Exponent}$ 로 계산하고, exception 에 대해서는 *Patch* 값을 사용하는 것을 의미한다.

## 6. Evaluation

### 6.0. *Setup*

> [!tip] [[#6.0. *Setup*|Section 6.0.]] Setup
> - 마찬가지로 논문에는 없는 section 이고, 형식상 주인장이 끼워 넣은 것이다.

#### 6.0.1. Test setup

- 100Gpbs 네트워크를 제공하는 이점이 있는 AWS EC2 `c5n` 인스턴스 (`c5n.18xlarge`) 를 사용했다.
- 하드웨어 정보는:

| CLASS        | INFO                                       |
| ------------ | ------------------------------------------ |
| CPU          | Intel Xen Pantium 8000 series (Skylake-SP) |
| Core/clock   | 36C 72T (3.5GHz)                           |
| SIMD support | AVX2, AVX512                               |
| Memory       | 192GiB                                     |

- 그리고 SW dependency 정보는:

| CLASS    | INFO                         |
| -------- | ---------------------------- |
| Compiler | GCC 10.3.1                   |
| OS       | Amazon Linux 2 (kernel 5.10) |

- 추가적으로...
	- TBB library 를 이용해 병렬처리
	- Hyperthreading 은 비활성화
	- Evaluation 전에 모든 메모리 공간에 접근해 실험 도중 page fault 가 나지 않도록 했다.
	- 여러번 실험 후 평균내어 caching 과 CPU frequency ramp-up 이라는 것도 방지했다고 한다.

#### 6.0.2. Parquet test setup

- 일단 실험을 위해 Parquet file 을 생성하는 것은 [Apache Arrow](https://github.com/apache/arrow) (`pyarrow 9.0.0`) 와 [Apache Spark](https://github.com/apache/spark) (`pyspark 3.3.0`) 모두를 사용했다고 한다.
	- 위의 것들을 사용하면서 변경한 설정은 Arrow 에서 Parquet file 의 rowgroup 사이즈를 $2^{17}$ 로 변경한 것 외에는 없다고 한다.
	- 이유는 그냥 이게 더 빨라서.
- 그리고 이렇게 생성한 Parquet file 과 Arrow C++ library 를 이용해 구현한 BtrBlock 에 대한 실험을 진행했다고 한다.
	- Arrow C++ library 는 Arrow 의 여러 클래스 (구조체) 를 제공하는 high-level API 와 Parquet file 을 직접 건드릴 수 있게 해주는 low-level API 두 가지를 제공하는데,
	- High-level API 의 경우에는 너무 느려서 low-level API 만을 사용했다고 한다.
- 그리고 rowgroup 과 column 에 대해 decompression 하는 과정을 병렬로 처리되도록 했다고 한다.

### 6.1. Real-World Datasets

#### 6.1.1. Synthetic data.

- TPC-H 나 TPC-DS 와 같은 데이터셋은 전통적인 DBMS 혹은 cloud DBMS 들에 대해 query engine 성능 측정에 아주 효과적이라고 알려져 있다.
- 하지만 얘네들이 생성해주는 데이터셋은 현실에서 볼 수 있는 데이터와는 조금 거리가 있다는 것 또한 알려져 있는 사실이다.
	- 이 데이터들은 완벽하게 정규화되어 있고,
	- 균일하고 독립적인 데이터 분포를 이루고
	- 정수 데이터들이 대부분이기 때문에
	- (특히 Data Lake 에서는) 현실의 데이터와는 거리가 있다는 것.
- 따라서 BtrBlock 에서는 이런 인공적인 (*Synthetic*) 데이터보다는 현실적인 데이터를 사용했다고 한다.

#### 6.1.2. The Public BI Benchmark.

- 그래서 BtrBlock 에서 사용하는 데이터셋은 *Public BI Benchmark* 이다.
- 여기에는, [Tableau 사](https://www.tableau.com/) 에서 공개한 46 개의 Tableau Workbook 에 의해 추출된 데이터들이 포함되어 있다고 한다.
- 따라서 이 데이터들은 완벽하지 않다는 점에서 훨씬 더 현실과 유사하다고 할 수 있다:
	- 왜곡된 데이터들
	- 정규화되지 않은 테이블들
	- 잘못 사용된 데이터 타입들
		- 가령 실수값을 문자열로 저장하는 등
	- 잘못된 `NULL` 표현
		- 가령 `NULL` 을 문자열로 저장하는 등
- 또한, Tableau 만의 특징도 있었는데, 그것은 Tablaeu 에서는 decimal 을 floating-point number 로 저장한다는 것이었다.
	- Floating number 는 위에서도 말했다시피, 다소 효율적이지 못한 방식으로 저장되고 있는 반면에
	- AI, ML 분야에서는 빈번하게 사용되고 있는 자료형이다.
- 그래서 일단 이 데이터셋이 어떤 특징을 가지고 있는지부터 살펴보자.

#### 6.1.3. Public BI vs. TPC-H.

![[Pasted image 20240724113849.png]]

- 위 표는 Public BI 와 TPC-H 의 여러 자료형의 데이터에 대해 여러가지 compression 방법을 적용했을 때를 나타낸다.
- 일단 가로축부터:
	- 뭐 *datatype* 이나 *dataset* 은 별로 설명할 필요가 없을 것 같고
	- *metric* 의 경우에는 `sh` 와 `cr` 로 나뉜다.
		- `sh` 는 전체 데이터 사이즈에서 해당 데이터가 차지하는 비율 (%) 을 뜻한다.
			- 가령 표의 왼쪽 위에 있는 71.5% 는 전체 PBI 데이터셋 중에서 String data 가 71.5% 라는 것을 의미한다.
			- 뭐 TPC-H 에서는 여러 사이즈의 데이터셋을 생성할 수 있기 때문에, 절대적인 수치가 아닌 상태 비율로 표현했다고 하네
		- `cr` 은 *compression ratio* 이다.
			- 어떤 compression 방법을 적용했을 때와 적용하지 않았을 때 (*Binary*) 의 데이터 사이즈를 비교해서 계산된 값이다.
- 그리고 세로축은:
	- *Binary* 는 압축되지 않은 날것의 상태이고,
		- 즉, 메모리에 적재된 binary column data
		- 이것을 가지고 Parquet file 을 만들고 BtrBlock 을 적용하고 지지고 볶고 하는 것.
	- *Parquet* 는 *Binary* 를 Parquet file 로 인코딩한 것,
	- 그 아래의 *LZ4*, *Snappy*, *Zstd* 는 Parquet file 을 해당 compression tool 로 압축한 것을 의미한다.
	- 그리고 마지막에 *BtrBlock* 을 적용했을 때의 결과인 것.
- 자 그럼 이 값들에 대해 더 깊게 살펴보자.

#### 6.1.4. Public BI vs. TPC-H: Strings.

- 

#### 6.1.5. Public BI vs. TPC-H: Doubles.

#### 6.1.6. Public BI vs. TPC-H: Integers.

#### 6.1.7. Adapting for evaluation.

---
[^vectorized-processing]: ([논문](https://www.cidrdb.org/cidr2005/papers/P19.pdf)) Query engine 최적화 논문이다.
[^compilation]: ([논문](https://www.vldb.org/pvldb/vol4/p539-neumann.pdf)) Query engine 최적화 논문이다.
[^data-lake-proposal]: [[(논문) Lakehouse - A New Generation of Open Platforms that UnifyData Warehousing and Advanced Analytics|CMU 15721 수업 논문]] 인듯?
[^data-lake-network-bottleneck]: Data warehouse 의 경우에는 (적어도) 같은 벤더사 내에서의 네트워크이기 때문에 이러한 점이 문제가 되지 않았던 것인가?
[^one-value]: #draft 이거 감 안온다. 코드 보고 확인하자.
[^string-pool]: #draft 이것도 뭔지 감이 잘 안온다. 코드 보고 확인해야 할듯.
[^freq-end]: #draft 이것도 코드 보고 확인하자.
[^simd]: #draft 구체적인 이야기는 하지 않는다. [논문](https://onlinelibrary.wiley.com/doi/10.1002/spe.2203) 참고해서 확인하자.
[^roaring-bitmap]: #draft 주인장의 추측이다. 논문에서는 column 의 NULL 값을 bitmap 으로 어떻게 표현하는지에 대한 설명은 되어 있지 않다.
[^heavyweight-scheme]: 여기 "무거운 (heavyweight)" 이 어떤 측면에서 말하는 것인지는 확실하지 않다. 만약 compression ratio 가 일반적으로 낮은 scheme 을 지칭하는 것이라면 일리가 있으나 decompression overhead 가 안좋은 것을 지칭하는 것이라면 decompression overhead 와 compression ratio 모두 좋은 scheme 을 새로 찾아야 하는 것인데, 쉽지는 않았을 듯. 근데 문맥상으로 보면 후자인 것 같다.
[^sign-digit]: #draft Pseudo-code 만 보면 input 이 무조건 양수로 바뀐다. 음수는 어떻게 처리되는지 몰것네
[^fixed-size-dict]: SIMD 를 사용했는데 생각보다 개선률이 적다. 왜인지는 모르겠다. 다만, [코드상](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/templated/FixedDictionary.hpp)에서 Fixed Dictionary 에 대해서는 SIMD 를 사용하는 부분이 보이지 않고 위의 코드는 Dynamic Dictionary 에서 확인된다는 점이 좀 의심스럽다.
[^string-dict]: #draft 이렇게만 하면 실제 string 으로 변환하는 부분은 어디에서 담당할까? 변환하지 않고 그냥 `char array` 로 냅두는 것일까? 코드 보고 확인해야 할 듯,, 관련있어 보이는 코드는 [이거임](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/templated/VarDictionary.hpp#L71-L93)
[^string-dict-simd]: #draft 구체적으로 어떤 내용인지는 논문에 나오지 않는다. 이것도 코드 보고 판단해야됨.
[^fuse-rle-simd]: #draft 이것도 구체적으로 어떻게 했는지는 논문에 안나온다. 코드 참고하자.