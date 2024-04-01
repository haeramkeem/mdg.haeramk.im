---
tags:
  - 용어집
  - Database
  - RocksDb
---
> [!info] 참고한 것들
> - [RocksDB 공식 문서](https://github.com/facebook/rocksdb/wiki/Leveled-Compaction)
> - [ZNS: Avoiding the Block Interface Tax for Flash-based SSDs (USENIX ATC '21)](https://www.usenix.org/system/files/atc21-bjorling.pdf) 의 4.2 섹션

> [!info] 이미지 출처
> - 별도의 명시가 없으면, [RocksDB 공식 문서](https://github.com/facebook/rocksdb/wiki/Leveled-Compaction) 에서 갖고왔습니다.

## 뭔데이게

- RocksDB 의 *Leveled Compaction* 의 가장 핵심 목적은 다음과 같다:
	- 파일들은 *Level* 이라는 단위로 그루핑 되어 관리되는데,
	- 이 *level* 공간이 부족할 경우에 더 큰 사이즈의 다음 *level* 로 파일을 내려보내
	- 항상 해당 *level* 의 공간이 넘치지 않게 하는 것이다.
- 이제 이 *Level* 이 뭔지, 어떻게 *Compaction* 과정이 진행되는지 아래에서 자세히 살펴보도록 하자.

## Level-based File Structure

![[Pasted image 20240330145635.png]]

- 일단 RocksDB 는 key-value 데이터 파일들을 *Level* 이라는 것으로 묶어서 관리한다.
- 이 Level 은 다음과 같은 특징이 있다.

### 1. Level Size

![[Pasted image 20240330145804.png]]

- *Level* 은 정해진 size limit 이 있고, 하위 level 로 내려갈수록 이 limit 은 커진다. (exponential 하게 증가)
	- 위에서 말한 것 처럼 이 size limit 을 넘지 않도록 key-value 데이터 일부를 하위 level 로 내려보내는 작업이 compaction 인 것.

### 2. Sorted Run

![[Pasted image 20240330150941.png]]

- 각 level 에 포함된 key-value 데이터들은 key 를 기준으로 중복 없이 정렬되어 있다.
	- 이것을 공식문서에서는 *"Sorted Run"* 이라고 표현하더라
- 다만 이 key-value 데이터들을 하나의 파일에 전부 다 때려박는 것은 아니고 여러개의 파일들로 나누어 저장된다.
	- 따라서 각 파일 또한 key-value 데이터를 key 를 기준으로 중복 없이 정렬해서 저장하고 있고, 이러한 파일들을 가리켜 *Sorted String Table (SSR)* 파일이라고 부른다.

> [!note] 주인장의 한마디
> - 이러한 SST 의 구조는 여러 프로그래밍 언어에서 찾아볼 수 있는 Map 와 유사하다고 생각할 수 있다.
> - 가령 [C++ std::map](https://en.cppreference.com/w/cpp/container/map) 의 경우에도 unique key 에 대해 정렬된 형태를 띄기 때문.

- 특정 Key 가 어떤 SSR 파일에 존재하는지는 Binary Search 로 알아낸다.
	- 어차피 모든 데이터가 정렬되어 있기 때문.

### 3. Level 0

- 다만, 위의 (1), (2) 의 특징들은 Level 0 (L0) 에는 적용되지 않는다.
- L0 은 Memory 에서 flush 된 [[Write Ahead Log, WAL (Database)|WAL]] 파일들이 그대로 담겨 있다. (즉, 정렬 및 중복제거가 되어 있지 않다.)
	- Flush 는 주기적으로 수행하거나 memory 공간이 다 찼을 경우 수행한다고 한다.
- L0 에서는 파일들의 개수가 `level0_file_num_compaction_trigger` 라는 값에 도달했을 때 L1 으로 내려간다.

## Compaction

- Compaction 과정을 간단히 설명하면, 한 level 의 파일을 다음 level 로 내려보내고, 재정렬하는 것이다.

### Level 1~n Compaction

- 우선 


---
---
---

- LSM tree 는 여러개의 level 로 구현되고, 이 중 L0 은 메모리 안에 저장되고, 나머지는 storage 에 저장된다.
- 우선 L0 에서의 작동 과정을 보고 가자.
	- Key-value 데이터 쌍은 새롭게 추가되거나 변경될 경우 우선 L0 에 반영되게 되는데,
	- 구체적으로는 [[Write Ahead Log, WAL (Database)|WAL]] 으로 메모리에 저장되는 식으로 반영된다.
	- 그리고 이들은 주기적 혹은 메모리 공간이 다 찼을 경우 storage 에 저장하기 위해 flush 를 하여 하위 level 로 내려간다.
	- Flush 과정중에는 중복을 제거하고 Key 를 기준으로 정렬되어서 Sorted String Table (SST) 형식으로 SSD 에 저장된다.
		- 따라서 하나의 SST 는 중복되지 않고 key 를 기준으로 정렬된 key-value 쌍들로 구성된다.


- 그럼 flush 과정을 거쳐 L1 로 내려간 이후에는 어떻게 될까.
	- 우선 각 level 은 상위 level 의 배수의 사이즈이고 여러 SST 가 저장된다.
	- SST 파일을 다음 level 로 내려보내는 것은 *Compaction Process* 를 통해 수행된다.
	- *Compaction Process* 는 한 level 의 key-value 쌍들을 다음 level 의 key-value 쌍들로 합치는 과정을 의미하는데, 다음과 같이 진행된다.
		1. 우선 해당 level 의 하나 이상의 SST 에서 key-value 쌍들을 읽어 온다.
		2. 또한 다음 level 의 하나 이상의 SST 에서도 key-value 쌍들을 읽어 온다.
		3. 이후 이들은 하나의 SST 로 합쳐져 다음 level 의 하나의 SST 파일로서 저장된다.

> [!note] 주인장의 한마디
> - 우선 언제 SST 파일을 다음 level 로 내려보내기 위해 compaction 을 진행하는지는 본문에서 

- compaction process 에 의해 한 level 의 key-value 쌍은 다음 level 의 key-value 으로 합쳐진다.
- compaction process 에서는, 한 level 의 여러 SST 에서 key-value 쌍을 읽어온 다음, 다음 level 의 여러 SST 의 key-value 쌍들과 합쳐진다.
- 합쳐진 결과는 새로운 SST 파일에 저장되고 LSM tree 상에의 merged SST 를 대체한다
- 이 결과로 SST 파일은 변경되지 않고, sequential write 되며, 하나의 덩어리로 생성/삭제되게 된다.
- 또한, key-value 쌍이 다음 level 로 합쳐지기 때문에 hot-cold separation 도 달성된다.
