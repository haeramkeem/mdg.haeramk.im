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
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (6. Evaluation)|6. Evaluation (현재 글)]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (7. Related work and conclusion)|7. Related work and conclusion]]

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
- 그리고 rowgroup 과 column 에 대해 decompression 하는 과정을 병렬로 처리되도록 했다고 한다 [^rowgroup-column-decompression].

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
			- 어떤 compression 방법을 적용했을 때와 적용하지 않았을 때 (*Binary*) 의 데이터 사이즈를 비교해서 계산된 값이다 [^compression-ratio].
- 그리고 세로축은:
	- *Binary* 는 압축되지 않은 날것의 상태이고,
		- 즉, 메모리에 적재된 binary column data
		- 이것을 가지고 Parquet file 을 만들고 BtrBlock 을 적용하고 지지고 볶고 하는 것.
	- *Parquet* 는 *Binary* 를 Parquet file 로 인코딩한 것,
	- 그 아래의 *LZ4*, *Snappy*, *Zstd* 는 Parquet file 을 해당 compression tool 로 압축한 것을 의미한다.
	- 그리고 마지막에 *BtrBlock* 을 적용했을 때의 결과인 것.
- 자 그럼 이 값들에 대해 더 깊게 살펴보자.

#### 6.1.4. Public BI vs. TPC-H: Strings.

- 위의 표에서 확인할 수 있는 문자열 관점에서의 PBI 와 TPC-H 의 차이점은 크게 두가지이다.
1) 일단 PBI 에서가 TPC-H 보다 전체 데이터 중 문자열이 차지하는 비중이 더 컸다.
2) 평균 compression ratio 가 PBI 보다 TPC-H 가 더 크다 (즉, 더 많이 압축된다).
	- 이것은 왜냐면 PBI 에서는 대부분의 문자열이 구조적인 경향이 있기 때문이다.
		- "구조적인" 이라는 말이 좀 어색할 수 있는데, 가령 웹페이지 URL 나, 아니면 제품 코드처럼 비슷한 형태를 띄고 있다는 것이다.
		- 얘네들은 동일한 prefix 를 사용하는 (가령 `https://` 처럼) 경우가 종종 있기 때문에, 더 압축이 많이 되는 것.
	- 반면에 TPC-H 에서는 test data pool 에서 무작위 선택을 하기 때문에, 이러한 경향성을 보이지 않아 압축이 덜되는 것이다.
	- 결과적으로 PBI 의 경우에는 10.2 정도의 압축률을 보이는 반면, TPC-H 의 경우에는 3.3 정도의 압축률밖게 안나오게 된다.

#### 6.1.5. Public BI vs. TPC-H: Doubles.

- Double 의 경우에는 [[#6.1.4. Public BI vs. TPC-H Strings.|문자열]] 과는 반대의 양상을 보였다.
1) 우선 TPC-H 에서 double 이 차지하는 비중이 더 컸고, ($14.4 ≤ 19.5$)
2) 압축률도 TPC-H 에서 더 컸다. ($1.99 ≤ 2.78$)
	- 이것은 TPC-H 에서 double 값들의 범위가 한정되어 있기 때문이다.
		- TPC-H 에서는 대부분의 double 이 금액 (*price data*) 를 나타내는 데 사용되었기 때문에, 이 값들의 범위가 한정되어 있다 [^numeric-range].
		- 따라서 compression 을 적용하기에 더 용이 (특히 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (4. Pseudodecimal encoding)|Pseudodecimal Encoding]] 는 더욱 더) 하기에 이런 결과가 나오는 것이다.

#### 6.1.6. Public BI vs. TPC-H: Integers.

- 정수의 경우에는:
1) 비중은 TPC-H 가 더 컸다. ($14.1 ≤ 18.7$)
2) 하지만 compression ratio 는 PBI 가 훨씬 더 크게 나왔다. ($5.42 ≤ 1.60$)
	- 이건 TPC-H 의 데이터들이 비현실적으로 완벽하게 정규화되어 있는 데에서 비롯된다.
		- TPC-H 의 데이터에서 정수값은 대부분 Primary (Unique), Foreign Key 이기에 `SEQUENCE` 인 경우가 잦았다.
		- 따라서 중복되는 값이 거의 없기에, [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.2. RLE & One Value.|RLE]] 와 같은 애들을 사용하기에 용이하지 않은 것.
		- 이러한 것들은 그들의 깃허브 ([1](https://github.com/cwida/public_bi_benchmark/blob/master/benchmark/CommonGovernment/samples/CommonGovernment_1.sample.csv), [2](https://github.com/cwida/public_bi_benchmark/blob/master/benchmark/Generico/samples/Generico_1.sample.csv)) 에 공개한 데이터셋에서 확인할 수 있다고 한다.

#### 6.1.7. Adapting for evaluation.

- BtrBlock 에서는 이러한 PBI 데이터셋을 그대로 이용한 것이 아니고, 이것들 중 일부만을 사용했다.
- 선택 혹은 배제된 데이터들은 다음과 같다:
	1) 일단 데이터셋의 여러 테이블 중 가장 크기가 큰 테이블 하나만을 사용했다.
		- 이것은 같은 데이터셋에 속한 여러 테이블들은 유사성을 보이기 때문이다.
		- 가령 한 테이블 데이터로부터 다른 테이블 데이터가 산출되기도 하고, 이런 점이 이 테이블들을 유사하게 만든다.
	2) 또한 사이즈가 너무 작은 데이터셋 (`IUBLibrary`, `IGlocations`, `Hatred1`) 과 `date`, `timestamp` 와 같은 column 들도 제외했다고 한다.
- 이렇게 골라낸 결과는 메모리에 적재된 양 기준 총 119.5GB 크기였다고 한다.
	- 여기에는 43개의 table 이 포함되고, 각 테이블은 6 ~ 519 (평균 57) column 들을 가지고 있으며 총 2451 column 으로 이루어진다고 한다.
- 그리고, 다른 논문들과의 비교를 위해, TPC-H 를 이용해서도 evaluation 을 진행했다고 한다.

### 6.2. The Compression Scheme Pool

#### 6.2.1. Measuring the impact of individual techniques.

- 각 Cascading 단계에서 각 compression scheme 이 미치는 영향을 실험해 보았을 때, 전반적으로 compression ratio 와 decompression speed 사이에는 trade-off 가 있는 것으로 나타났다.
- 이 영향도를 실험하기 위해서, 어떤 compression scheme 을 scheme pool 에 하나씩 추가하며 compression ratio 와 decompression speed 가 어떻게 달라지는지 확인했다고 한다.
	- 즉, 이후에 나올 그래프에 나온 scheme 순서가 추가한 순서인 것.
- 그리고 decompression 의 경우에는 concurrency control 에 의해 발생하는 지연 (가령 lock 을 잡고 놓는 등의) 을 막기 위해 스레드를 하나만 사용했다고 한다.

#### 6.2.2. Impact on compression ratio.

> [!tip] 그래프 읽기
> - 여기서의 compression scheme 순서는 scheme pool 에 추가된 순서이고, 이렇게 추가됨에 따라 compression ratio 가 어떻게 변화하냐를 나타낸 것이다.
> - 주의할 것은 이 순서대로 cascading 되었다는 것이 아니라는 점이다.

![[Pasted image 20240724141458.png]]

- Double 먼저 보자.
	- 여기에서 가장 크게 향상을 이뤄낸 scheme 은 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.3. Dictionary|Dictionary]] 와 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (4. Pseudodecimal encoding)|Pseudodecimal]] 이다. (각각 95%, 20%)
	- 하지만 보다시피, double 은 본질적으로 compression 이 힘들기 때문에, 다른 자료형에 비해 compression ratio 가 낮은 것을 확인할 수 있다.
- Integer 는 별 설명이 없다... 특별할게 없기 때문인듯.
- String 의 경우에는,
	- 일단 세 자료형 중에 가장 compression ratio 가 좋은 것을 볼 수 있다.
	- Dictionary 가 추가됐을 때 7배 가까이 compression ratio 가 뛰는 것을 볼 수 있고,
	- Dictionary 가 FSST 를 같이 사용하도록 하면 Dictionary 에 비해 51% 더 증진되는 것을 볼 수 있다.
	- 그리고 FSST 가 추가되는 경우 (*Raw FSST*) 에 compression ratio 가 좀 더 증진되었다.
- OneValue 는 위 그래프에서는 별로 두각을 드러내지 못했다.
	- 아마 block 전체가 하나의 값을 가지는 경우가 드물어서 그러리라.
	- 하지만 뒤에서 설명하겠지만, 만약 이것이 적용된다면 (64,000개가 하나의 값으로 쪼그라들기 때문에) 엄청난 compression ratio 를 달성하게 된다.

#### 6.2.3. Impact on decompression speed.

![[Pasted image 20240724141520.png]]

- OneValue 가 double 과 integer 의 경우에 가장 decompression speed 가 빨랐다.
	- 이것은 OneValue 의 경우에 아마 SIMD 같은걸로 쭉쭉 써내려갈 수 있기 때문이리라.
- 그리고 string 의 경우에는 Dictionary 가 가장 빨랐는데,
	- 이것은 위에서 설명한 것처럼 Dictionary 에서 문자열을 복사하는 방식이 아닌 pointer 를 복사하는 방식이기에 가능한 것이었다.

### 6.3. Sampling Algorithm

#### 6.3.1. Sampling research questions.

- BtrBlock 에서는 sample 을 바탕으로 scheme selection 을 하기 때문에, "어떻게 sample 을 추출하냐 (*Sampling Strategy*)"에 따라 "scheme selection 의 정확도"가 올라간다.
- 여기서 "어떻게 sample 을 추출하냐" 는 다음과 같은 research question 으로 정리될 수 있다.
	1) Sample 사이즈를 고정시켰을 때, 어떻게 sample 을 추출하는 것이 좋을까? 작게 여러개? 아니면 크게 하나?
	2) Sample 사이즈가 변화함에 따라, scheme selection 의 정확도는 어떻게 변화할까?
- 그리고 이 research question 에 대한 답을 하기위한 척도, 즉 "scheme selection 의 정확도" 는 다음과 같이 계산할 수 있다.
	1) 일단 모든 column 의 첫번째 block 들에 대해 scheme pool 의 모든 scheme 을 적용시킨다.
		- BtrBlock 에는 8개의 scheme 이 있으므로, column 당 8개의 결과가 나올 것이다.
	2) 그리고, cascading 을 위해, 이 결과들에 대해 적용하지 않은 scheme 을 하나씩 적용시켜본다.
		- 즉, 8개의 scheme 중 하나가 적용되어 있고 나머지 7개가 남아 이것을 적용시키는 것이기 때문에, column 당 총 $8 * 7 = 56$ 개의 결과가 나올 것이다.
	3) 이 64개 ($8 + 8 * 7 = 64$) 의 결과들 중에, compression ratio 가 작은 놈을 고른다. 이것을 *Optimal Scheme* 이라고 부르자.
	4) 그리고 한 *Sampling Strategy* 을 선택해 위의 과정을 반복하되, block 전체가 아닌, 이 *Sampling Strategy* 를 통해 선택된 sample 을 이용해 수행한다. 이 결과로 선택된 scheme 을 *Sampling Scheme* 이라고 부르자.
	5) 만약 *Sampling Scheme* 이 *Optimal Scheme* 과 같거나 혹은 2% 내의 성능 하락만이 있는 경우에 대해 올바르게 scheme 을 선택했다고 간주할 때, 이 *Sampling Strategy* 가 올바르게 scheme 을 선택한 비율을 계산한다. 이것이 "scheme selection 의 정확도" 이다.
		- "2% 내의 성능 하락" 이라는 허용범위를 둔 것은, 가령 (Dict -> RLE) 와 (RLE -> Dict) 와 같이 사실상 동일한 경우 또한 올바름으로 인정하기 위해서이다.
- 이제 이렇게 정의한 "정확도" 에 따라 첫번째 research question 에 대한 답을 해보자.

#### 6.3.2. Best strategy for a fixed sample size.

![[Pasted image 20240724154045.png]]

- 이게 그 결과다. 일단 legend 부터 확인해 보자.
	- 기본적인 것은 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (3. Scheme selection and compression)#3.1.1. Choosing samples.|Section 3.1.1.]] 에서 설명한 것과 동일하다.
		- 즉, 전체 block 을 *Partition* 으로 나누고, 그 안에서 랜덤한 위치에서 시작해 일정 개수의 연속된 *Entry* 들을 고르는 것.
	- `NxM` 에서 `N` 은 *Partition* 의 갯수이고, `M` 은 *Partition* 당 *Entry* 의 갯수이다.
		- 즉, `640x1` 은 한 block 을 640 개의 *Partition* 으로 나누고, 그 *Partition* 에서 1개의 *Entry* 를 선택한다는 것이다.
	- 따라서 `640x1` 은 그냥 개별 랜덤 선택 (*Random individual tuples* - 청록색) 과 같고, `1x640` 은 그냥 하나의 덩어리를 선택 (*Single tuple range* - 보라색) 와 같다.
- 결과는:
	- 예상대로 *Random individual tuples* 가 가장 구렸다. 아마 locality 를 고려하지 못하기 때문이리라.
	- 그리고 *Single tuple range* 는 생각보다는 선방했지만 그래도 구렸다. 이건 아마 distribution 을 고려하지 못하기 때문이리라.
		- *Single tuple range* 가 데이터의 특성을 제대로 반영하지 못한다는 것의 예시가 궁금하면, [[#6.6.5. Per-column performance.|Section 6.6.5.]] 의 `Value Example` column 을 보자.
	- 위의 결과가 시사하는 바는 (`320x2` 를 제외하면) 여러 *Partition* 에서 적당한 개수의 *Entry* 를 선택하는 것이 locality 와 distribution 의 토끼를 모두 잡게 해준다는 것이다.

#### 6.3.3. Impact of sample size.

![[Pasted image 20240724154100.png]]

- 위의 그래프는 두번째 research question 인, sample size 와 "정확도" 간의 상관관계다.
	- 다만 여기서는 저 *Data SIze* 가 "정확도" 의 척도가 된다.
	- 즉, 저 *Data Size* 는 compression result 의 사이즈를 일컫는 것으로,
	- *Optimal Scheme* 으로 compression 했을 때를 기준치 (*optimum*) 로 했을 때 sample 사이즈를 변경해 가며 *Sampling Scheme* 으로 compression 한 결과와의 차이를 나타내고 있는 것.
	- 따라서 *optimum* 에 가까울 수록 "정확한" 것이 된다.
- 세로축에 대한 이야기는 위의 설명으로 얼추 된 것 같고, 이제 가로축 얘기를 해보자.
	- 보면 *optimum* 에 가까울 수록 "정확" 하긴 하지만, sample 의 사이즈는 점차 커지는 것을 볼 수 있다.
	- Sample 의 크기가 커진다는 얘기는 당연히 compression 시에 CPU 를 많이 사용한다는 것이고, 따라서 이 가로축은 "CPU 사용률" 을 대변할 수 있게 된다.
- 즉, 정리하면 sample 을 작게 잡으면 정확도는 떨어지지만 (즉, compression ratio 는 작아지지만), CPU 사용량은 적게 먹게 되고, 반대로 크게 잡으면 정확도는 높아지지만 CPU 사용량이 커지는 trade-off 가 있는 것.

#### 6.3.4. Samping in BtrBlocks

- 위 실험 결과가 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (3. Scheme selection and compression)#3.1.1. Choosing samples.|Section 3.1.1]] 에서 제시한 설정값들에 대한 근거가 된다.
- 위같은 실험 결과에 의해, BtrBlock 은 10개의 *Partition* 과 64개의 *Entry per Partition* 을 사용해 sampling 을 하고, 그 결과 CPU 사용량을 전체 과정 대비 1.2% 만 소모하고도 scheme selection 이 가능해 졌다.

### 6.4. Compression

#### 6.4.1. Compression ratio.

![[Pasted image 20240724163659.png]]

- BtrBlock 의 compression ratio 는 위 그림 하나로 정리될 수 있다.
	- 일단 BtrBlock 은 relational column store 을 전제로 한 compression scheme 이다. 따라서 대표적인 relation column store 4개와도 compression ratio 를 비교했으며, 위 그래프에서 System A~D 로 표현되어 있다 [^system-a-d].
		- 보다시피 전부 BtrBlock 에 비해 나약하다.
	- 그리고 대표적인 column data format 인 Parquet 와, 그것에 여러 compression 을 적용한 애들 (Parquet + LZ4, Snappy, Zstd) 과의 비교 또한 수행하였다.
		- 여기서는 Parquet + Zstd 를 제외하면 모두 이겨버리는 것을 볼 수 있다.
		- Parquet + Zstd 를 이기지 못하긴 했지만, 이놈은 heavyweight 라는 치명적인 단점이 있다.

#### 6.4.2. Compression speed.

![[Pasted image 20240724180608.png]]

- 앞서 말한 것처럼, compression 과정은 OLAP 에서 이루어지기 때문에 compression speed 에 대해서는 크게 신경쓰지 않는다.
- 다만, compression speed 가 다른 것들과 비교해서 나쁘지 않다는 것을 피력하기 위한 것인 걸로 보인다.
- 어쨋든, compression 과정은 (1) CSV 파일을 읽어 memory 로 올리고, (2) memory 에서 binary data 를 처리하는 두 단계로 나눌 수 있고, 각 단계를 시작점으로 해서 속도가 얼마나 나오는지 실험했다고 한다.
- 그 결과는 위에서 볼 수 있듯이, (1) 에서 시작했을 때는 Parquet 를 사용했을 때와 유사한 수준이었고, (2) 에서 시작한 것은 훨씬 더 빠른 속도를 보여주었다.

### 6.5. Pseudodecimal Encoding

#### 6.5.1. Evaluation outside of BtrBlocks.

- 앞서 설명한 대로, [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (4. Pseudodecimal encoding)|PDE]] 는 double 수치를 위해 BtrBlock 에서 새로 제안한 것이고 따라서 BtrBlock 과 별개의 evaluation 을 수행하면 더욱 객관적인 비교가 될 것이다.
- 하지만 문제는 PDE 는 그 자체로는 compression 을 수행하지 않는다:
	- 마치 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.5. FOR & Bit-packing|FOR]] 이후에 bit 수를 줄이기 위해 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.5. FOR & Bit-packing|Bit-packing]] 을 수행하는 것처럼,
	- PDE 도 double 을 decimal 로 바꿔서 더욱 compression 하기 편한 형태로 만들 뿐 그 자체로는 데이터의 사이즈가 줄어들지는 않는다.
- 따라서 이것을 evaluation 하기 위해서 *Fixed two-level cascade* 을 가정한다:
	- 즉, *무조건* PDE 다음에는 FastBP128 이 cascading 되어 실질적인 compression 은 이것을 통해 하는 것.

#### 6.5.2. Comparing to existing double schemes.

![[Pasted image 20240724202136.png]]

- 위의 표는 PDE 의 성능을 객관적으로 보기 위해, 이것과 다른 4개의 floating-point encoding scheme ([FPC](https://ieeexplore.ieee.org/document/4148768), [Gorilla](https://dl.acm.org/doi/10.14778/2824032.2824078), [Chimp-Chimp128](https://dl.acm.org/doi/abs/10.14778/3551793.3551852)) 들에 대해 compression ratio 를 비교해 본 것이다.
	- 여기서 대상이 된 column 들은 데이터들이 아주 많고, *non-trivial data* 들이 들어 있다고 한다.

> [!tip] *Non-trivial data* 란?
> - 대략 "중복되는 값이 너무 많지 않은 데이터" 정도로 생각하면 될 것 같다.

- 일단 보면 Chimp128 과 서로 우열을 다루고 있는 모습을 확인할 수 있다.
	- 하지만, Chimp128 이 우세한 경우는 대부분 근소한 차이인 반면
	- `CommonGov.-26, 31, 40` 같은 column 을 보면 무친듯이 ratio 가 좋다는 점에서 [^pde-commongov] PDE 가 다른 encoding 에 비해 좋다고 말할 수 있을 것이다.
- 다만, `NYC-29` 의 경우에는 compression ratio 가 꼴찌로 선정되는 수모를 겪었는데, 이건 PDE 가 high-precision value 에 대해서는 불리하기 때문이다.
	- 즉, high-precision 의 경우에는 exponent 가 너무 커져 많은 경우 patch 로 빠지고, 따라서 거의 compression 이 되지 않는 안타까움이 발생하기 때문이다.
		- 이것이 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (4. Pseudodecimal encoding)#4.2.2. When to choose Pseudodecimal Encoding.|Section 4.2.2.]] 에서 설명한 첫번째 heuristic 의 근거가 된다.
	- `NYC-29` 에는 위도, 경도값이 들어 있기에 이런 안좋은 결과가 나온 것.

#### 6.5.3. Effectiveness inside BtrBlocks.

![[Pasted image 20240724204115.png]]

- 추가적으로 수행된 실험은, BtrBlock 의 다른 scheme 들과 경쟁해, PDE 를 BtrBlock 의 double 전문 scheme 으로 포함시킬만 한지 검증하는 것이었다.
	- 만일 다른 자료형과 무관한 scheme 들로도 충분히 double 을 compression 할 수 있다면, 굳이 이것이 BtrBlock 에 포함할 이유가 없기 때문이다.
- 결과는 위의 표와 같다:
	- 보면, 일부 `column` 들에 대해서는 PDE 가 밀리는 것을 볼 수 있는데,
		- 왼쪽의 일부 `column` 들이 PDE 보다 RLE 가 더 좋은 경우에 대해서는, run 이 너무 많아서 RLE 가 더 효율적이기 때문이고,
		- 오른쪽의 일부 `column` 들이 PDE 보다 Dictionary 가 더 좋은 경우에 대해서는, unique value 가 너무 적어 Dictionary 가 더 효율이기 때문이다.
		- 위 상황들이 모두 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (4. Pseudodecimal encoding)#4.2.2. When to choose Pseudodecimal Encoding.|Section 4.2.2.]] 에서 설명한 두번째 heuristic 의 근거가 된다.
	- 위 상황을 제외하면 PDE 가 우세한 것을 확인할 수 있다.

### 6.6. Decompression

#### 6.6.1. Open source formats.

- [[#6.4.1. Compression ratio.|Section 6.4.1.]] 에서는 proprietary system 들에 BtrBlock 을 적용해서 실험을 할 수 있었으나, decompression 에 대해서는 해당 service provider 에서 허가해주지 않아 실험을 진행할 수 없었다고 한다.
- 따라서 [[#6.0.2. Parquet test setup|Section 6.0.2.]] 에서 설명한 Parquet 에 추가적으로, ORC 에 BtrBlock 을 진행하여 실험을 수행했다고 한다.

#### 6.6.2. ORC test setup.

- ORC file 을 생성하는 것은 Apache Arrow (`pyarrow 9.0.0`) 를 사용했다.
	- Apache Spark 는 사용하지 않았다고 한다.
- 그냥 기본 설정을 사용하려고 했으나, 기본 설정을 사용하면 ORC file 이 너무 커져 병렬처리가 불가능해지는 문제가 있었다. 그래서 다음과 같은 설정을 바꿨다고 한다:
	- `dictionary_key_size_threshold` 값을 기본값 (`0`) 에서 [Apache Hive](https://github.com/apache/hive) 의 기본값 (`0.8`) 으로 변경했다.
	- 또한 LZ4 의 compression strategy configuration 도 기본값 (`DEFAULT`) 에서 `COMPRESSION` 으로 변경했다.
- [[#6.0.2. Parquet test setup|Section 6.0.2]] 에서는 Parquet 의 rowgroup size 를 변경했으나, ORC 의 저것과 동일한 설정인 stripe size 는 변경하지 않았다.
	- 이유는 빨라지지 않아서.
- 이렇게 만든 ORC file 로 benchmark 하는 것은 ORC C++ Library 를 사용했으나, 파일을 메모리로부터 읽어오는 기능 [^orc-mem-readfile] 을 지원하지 않아 이 부분 (코드상으로는 `orc::InputStream`) 만 커스텀했다고 한다.
- Parquet 에서와 마찬가지로 ORC 에서도 stripe 와 column 에 대해 병렬로 decompression 을 하여 실험했다 [^rowgroup-column-decompression].

#### 6.6.3. In-memory Public BI decompression throughput.

![[Pasted image 20240725140448.png]]

- 위 그래프는 PBI 를 이용해 decompression 을 실험한 결과를 보여준다.
	- 이미 여러번 언급한 것처럼 decompression throughput 와 compression ratio 간에는 trade-off 가 존재하고, 따라서 이 둘을 각각 Y 축과 X 축에 놓아 다른 방법들과 2차원적인 비교를 해보았다.
		- Decompression throughput 과 compression ratio 모두 좋은 것이 좋기 때문에 당연히 오른쪽 위일수록 좋은 방법이라 할 수 있다.
	- 참고로 decompression throughput 은 $DecompressedSize / DecompressionTime$  로 산출했다고 한다.
- 그 결과는 BtrBlock 은 다른 어떤 방법들보다 decompression throughput 이 월등히 좋았다.
	- Parquet 에 비하면 2.6배, Parquet + Snappy 에 비하면 3.6배, Parquet + Zstd 에 비하면 3.8배 더 좋았다고 한다.
	- 이것은 Parquet, ORC file 을 Zstd 로 compression 했을 때 ratio 가 BtrBlock 보다 좋은 점을 커버해 준다.
		- 즉, compression ratio 가 Zstd 보다 뒤지긴 하지만, 그만큼 decompression throughput 이 월등하기 때문에 경쟁력이 있다는 것.

#### 6.6.4. Decompression of Parquet vs. ORC.

- BtrBlock 과는 무관하지만, PBI 를 사용한 것이 이 논문의 contribution 중 하나이기 때문에, PBI 를 사용했을 때 Parquet 와 ORC 의 성능도 한번 비교해 보자.
- 결론적으로, 전반적으로 Parquet 가 더 좋았다.
	- Decompression throughput:
		- Vanilla, +Snappy, +Zstd 에 대해 Parquet 가 ORC 보다 각각 4.1배, 4.2배, 2.4배 더 throughput 이 잘나왔다.
	- Compression ratio:
		- 보면 Snappy 나 Zstd 를 추가하면 ORC 가 Parquet 보다 좀 더 compression ratio 가 좋아기긴 한다.
		- 근데 이것은 애초에 Vanilla 상태에서 비교했을 때 ORC 가 Parquet 에 비해 file size 가 28% 더 크기 때문이라고 한다.
		- File size 는 28% 가 차이나는데, compression ratio 는 기껏해야 8% 정도밖에 차이나지 않기 때문에 Parquet 가 더 우세하다는 논리인듯.

#### 6.6.5. Per-column performance.

![[Pasted image 20240725142830.png]]

> [!tip] 표 읽기
> - 각 ID 가 어떤 column 인지 아래에 나와 있다 (join 표시). Column 까지 같이 적으면 너무 가독성이 떨어져서 table 을 분리한듯.

- 위 표는 PBI 에서 랜덤으로 선택한 column 들에 대해 BtrBlocks 와 Parquet + Zstd 를 비교해놓은 것이다.
	- Decompression speed: 보면 진짜 BtrBlock 이 월등하게 빠르긴 하다.
	- Compression ratio: 이건 전반적으로 Zstd 가 더 좋긴 하다. 근데 그 차이가 decompression speed 에서의 차이만큼이나 극적이진 않다는 것을 볼 수 있다.
	- Scheme: 이건 BtrBlock 에서 첫 cascading 시에 선택된 scheme 을 보여준다.
		- 보면 OneValue 와 PDE 를 사용했을 때 Zstd 보다 compression ratio 가 더 잘 나온다는 점에서 이 둘은 충분히 BtrBlocks 의 scheme pool 에 추가될 가치가 있다는 것을 알 수 있다.
	- Value Example: 이건 block 의 첫 20개의 entry 를 예시로서 보여준 것이다.
		- 여기서 [[#6.3.2. Best strategy for a fixed sample size.|Section 6.3.2]] 에서 언급한 *Single tuple range* 의 문제점을 다시금 확인할 수 있다.
		- 첫 20개의 entry 만 보면 OneValue 가 적합해 보이는 것이 여럿 있지만, 실제로는 OneValue 가 선택되지 않았다는 점에서 이 연속된 entry 로만 판단하는 것이 꽤나 부정확하다는 것을 확인할 수 있다.

#### 6.6.6. In-memory TPC-H decompression throughput.

![[Pasted image 20240725141559.png]]

- [[#6.6.3. In-memory Public BI decompression throughput.|Section 6.6.3]] 에서는 PBI 를 이용해 실험을 했고, 다른 논문과의 비교를 위해 TPC-H 에 대한 실험 결과도 같이 수행했다고 한다.
- 결과는:
	- 일단 [[#6.6.3. In-memory Public BI decompression throughput.|Section 6.6.3]] 에 비해 양상이 크게 바뀌지는 않았다. 여전히 BtrBlock 이 더 throughput 이 잘나왔고, 심지어는 compression ratio 는 Parquet + Zstd 를 앞서기까지 한다.
		- 수치적으로는, throughput 이 Parquet, +Snappy, +Zstd 에 대해 각각 2.6배, 3.9배, 4.2배 더 좋아졌다고 한다.
	- 그리고 전반적으로 throughput 이 감소했다. 이것은 [[#6.1.1. Synthetic data.|Section 6.1.1]] 에서 설명한 것처럼, TPC-H 가 PBI 에 비해 데이터들이 훨씬 비현실적이기 때문이다.

### 6.7. End-to-End Cloud Cost Evaluation

> [!tip] [[#6.7. End-to-End Cloud Cost Evaluation|Section 6.7.]] 의 구조
> - 본 섹션은 크게 네 덩어리로 나눌 수 있다.
> 1) [[#6.7.1. Is Parquet decompression fast enough?|6.7.1]] 과 [[#6.7.2 Decompression throughput and network bandwidth.|6.7.2]] 는 cloud 가 제공하는 네트워크의 대역폭 관점에서 BtrBlock 의 정당성을 검포하기 위한 새로운 metric 인 $T_{c}$ 를 제시한다.
> 2) [[#6.7.3. Measuring end-to-end cost.|6.7.3]] 과 [[#6.7.4. End-to-end cost test setup.|6.7.4]] 는 evaluation 을 위한 환경 설정에 대한 것이다.
> 3) [[#6.7.5. Loading individual columns.|6.7.5]] 와 [[#6.7.6. Cost comparability.|6.7.6]] 은 일종의 시행착오에 대한 것이고,
> 4) [[#6.7.7. Loading entire datasets.|6.7.7]] 과 [[#6.7.8. Cost of loading full datasets.|6.7.8]] 에 결론이 나온다.

#### 6.7.1. Is Parquet decompression fast enough?

- [[#6.6.3. In-memory Public BI decompression throughput.|Section 6.6.3.]] 의 그래프를 보다 보면 Parquet 를 사용했을 때 전부 throughput 이 50GB/s 를 넘는다는 것을 볼 수 있다.
- 이것은 [[#6.0.1. Test setup|Section 6.0.1.]] 에서 소개한 `c5n.18xlarge` instance 의 100Gbps (즉, 12.5GB/s) 네트워크를 고려하면, 무히려 네트워크가 병목이 되기 때문에 decompression throughput 이 아무리 좋아도 별 쓸데가 없다고 생각할 수 있다.
	- 생각해보면 맞는말인것 같긴 하다: 어차피 한 뭉탱이를 죽이는 속도로 decompression 한다고 해도, Data Lake 에서 가져오는 것이 느리기 때문에 가져오는 시간동안 기다리고 있어야 할테니까 결론적으로는 전체적인 throughput 은 네트워크 병목에 걸려버리는 것 아닐까?
- 근데 이것은 틀렸습니다.
- 왜? 인지 본 section 에서 알아보자.

#### 6.7.2 Decompression throughput and network bandwidth.

- 위 오해는 어떤 값의 단위만 보고, 그 값이 어떤 것을 대상으로 하는지 고려하지 않았기에 생긴 것이다.
- Decompression throughput 는 decompressed data 를 대상으로 한다.
	- 이것은 $T_{u} = DecompressedSize / DecompressionTime$ 으로 계산되기 때문.
- 하지만 network bandwidth 는 compressed data 를 대상으로 한다.
	- 네트워크를 통해 전송되는 것은 compressed data 이기 때문.
- 따라서 decompressed throughput 의 $DecompressedSize$ 는 네트워크와는 아무 상관이 없고, 진짜로 네트워크가 병목인지를 확인하기 위해서는 $CompressedSize$ 를 고려해야 한다.
- 따라서 새로운 metric $T_{c}$ 를 하나 다음과 같이 정의해 보자.

$$
T_{c} = CompressedSize/DecompressionTime
$$

- 이놈이 갖는 의미를 한 문장으로 요약해 보면 대략: "1초간 decompression 하기 위해 필요한 compressed data 의 양" 정도로 생각해 볼 수 있다.
- 이 값을 decompression throughput ($T_{u}$) 로 나타내 보면, decompression throughput 을 compression ratio 로 나눈 값이 된다.

$$
T_{c} = T_{u} * (CompressedSize / DecompressedSize) = T_{u} / CompressionRatio
$$

- 그럼 이 값이 갖는 상관관계를 생각해 보자.
	- 만약 이 값이 크다면:
		- 네트워크를 통해 전송해야 되는 양 ($CompressedSize$) 이 많거나 (= $CompressionRatio$ 가 크거나)
		- Decompression 에 소요되는 시간 ($DecompressionTime$) 이 적음 (= decompression 이 빠름 = $T_{u}$ 가 큼) 을 의미하는 것이다.
	- 이 값이 작다면 위와 반대의 경우겠지.
- 이 값을 network bandwidth 와 비교했을 때, 크거나 작은 경우에 대해 다음처럼 해석할 수 있다.
	- 만약 이 값이 network bandwidth 보다 크다면, 그것은 네트워크의 병목을 의미하는게 맞고, 따라서 이 BtrBlocks 가 제공하는 빠른 decompression 이 의미가 없다는 것은 설득력이 있다.
	- 하지만 이 값이 network bandwidth 보다 작다면, 그것은 네트워크가 아닌 CPU 에 병목이 있다는 것을 의미하고, 따라서 빠른 decompression 으로 CPU 에 부담을 줄여주는 BtrBlocks 은 정당성이 있다.
- [[#6.7.8. Cost of loading full datasets.|뒤]] 에서도 말할 결론을 미리 말하자면, 이 $T_{c}$ 값은 network bandwidth 보다 작았다. 즉, 기존 Parquet 를 사용했을 때의 문제는 network bottleneck 이 아니라 CPU bound 에 기인한 것이 맞았다는 소리이다.

#### 6.7.3. Measuring end-to-end cost.

- S3 scan 과 관련된 지출은 크게 두가지로 나눌 수 있다.
	1) 당연히 scan 을 수행할 EC2 인스턴스가 필요하다. 실험에 사용된 `c5n.18xlarge` 인스턴스 기준, 시간당 $3.89 가 필요하다.
	2) S3 에 대해서는, 1000개의 `GET` 요청 당 $0.0004 가 지출된다.
		- 이때, 응답으로 오는 데이터의 크기는 상관없다. 이는 아마 한번의 응답에 전송되는 데이터의 크기가 제한되어 있기 때문이리라.
- 따라서 scan 에 소모되는 지출은 (1) decompression time 과 (2) request count 를 통해 구할 수 있다.
- 이 실험에서 S3 `GET` response 의 데이터 사이즈는 16MB 이다.
	- 이건 S3 에서 최대의 대역폭을 얻기 위해서는 한번에 8MB 혹은 16MB 크기의 *chunk* 를 받는 것이 좋다는 권고사항에 따른 것이다.
	- 따라서 BtrBlock 의 경우에는, 총 사이즈가 16MB 에 근접하도록 여러 block 을 묶은 chunk 를 받는다.
	- BtrBlock 과 비교하기 위한 Parquet 의 경우에는:
		- 당연히 이놈도 여러 파일로 나눠서 저장하는데, 각 파일의 사이즈를 조정하는 것이 불가능했다.
		- 각 파일의 크기는 5.5 ~ 24MB 정도 되고 마찬가지로 이것을 16MB 에 근접하게 맞춘 chunk 를 받는다 [^parquet-file-size].
- 또한 어떤 데이터셋의 경우에는 크기가 너무 작아 의미있는 throughput 측정이 불가능했다고 한다.
	- 그래서 CSV 파일의 크기가 6GB 이하인 table 의 경우에는 실험에서 제외했다.

#### 6.7.4. End-to-end cost test setup.

- 전체적으로는 S3 C++ SDK 를 통해 S3 로부터 chunk 를 받은 뒤, 메모리 상에서 decompression 을 하는 것으로 구성된다.
- S3 C++ SDK 는 stream 이라는 것을 사용하는데, 이것이 별로 효율적이지도 않고 메모리에 있는 데이터를 decompression 하는 것을 분리하여 측정하기 위해, 별도의 memory pool 을 직접 구현했다고 한다 [^memory-pool].
	- 여기서는 나름의 삽질을 한 결과, S3 로부터 받은 chunk 하나 당 하나의 thread 를 생성해 처리하는 것이 효율적인 것을 알아내 그렇게 구현되어 있고,
	- S3 에 요청을 보내는 것은 비동기적으로 이루어져 보낸 뒤에 global queue 에 넣는 식으로 구현해 최대 대역폭을 낼 수 있도록 했다고 한다.

#### 6.7.5. Loading individual columns.

- OLAP query 에서는 전체 table 을 전부 읽는 경우는 거의 없고, 여러 테이블에서 여러 column 들을 골라 읽게 된다.
- 따라서 각 column 을 S3 에서 가져와 decompression 하는 실험을 진행하였다.
	- 실험은 PBI 에서 사이즈가 가장 큰 5개의 데이터셋을 대상으로 random query 를 해 해당 query 에서 필요로 하는 column 만을 S3 에서 불러들여 decompression 하는 식으로 진행됐다.
- 결과적으로 BtrBlock 은 다음의 비용을 절감하는 것으로 보였다고 한다.
	- PBI 데이터셋 기준: Parquet + Compression 한것에 비해 9배, Vanilla Parquet 에 비해서는 20배 더 저렴하고
	- TPC-H 기준: Parquet + Snappy 기준 3.6배, Parquet + Zstd 기준 2.8배, Parquet 기준 5.5배 더 저렴한것으로 보였다고 한다.
- 다만 여기서 "보인다" 라는 워딩에 집중하자. [[#6.7.6. Cost comparability.|다음 section]] 에서 설명하겠지만, 이 실험 결과는 BtrBlock 의 디자인에 기인한 것이 아닌, 다른 곳에 원인이 있다.

#### 6.7.6. Cost comparability.

- 위에서도 살짝 언급한 것처럼, 위의 실험 결과는 BtrBlock 의 디자인 때문이 아닌 metadata handling 때문에 성능 차이가 나는 것이다.
- 우선 Parquet 의 metadata handling 을 보자.
	- Parquet 에서는 여러 column 을 하나의 Parquet file 로 만들고, column offset (column 들을 구분하는 delimiter 라고 생각하자.) 를 file 맨 뒤에 metadata footer 로 달아놓는다.
	- 따라서 이러한 구조의 Parquet file 에서 하나의 column 을 가져오는 것은 다음과 같은 세번의 요청으로 수행할 수 있다.
		1) Metadata footer 의 길이를 읽어오고,
		2) 그 길이만큼의 데이터를 읽어 metadata footer 자체를 읽어오고,
		3) 그 metadata footer 를 통해 원하는 column 이 어디부터 어디까진지 알아내어 column data 를 읽어온다.
	- 이렇게 하거나, 아니면 그냥 Parquet file 전체를 읽어온 다음에 column 을 분리해내는 방법을 사용할 수 있고, 이 방식이 때로는 위의 방식보다 더 빨랐다고 한다.
- 하지만 BtrBlock 은 다른식으로 metadata 를 handling 한다.
	- BtrBlock 은 Parquet 와 다르게, 하나의 column 으로 file 을 만든다.
	- 그리고 metadata 는 별도의 file 로, table 당 하나를 생성한다.
- 이렇듯 metadata handling 이 두 format 간에 차이가 있고, 이 차이점이 유발하는 [[#6.7.5. Loading individual columns.|위]] 와 같은 실험 결과는 논리적이지 못한 것.
- 다만, [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.1.3. Metadata & Statistics|Section 2.1.3.]] 에서도 언급한 것처럼, 이러한 metadata handling 은 본 논문에서 다루고자 하는 논지가 아니다.
- 따라서 실제 OLAP query 의 처리 과정과는 다르더라도, 객관적인 비용 비교를 위해 다른 방식으로 실험을 진했다고 한다.

#### 6.7.7. Loading entire datasets.

- 따라서 [[#6.7.5. Loading individual columns.|위]] 에서처럼 각 column 을 load 하는 방식이 아닌, 데이터셋 전체를 load 하여 computing time 과 request cost 를 측정했다.
	- 이렇게 함으로써 metadata handling 을 생략할 수 있고, decompression speed 에만 집중할 수 있었다.
- 방식은 [[#6.7.5. Loading individual columns.|위]] 에서의 5개의 데이터셋을 각각 10,000 번씩 load + decompression 하여 그때의 cost 를 측정하는 것으로 이루어졌다.

#### 6.7.8. Cost of loading full datasets.

![[Pasted image 20240726104929.png]]

- 위 표가 최종 실험 결과이다.
	- Cost 에 대해서는, Parquet 에 비해서는 대략 2.6배, Parquet + Compression 에 비해서는 대략 1.8 배 정도 저렴한 것을 알 수 있다.
	- 그리고 $T_{c}$ 에 대해서는, BtrBlock 이 제일 높게 나온 것과, 전부 다 `c5n.18xlarge` 의 network bandwidth limit 인 100Gbps 보다 작은 것을 확인할 수 있다.
		- 다만, 이 "100Gbps" 라는 수치는 spec 에 따른 것이고, 실제로는 그것보다 더 작을 수도 있다.
		- 따라서 EC2 <-> S3 간 대역폭을 측정해 보았고, 결과는 91Gbps 정도로 여전히 위 표에 제시된 것들보다는 큼을 알 수 있다.
	- 이 $T_{c}$ 의 결과를 통해 [[#6.7.2 Decompression throughput and network bandwidth.|6.7.2]] 에 나온 의혹을 잠재울 수 있다.
		- 즉, Parquet 에 문제가 있는 것이 아닌 network bandwidth 가 작기 때문이 아니냐는 의혹은,
		- 실제로는 위의 결과가 시사하는 바에 따라 network bandwidth 를 최대로 사용하고 있지 않음을 확인할수 있다.
		- 따라서 결론적으로 network bandwidth 가 아닌 Parquet 가 유발하는 CPU bound 가 문제인 것.
- 이것을 그래프로 표현한 것이 [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (1. Abstract, Intro)#1.4. BtrBlocks|Section 1.4.]] 에 등장한 아래의 그래프이다.

![[Pasted image 20240717164138.png]]

- 가로축은 이 $T_{c}$ 값을 나타내고 (S3 scan limit 이 91Gbps 에 그어져 있는 것을 확인할 수 있다.)
- 세로축은 Scan cost 을 역수로 바꿔 $1 당 수행할 수 있는 scan 을 나타낸 것이다.
- 마지막으로, 위의 실험에는 단순히 load + decompression 만 포함되어 있고, query processing 은 포함되어 있지 않기 때문에, BtrBlock 으로 실제로 절감되는 비용은 이것보다 더 클 것이라고 한다.

### 6.8. Result Discussion

#### 6.8.1. Is BtrBlocks only fast because of SIMD?

- [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (5. Fast decompression)|Section 5.]] 에는 SIMD 를 활용한 low-level optimization 이 많이 들어가 있는 것을 확인할 수 있다.
- 그러면 자연스레 "BtrBlock 이 아닌 SIMD 에 의해 이런 성능 향상이 있었던 것이 아니냐" 라는 의문이 들 수 있다.
	- 즉, SIMD 만으로 이뤄낸 성능 향상이라면 BtrBlock 을 사용할 필요 없이 그냥 Parquet 에 SIMD 를 적용하면 되기 때문.
- 따라서 SIMD 를 사용하지 않는 버전도 만들어서, [[#6.6. Decompression|Section 6.6.]] 의 실험을 반복해 봤다고 한다.
- 결과는 SIMD 를 사용했을 때에 비해 17% 정도 성능 하락이 있었지만, 그럼에도 불구하고 Parquet variant 에 비해 2.3배 더 빨랐다고 한다.

#### 6.8.2. Update the standard or create a new format?

- 당연히, Parquet 와 같은 널리 사용되는 format 에 BtrBlock 이 녹아들어가는 것이 좋다.
	- 그럼 사용자 입장에서는 이 BtrBlock 에서의 이점을 누리기 위해 data migration 을 하거나,
	- 관련된 코드를 고칠 일이 없을 것이기 때문.
- 하지만 [[#6.8.1. Is BtrBlocks only fast because of SIMD?|Section 6.8.1]] 이 보여주고 있는 것과 같이, SIMD 와 같은 low-level optimization 만으로는 불충분하고, high-level design 이 바뀌어야 하기에 Parquet 에 흡수된다 한들 version compatibility 문제가 생길 것이다.
- 따라서 이런 알려진 format 에 통합하기 보다는, 지금으로서는 BtrBlock 을 open source 로 공개해 추후에 통합하는 방법을 찾아 보는 것으로 마무리 지었다고 한다.

[^rowgroup-column-decompression]: #draft Parquet 의 구조가 아직 파악이 안돼서 그런 것 같은데, 저 둘을 병렬적으로 decompression 한다는게 어떤건지 감이 안온다.
[^compression-ratio]: #draft 단위가 뭔지 모르겠다. 이것도 코드 보고 확인해야 할 듯.
[^numeric-range]: 원문에는 *Numeric range*, *One size range* 라는 말로서 표현되는데, 이것이 정확히 어떤 의미인지는 파악이 안된다.
[^system-a-d]: #draft 원문상에도 System A~D 로만 표현되어 있고, 어떤 솔루션인지는 정확하게 나와있지 않다. 아마 proprietary system (cloud data warehouse solution) 인듯. 코드 뒤지다 보면 찾을 수 있을지도 모르겠다.
[^pde-commongov]: #draft 얘네들은 도대체 뭐가 좋아서 무친듯이 뛰는건지 확인해 볼 필요가 있다.
[^orc-mem-readfile]: #draft 메모리로부터 파일을 직접 읽어오는 것이 어떤 의미인지 모르겠다. 대강 memory buffer 에 우선 파일을 올려놓은 뒤에 벤치를 돌리고 싶은데 그러지 못한다는 얘기인것 같은데, 코드 보면서 확인해야 할 듯.
[^parquet-file-size]: 본문에는 BtrBlock 처럼 16MB 로 맞춰서 받는 이야기는 없다. 주인장의 예상임.
[^memory-pool]: #draft 이쪽 전반이 감이 잘 안온다. 코드 보면서 파악해야 될 것.