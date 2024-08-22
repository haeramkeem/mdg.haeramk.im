---
tags:
  - 용어집
  - database
  - RocksDB
date: 2024-04-14
---
> [!info]- 참고한 것들
> - [RocksDB 공식문서 - Static Sorted Table](https://github.com/facebook/rocksdb/wiki/A-Tutorial-of-RocksDB-SST-formats)

## SSTable

- RocksDB 에서 *Static Sorted Table (SST, SSTable)* 은 실제 key-value 데이터를 담는 파일 하나를 지칭한다.
- 중요한 특징은:
	1. *Static*: 내용을 변경하는 것이 불가능하다.
	2. *Sorted*: Key 를 기준으로 중복 없이 정렬되어 있다.

> [!tip] Static Sorted, Sorted String
> - [[Log Structure Merge Tree, LSM Tree (Data Structure)|LSM]] 구현본마다 SST 를 Static Sorted Table 혹은 Sorted String Table 등으로 다르게 부르기도 한다.
> - 하지만 약자 "SST" 는 거의 통일되어 있는 듯.

## Type

- RocksDB 에서는 두 종류의 SST 구현체가 존재한다.

### Block-based table

- 스토리지에 저장될 용도로 설계된 default SST type 이다.
- 따라서 당연히 스토리지의 특성을 최대한 반영하고 있다:
	- SST 의 크기는 [[Internal Fragment (OS)|internal fragment]] 를 최대한 줄이기 위해 기본적인 block size 인 4KB 의 배수로 구성된다.
	- 따라서 memory 에 올릴 때에도 block 단위로 올리고, block 단위로 캐싱도 한다.
- 이 SST 는 효율적으로 데이터를 저장하기 위해 압축이나 encoding 을 사용하기도 한다. (옵션인듯)

### Plain table

- 이 SST type 은 인메모리로 사용하기 위한 구조이다.
- 즉, data persistency 보다는 performance 에 중점이 맞춰져 있고, 따라서 다음과 같은 기능을 제공한다.
	1. Memory map (mmap) 을 사용하여 빠른 성능을 제공한다.
	2. 이에 추가적으로, binary search 도 모자라 hash index 도 제공해 데이터를 더 빠르게 읽어올 수 있도록 한다.