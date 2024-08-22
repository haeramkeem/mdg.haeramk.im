---
tags:
  - 용어집
  - database
  - rocksdb
date: 2024-04-14
---
> [!info]- 참고한 것들
> - [RocksDB 공식문서](https://github.com/facebook/rocksdb/wiki/MemTable)

## Memory Table, Memtable

- [[LSM Tree (RocksDB)|RocksDB 의 LSM]] 에서의 in-memory buffer 공간을 일컫는다.
- 어떤 key-value pair 가 write 되면, 일단 제일 먼저 이곳에 저장되고, read 도 이 공간을 제일 먼저 찾아보게 된다.
- 여기의 내용은 추후에 memtable 이 꽉 차는 등의 조건이 맞으면 디스크로 flush 된다.

## Mutable, Immutable memtable

- 디스크로의 flush 과정을 좀 더 세분하게 살펴보자: 메모리 공간에는 *Mutable memtable* 과 *Immutable memtable* 이 있다.
- 일단 ==인메모리 write buffer 로 사용되는 공간은 mutable memtable== 이고, 여기에 데이터들이 write 된다.
- 그리고 ==해당 공간이 다 차게 되면 일단 인메모리에서 immutable memtable 로 전환되고, 추후에 flush== 되는 것.

## Default Policy

### Skip List

- 일단 Memtable 의 구현은 [[Skip List (Data Structure)|Skip list]] 로 되어 있어서 read 작업은 $O(log(N))$ 으로 수행된다.
	- Memtable 에 다른 자료구조를 사용할 수도 있다. 하지만 default 로는 skiplist 를 사용하도록 되어 있고, 지원하는 기능도 이게 더 많다.
	- 가령, 바로 아래에서 설명할 concurrent 기능도 skiplist 에서만 사용 가능하다.

### Append-only, `allow_concurrent_memtable_write` Option

- 그리고 여기서의 update 는 in-place 가 아닌 append only (out-place) 로 이루어 진다.
	- 왜 디스크도 아니고 메모리 공간에 있는 memtable 을 굳이 append only 로 작동하게 만들었을까 의문을 가질 수도 있는데
	- 이것은 concurrent write 를 가능하기 하기 위함이다.
	- In-place update 의 경우에는 여러 thread 가 접근했을 경우에 lock 을 걸며 write 해야 하기 때문에 concurrent 가 불가능하지만
	- Append only 를 하면 굳이 이러지 않아도 되기 때문.
	- 물론 위 내용은 default 설정을 말하는 것이다
		- Default 로는 concurrent write (`allow_concurrent_memtable_write: true`) + append only (`inplace_update_support: false`) 지만, concurrent 를 비활성화 하고 in-place 를 활성화 할 수도 있다.

### Internal Key

- 그럼 skiplist 에서 어떻게 append only 를 할 수 있을 까. 이것은 internal key 를 이용해서 수행한다.
	- 외부적으로 보여지는 key 에 추가적으로, 내부적으로는 append only 를 위해 internal key 를 사용하게 되는데
	- 여기에는 key 에 부가적으로 sequence no. 가 들어가 해당 키에 대한 일종의 version 까지 붙여서 skip list 에 넣게 된다.
- 즉, 겉으로 보기에는 `key -> value` 형태지만, 실제로 skiplist 에 저장되는 노드는 `[key, seq] -> value` 인 것.