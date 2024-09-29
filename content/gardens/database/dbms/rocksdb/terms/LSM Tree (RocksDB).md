---
tags:
  - terms
  - database
  - rocksdb
date: 2024-04-14
aliases:
  - LSM
---
> [!info]- 참고한 것들
> - [RocksDB 공식 문서 - Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)
> - [RocksDB 공식 문서 - Leveled Compaction](https://github.com/facebook/rocksdb/wiki/Leveled-Compaction)

> [!info] 그림 출처
> - 별도의 명시가 있지 않는 한, 그림들은 [RocksDB 공식문서](https://github.com/facebook/rocksdb/wiki/Leveled-Compaction) 에서 가져왔습니다.

> [!warning] 내용의 범위
> - 본 글의 내용은 [[Log Structure Merge Tree, LSM Tree (Data Structure)|LSM Tree]] 의 RocksDB 구현체를 기준으로 설명합니다. Patrick O'Neil 의 논문 및 LSM 의 이론적인 내용은 여기 담겨있지 않습니다.

## 기본 아이디어

- LSM 의 기본 아이디어는 다음과 같다:

1. *Log-structured (sequential write)* 를 통해 write 성능을 개선한다.
	- 일반적으로 sequential write 는 write 성능을 개선하는 것으로 알려져 있다. ([[(논문) The design and implementation of a log-structured file system|참고 사례 - LFS]])
2. *Sorting + Level* 을 통해 read 를 최적화 한다.
	- Sorting 되어 있으면 binary search 를 통해 key 에 대한 value 를 빨리 찾을 수 있기 때문.
3. *Compaction* 을 통해 log-structured 에서 발생하는 데이터 중복 문제를 해소한다.

### Log-structured, Sequential Write

- 위에서 말한 것 처럼, 모든 key-value pair 는 sequential write 된다.
	- Update 는 in-place update 가 아닌, 새로운 pair (기존의 key + 새로운 value) 를 sequential write 하면 된다.
	- Delete 또한 in-place delete 가 아닌, 데이터가 지워졌음을 알리는 특별한 pair (기존의 key + 특별한 value) 를 sequential write 하면 된다.
		- 이때의 특별한 value 를 *Tombstone (묘비)* 라고 부른다.

### Sorting and Leveled Architecture

- 그럼 이때 read (retrieval; key 에 대한 value 를 읽어오는 것) 은 어떻게 하면 좋을까.
	- 우선 가장 간단하게는 Linear Search 를 시도해 볼 수 있다.
		- 즉, pair 가 sequential write 되어 있기 때문에, 반대 방향으로 linear search 를 하며 key 에 대한 가장 최신의 value 를 읽어오면 되지 않을까.
		- 하지만 이 방법은 너무 느리다. $O(N)$ 이기 때문.
	- 아니면 hash map 을 사용하는 방법도 있다.
		- Key 에 대한 가장 최신의 value 주소를 메모리상에 hash map 으로 관리하면 이런 search 과정 없이 바로 디스크에서 value 를 읽어올 수 있을 것이다.
		- 하지만 이 방법은 key 가 많아질 경우 메모리 공간을 너무 많이 잡아먹는다는 단점이 있다.
	- 결국에는 시간과 공간 간의 trade-off 가 있는 셈이다.
- 이것을 LSM 에서는 Sorting 과 Level 로 해소한다.
	- Sorting 을 하면 binary search 로 pair 를 찾을 수 있기 때문에 linear search 보다는 빠르고, hash map 을 사용하는 것보다는 메모리를 절약할 수 있기 때문.
	- 다만 sorting 을 한다는 것은 sequential 하지 않다는 것을 의미한다.
	- 이를 위해 LSM 에서는 level 이라는 단위로 sorting 을 하고, 각 level 을 sequential write 하여 sorting 과 sequential 를 조화시킨다.

> [!tip] Level 과 Sequential write
> - 지금은 이해를 위해 Level 단위로 Sequential write 가 된다고 설명했지만, 실제 작동 방식은 조금 더 복잡하고, 명확하게 말하자면 level 단위의 sequential write 는 틀린 얘기이다.
> - 더 구체적인 얘기는 아래에서 하도록 하고 지금은 최신의 key-value pair 는 상위 level 에, 오래된 pair 는 하위 pair 에 위치한다는 것만 알고 넘어가자.

- 이 방식에서 read 는 다음처럼 수행할 수 있을 것이다.
	- 최신의 pair 는 상위 level 에 있기 때문에 상위 level 에서부터 binary search 를 수행해 pair 가 있는 지 찾고, 없다면 다음 level 로 넘어가며 read 를 하면 되지 않을까.
	- 아니면 다음 level 로 넘어가며 level 간 linear search 를 하는 대신에, [[Sparse Index (Data Structure)|sparse index]] 등을 이용하여 더욱 최적화 할 수도 있을 것이다.

### Compaction Process

- 근데 이렇게 sequential write 하다 보면 분명히 용량이 부족해지는 나날이 온다.
- 이 상황에서 지울만한 데이터를 생각해 보면, 하나밖에 떠오르지 않을 것이다: 최근에 update 되어서 outdated 된 옛날의 key-value pair.
- 따라서 주기적으로, 혹은 적당한 조건이 충족되었을 때 *Compaction* 을 수행하며 최근의 pair 만 남기고 이전의 중복된 pair 들은 싹 정리해 주는 과정을 거친다.

## 실제 구조

- 자 그럼 위의 아이디어들이 실제로는 어떻게 되어 있는지 확인해 보자.

### Level-based File Structure

![[Pasted image 20240330145635.png]]

- 위에서 말한 Level 은 실제로 위와 같은 모습을 띄고 있다.
	- 헷갈리지 말자: Level 은 번호가 작을수록 상위 Level 이다.
- 이 구조를 Top-down 으로 살펴보자.

#### 최상단: Memtable

- 우선 제일 위에는 ==*[[Memtable (RocksDB)|Memtable]]* 이라는 인메모리 write buffer== 가 있다.
	- 즉 어떤 key-value pair 가 write 되면, 일단 제일 먼저 이곳에 저장되고, 추후에 디스크로 flush 되는 것.
- 이 memtable 은 RocksDB 에서는 기본적으로 [[Skip List (Data Structure)|skiplist]] 로 구현되고, append-only 로 작동한다.
	- 왜 굳이 메모리에 있는데 append-only 일까? 라는 생각이 든다면 [[Memtable (RocksDB)|Memtable]] 문서에서 더 자세한 내용을 확인하자.
#### Static Sorted Table (SST)

- Memtable 에 있던 key-value 쌍들은 디스크에 flush 될 때, SST 라는 파일로 저장된다.
- ==*[[Static Sorted Table, SST (RocksDB)|Static Sorted Table (SST)]]* 는 key 를 기준으로 중복 없이 정렬되어 있고, 수정이 불가능한 key-value pair 들의 모음 파일==이다.

#### Level 0 (L0)

- 이렇게 ==Memtable 에 있던 내용이 SST 가 되어 처음으로 디스크에 저장되는 장소가 *Level0 (L0)*== 이다. 
- 이 level 은 다른 level 들과는 다른 특별한 공간이다.
	- 아래에서 설명할 [[#Level Size Limit]] 이나 [[#Sorted Run]] 은 level 에 적용되지 않는다.
	- 즉, Memtable 에서 L0 로 내려올 때는 그냥 SST 로 변환되어 내려오기만 하고, SST 간의 key 중복 혹은 key 범위 겹침 등은 얼마든지 가능하다.
- 여기에 있던 SST 들의 개수가 `level0_file_num_compaction_trigger` 에 도달하면 모든 SST 가 [[#Compaction]] 을 통해 다음 level 로 내려간다.

#### Level 1 ~ MAX (L1 ~ LMAX)

- 이 레벨들은 크기는 다르지만, 공통된 특징을 지닌다. 하나씩 살펴보자.

##### Level Size Limit

![[Pasted image 20240330145804.png]]

- 각 *Level* 은 정해진 size limit 이 있고, 하위 level 로 내려갈수록 이 limit 은 커진다.
	- 기본적으로 Exponential 하게 증가한다고 생각하면 된다.
- 그리고 만약 이 size limit 을 넘게 되면, [[#Compaction]] 이 진행되어 넘친 데이터를 아래로 내려보내게 된다.

##### Sorted Run

![[Pasted image 20240330150941.png]]

- 각 level 은 [[Sorted Run (Data Structure)|Sorted Run]] 이다.
	- 즉, level 을 구성하는 SST 들 간에는 중복된 key 가 존재하지 않고, key 의 범위도 겹치지 않는다.
- 이렇게 함으로써 level 내에서는 binary search 로 원하는 key-value pair 를 빠르게 잡아낼 수 있다.
	- 일단 각 SST 의 시작 혹은 끝 key 들을 모아 binary search 를 하여 원하는 key 가 어느 SST 에 있는지 찾고,
	- 해당 SST 내에서 또 binary search 하여 요놈잡았다 를 하는 것.
- 그런데 어떻게 이것이 가능할까? 상위 level 에서 SST 가 내려오면 분명히 내려온 SST 와 원래 있던 SST 간에는 중복된 key 들도 있을 것이고, 범위도 겹칠텐데, 어떻게 이런 sorted run 상태를 유지할 수 있을까?
	- 정답은 [[#Compaction]] 에 있다.

## R/W Operation

- 위에서도 중간중간 설명하긴 했지만, 이 구조에서 어떻게 R/W 를 수행하는지 총정리를 해보자.

> [!fail]- #draft 추후에 작성할 예정입니다.
> - [x] 내용 정리
> - [ ] R/W 과정 정리