---
tags:
  - 용어집
  - database
  - rocksdb
date: 2024-04-14
---
> [!info]- 참고한 것들
> - [RocksDB 공식 문서](https://github.com/facebook/rocksdb/wiki/Leveled-Compaction)
> - [간단하게 자바로 구현한 것](https://itnext.io/log-structured-merge-tree-a79241c959e3) + [소스코드 - 깃헙](https://github.com/tomfran/LSM-Tree)
> - [ZNS: Avoiding the Block Interface Tax for Flash-based SSDs (USENIX ATC '21)](https://www.usenix.org/system/files/atc21-bjorling.pdf) 의 4.2 섹션
> - [미디엄 블로그](https://jaeyeong951.medium.com/%EC%83%89%EC%9D%B8-index-%EC%9D%98-%EB%91%90-%EA%B0%80%EC%A7%80-%ED%98%95%ED%83%9C-lsm-%ED%8A%B8%EB%A6%AC-b-%ED%8A%B8%EB%A6%AC-7a4ab7887db5)
> - [Flink 0.3 시절의 공식문서](https://nightlies.apache.org/flink/flink-table-store-docs-release-0.3/docs/concepts/lsm-trees/)

> [!info] 이미지 출처
> - 별도의 명시가 없으면, [RocksDB 공식 문서](https://github.com/facebook/rocksdb/wiki/Leveled-Compaction) 에서 갖고왔습니다.

## Leveled Compaction (Tiered + Leveled Compaction) Policy

- *Leveled Compaction* 은 [[LSM Tree (RocksDB)|RocksDB 의 LSM Tree]] 에 대한 Compaction Policy 이다.
- Compaction 의 가장 큰 목적은
	1. 각 level 이 각자의 [[LSM Tree (RocksDB)#Level Size Limit|size limit]] 을 넘지 않도록 조절해 주고
	2. 각 level 이 [[Sorted Run (Data Structure)|sorted run]] 상태, 즉 [[Static Sorted Table, SST (RocksDB)|SST]] 간에 중복된 key 혹은 범위가 겹치는 key 가 없도록 유지시켜 빠른 search 와 용량 최적화를 보장해주는 것이다.
- 그럼 이제 구체적인 작동 과정을 살펴보자.

## 과정

![[Pasted image 20240408085710.png]]

- 위에서 compaction 의 목적이 size limit 을 준수하기 위한 것이라고 했으니까, size limit 이 넘었을 때의 상황을 예로 들어 compaction 이 어떻게 수행되는 것인지 알아보자.
	- 물론 compaction 이 수행되는 조건은 [[#Compaction 을 언제 할까?|이것만 있는 것이 아니다]].
- 위와 같이 size limit 을 넘어가게 되면, [[#SST 는 어떻게 선택할까?|하나 이상의 SST 를 골라]] 다음 level 로 내려보낸다.
- 내려보낼 때는 다음과 같은 두 경우가 있을 수 있다.
	1. 우선 다음 level 에 아무런 SST 도 없을 때에는, 즉 현재 level 이 bottom level 이었을 경우에는, 새로 level 을 생성하고 그냥 SST 를 내려보내기만 한다.
	2. 하지만 다음 level 에 SST 가 있을 때에는, 다음 level 의 SST 들 중 key 범위가 겹치는 SST 들과 *Merge* 하게 된다.

### Merge

- 위에서 설명한 compaction 의 목적 두번째: level 을 sorted run 상태로 만들기 위해 merge 작업이 수행된다.
- 이름부터 merge 이듯이, 여기서는 [[Merge Sort (Algorithm)|merge sort]] 를 사용한다.
	- 어차피 각 SST 들이 정렬되어 있기 때문에 merge sort 로 하면 $O(N)$ 으로 완수할 수 있기 때문.
	- 즉, two-pointer 로 해당 SST 들을 쭉 스캔하며 하나의 stream 으로 만들고, 그것을 여러개의 SST 로 잘라 새로 저장하는 하게 된다.
	- 다른 문서들 ([[Merge Sort (Algorithm)|Merge Sort]], [[Sorted Run (Data Structure)#Merging Sorted Runs|Merging Sorted Runs]]) 에서도 여러번 설명했기에 여기서는 더 설명 안해도 되겠지?
- Merge 의 target 이 된 SST 는 전부 삭제되고, merge 의 결과로 나온 SST 들이 해당 level 에 새로 생성된다.
- 이때, 해당 level 의 size limit 을 초과하지 않는다면 그냥 생성되고 끝나지만
	- Merge 의 결과로 또 해당 level 에 size limit 을 초과할 수도 있다. 이때에는 또 compaction 이 연쇄적으로 일어나게 된다.

## Compaction Policy

> [!fail]- #draft 이 항목은 추후에 작성될 예정입니다.
> - [ ] Compaction 조건
> - [ ] SST 선택하기
> - [ ] Level 선택하기

### Compaction 을 언제 할까?

- 위 예시처럼, level size limit 을 초과했을 때 compaction 이 수행되기도 하지만, 다음과 같은 상황에서도 compaction 이 수행될 수 있다.

### SST 는 어떻게 선택할까?

- 돌라돌라 골림판~

### Level 은 어떻게 선택할까?

- 이게 뭔소린가 싶을 수 있는데,
- 여러개의 level 이 size limit 을 넘어 compaction 을 할 level 을 선택해야 할 상황이 생기기도 한다.
- 이때는 그럼 다음과 같은 방식으로 level 을 선택한다.