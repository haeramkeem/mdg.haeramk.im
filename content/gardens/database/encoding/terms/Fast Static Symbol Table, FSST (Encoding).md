---
tags:
  - Database
  - db-encoding
date: 2024-07-30
---
> [!info]- 참고한 것들
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.6 FSST|BtrBlocks - Efficient Columnar Compression for Data Lakes, SIGMOD'23]]

> [!info] 원본 논문
> - 이 글은 [FSST: Fast Random Access String Compression, VLDB'20](https://dl.acm.org/doi/pdf/10.14778/3407790.3407851) 에서 핵심 아이디어만 요약한 글입니다.
> - 별도의 명시가 없으면, 본 논문에서 그림을 가져왔습니다.

## FSST

- 이건 2020년 VLDB 에 소개된 string compression 방법이다.
- 방식은 "치환" 이라는 점에서 [[Dictionary Encoding (Encoding)|Dictionary Encoding]] 이랑 비슷한데, 좀 차이점이 있다. 더 자세한 내용은 아래에서 설명해 주마.
- FSST 의 특징은 이름이 시사하는 바처럼, (1) *Symbol Table* (2) *Fast*, (3) *Static* 이다.

### 특징 1) Symbol Table

![[Pasted image 20240730143409.png]]

- 이 *Symbol Table* 은 한마디로 정리하면, *Frequency-based substring substitution* 이다. 이게 뭔뜻인지 알아보자.

#### Substring-substitution

- *Dictionary* 가 개별 string [[Relation (Relational Model)#Tuple, Domain|domain]] 와 code 간의 mapping 이었다면,
- FSST 의 *Symbol Table* 은 최대 8byte (8 chars) 길이의, string domain 내의 substring (이것을 *Symbol* 이라고 부른다) 과 1byte code 간의 mapping 이다.
	- 위 그림 보면 쉽게 이해된다: `http://in.tum.de` 가 세 개의 *Symbol* (`0:"http://"`, `6:"in.tum"`, `3:".de"`) 을 이용해 `063` 으로 표현되는 방식이다.
- 이 substring-substitution 방식은 실제 데이터를 관찰했을 때 비슷하지만 다른 문자열들이 많다는 결론에서 나온 것이다.
	- 이런 점에서 domain 전체에 대한 exact match 를 요하는 dictionary 에 비해 더 효율적으로 compression 이 가능하다.

#### Frequency-based

- *Symbol Table* 의 code 는 1byte 이고, 따라서 모든 *Symbol* 이 담기는 것이 아니라 가장 빈도가 높은 255개만 담긴다.
- 근데 왜 256개가 아니고 255개일까? 이건 *Escape* 를 위해 code 하나 (`255`) 는 reserved 해놓았기 때문이다.
	- *Symbol* 의 개수가 255 개로 고정되어 있기 때문에, 분명히 어떤 놈은 이 *Symbol* 들로는 표현되지 않을 것이고, 그런 놈들을 처리하기 위해 *Escape* code `255` 가 있는 것.
	- *Escape code* 뒤에는 문자 하나 (1byte) 가 오고, decompression 도중 이 *Escape code* 를 만나면 *Symbol Table* 에서 symbol 을 찾는 것이 아닌 바로 다음에 오는 이 문자를 result 에 넣는다.

### 특징 2) Fast

- *Symbol Table* 을 보고 값을 치환하면 되기 때문에, decompression 과정이 아주 빠르다.
- 논문에는 이걸 더 빠르게 하기 위해 [[Single Instruction Multiple Data, SIMD (Arch)|SIMD]] 와 같은 더 많은 최적화가 설명되어 있다. 궁금하면 직접 읽어보시라.

### 특징 3) Static

- 이 *Symbol Table* 은 생성된 뒤에는, compression 및 decompression 과정에서 변경되지 않는다 (즉, *Static* 하다).
- 이건 Compressed data query 가 가능하다는 장점이 있다.
	- Block (string domain 의 sequence) 이 compressed 되어 있기 때문에, 여기에의 데이터를 가지고 꼼지락대고 싶다면 이것을 먼저 decompression 해야 하지만,
	- 개별적으로 *Symbol table* 을 이용해 치환하면 부분적으로도 decompression 이 가능하기 때문에, 전체를 decompression 하는 overhead 를 없앨 수 있다.
	- 혹은, 역으로 상대방을 compression 하는 방법도 사용할 수 있다.
		- 가령 `WHERE` 절의 `=` 연산자로 문자열 비교를 하는 상황이라고 해보자.
		- 그럼 compressed domain 을 decompression 하여 비교할 수 있지만,
		- 비교하고자 하는 uncompressed value 를 compression 하여 비교하는 것도 가능하다는 소리.
	- 이건 유일한 "상태" 인 *Symbol Table* 이 변경되지 않는다는 특징에 기반을 두고 있다. 하지만 LZ4 와 같은 애들은, compression 과 decompression 과정에서 이런 "상태" 가 바뀌기 때문에, 이런 compressed data query 를 사용할 수 없다.

## Compression: Generating Symbol Table

- 그럼 딱 봐도 이 *Symbol Table* 을 어떻게 만드느냐에 따라 성능이 크게 좌우된다는 것을 알 수 있다. 그럼 이 문제의 *Symbol Table* 을 만드는 방법에 대해 알아보자.

### Pseudo-code

- Pseudo code 설명 없이 해보려 했는데, 도저히 안돼서 짚고 넘어가야겠다.

#### Member variables

![[Pasted image 20240731231714.png]]

- `nSymbols` 는 현재 symbol 의 개수이다.
- `symbols` 는 모든 symbol 들을 모아놓은 배열이다.
	- 여기서 앞 256 개는 *Pseudo-symbol* 이라고 하고, 해당 index 에 대응되는 ASCII 문자가 들어가 있다.
		- 얘네는 escape 된 byte 를 일컫는다.
		- 여기서 볼 수 있듯이, escaped single byte 는 문자열에 등장하는 애들뿐만이 아닌 모든 문자들이 symbol 로서 등록되는 것을 알 수 있다.
	- 그리고 뒤의 256 개는 진짜 symbol 이다. 즉, `nSymbols` 는 이 "진짜 symbol" 의 개수를 의미한다.
- `sIndex` 는 "어떤 문자" 로 시작하는 symbol 이 위치한 시작 index 들을 저장하는 놈이다.


![[Pasted image 20240731231740.png]]

- 논문에 나온 `tumcwitumvldb` 예시를 보자.

### Example
#### Init

![[Pasted image 20240731155052.png]]

- 우선 처음에는 symbol table 이 비어있는 상태고, 따라서 현재 아무 symbol 도 없다.

#### Iteration 1

![[Pasted image 20240731155210.png]]

- 우선, 기존의 symbol table 로 corpus 를 encoding 한다.
	- 근데 지금은 symbol table 이 비어있기 때문에, 모든 문자가 escape (`$` 표시) 된다.
	- 따라서 이때의 encoding 결과 길이는 26 이 된다.
- 그리고 symbol 들의 count 를 계산한다.
	- Count 를 계산하는 것은 다음과 같이 된다:
		- 연속된 두 symbol 
	- Pseudo-symbol
	- Symbol
	- Symbol + Pseudo-symbol
	- Symbol + Symbol

![[Pasted image 20240731155433.png]]

![[Pasted image 20240731155508.png]]

![[Pasted image 20240731155532.png]]

![[Pasted image 20240731155611.png]]

[^arbitrary]: 실제 구현에는 사전순서 (Lexicographical order) 로 되어 있다. 하지만 예시에서는 이 사전순대로 정렬되어 있지는 않다.