---
tags:
  - database
  - db-concurrency
  - story
date: 2024-09-09
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

## 개요

- 일단, *SWMR [[Multiversion Concurrency Control, MVCC (Database Transaction)|MVCC]]* 는 *Single Writer, Multiple Reader Multi-version Concurrency Control* 의 약자 (라고 주인장 스스로 정했다.)
- 모종의 이유로 인해 이놈을 직접 구현해야 할 일이 생겼다.
	- 이 "모종의 이유" 는 간단하게 말하면 [[LSM Tree (RocksDB)|LSM]] 와 같은 상황에서 metadata concurrency control 이 필요했기 때문이었다.
- 따라서 1개의 writer thread 와 N 개의 reader thread 를 생성하고,
	- 이렇게 구성한 이유는 writer 간의 concurrency 는 관심 대상이 아니었기 때문이다.
	- Writer 와 reader 간의 concurrency 해결 방법이 궁금했었기에, writer 를 여러개 배치하는 것은 추가적인 concurrency 를 고려해야 해서 writer 는 하나만 배치한 것.
	- 근데 reader 는 여러개 생성해도 이들간의 concurrency 는 없기 때문에 reader 만 N 개로 늘린 것이다.
- Writer 는 공유 공간에 임의의 십진수와 그것의 16진수 숫자 문자열을 저장하고 reader 는 그것을 읽어들여 십진수와 16진수가 동일한 수인지 판단하는 식으로 concurrency 문제의 발생 여부를 감지하고자 하였다.
	- 즉, 만약 concurrency 가 발생했다면, 16진수 숫자를 십진수로 변환했을 때 저장되어 있던 십진수와 다를 것이기 때문.

## 그의 고분분투

### 1) 설계 문제로 인한 Concurrency 재현 실패

- 처음에는 write thread 하나가 파일에 append-only 로 쭉 써내려가고, 16개의 read thread 가 이 파일을 처음부터 full scan 을 해나가는 상황에서도 concurrency 가 발생할 것으로 생각했다.
	- 단순하게 같은 파일을 1 writer 와 N reader 가 접근하니까 concurrency 가 발생할 것이라 생각한 것.
	- 그리고 이것이 실제 usecase 와 유사했다. 저 write thread 가 수행하는 append-only 는 [[LSM Tree (RocksDB)|LSM]] 을 모사하기 위함이고, read thread 의 full scan 은 이 [[LSM Tree (RocksDB)|LSM]] 을 full scan 하는 thread 로 비견될 수 있기 때문.
- 하지만 concurrency 는 발생하지 않았다.
	- 일단 원인은 write thread 가 생성되고 read thread 가 생성되기 때문에 항상 read thread 가 write thread 에 비해 조금 뒤쳐져 있어 동일한 공간을 write thread 와 read thread 가 바라보지 않았기 떄문이었다.
	- 근데 write thread 가 먼저 시작했어도 실행 순서가 꼬이면 read thread 가 write thread 를 앞지를 수 있는 것 아닌가? 싶은 생각에 몇가지를 더 시도해 보았다.

#### 시도 1: Batch write with `fsync`, batch read

- 일단 C file library 를 걷어내고 open, read syscall 로 batch write, read 를 시도해 보았다.
- 즉, 기존에는 `stdio.h` 의 `fopen`, `fwrite` 함수를 사용했다면
- 이번에는 `fcntl.h` 의 `open` 와 `unistd.h` 의 `write` 함수를 사용하는 것으로 바꾸었고,
- 16Mi 크기를 동적할당해 여기에 데이터를 적은 후 `write` 하고 `fsync` 로 파일로 내려주었다.
- Reader thread 는, 기존에는 `char` 하나씩 읽어 십진수의 경우에는 `atoi` 로, 16진수의 경우에는 `strtol` 로 `int` 로 바꾸어 비교했었는데
- 이것도 16Mi 크기를 동적할당해 통째로 데이터를 읽어들여 처리하는 것으로 바꾸었다.
- 근데 이래도 concurrency 는 발생하지 않았다.

#### 시도 2: Disable page cache (`O_DIRECT`)

- Concurrency 가 발생하지 않는 것이 page cache 때문일 수도 있겠다는 생각이 들어서, `O_DIRECT` 모드로 파일을 읽어서 page cache 를 bypass 하는 방식을 사용해 보았다.
- 물론 안되기는 매한가지였다.

### 2) 단계적으로 구현하기 위해 설계 변경

- 좀 생각해 보니 append-only 와 full scan 에서 concurrency 를 재현하는 것은 불필요하다는 생각을 하게 되었다.
	- Metadata 에 대한 concurrency control 이 필요했기 때문.
- 그리고 일단은 MVCC 에 집중하기 위해, 파일IO 는 빼고 메모리 상에서 concurrency 를 유발하고, lock 을 잡는 식으로 우선 해결해 보며, 그 다음에 MVCC 를 구현하기로 생각을 바꿨다.
- 그래서 다음와 같은 구조체에

```c
struct Data {
	int dec;
	char hex[64];
};
```

- 이놈을 위한 메모리 공간을 동적할당 해놓고 write thread 는 이곳에 데이터를 write 하고, read thread 는 데이터를 가져다가 `dec` 와 `hex` 를 비교하도록 해놓았다.
- 즉, writer 에서는 다음과 같은 짓을 하고

```c
data->dec = i;
sprintf(data->hex, "%X", i);
```

- Reader 에서는 다음과 같은 짓을 한다.

```c
if (data->dec != strtol(data->hex, NULL, 16)) { /* ... */ }
```

- 이렇게 하면 당연히 concurrency 문제가 발생한다.
	- 가령 writer 가 `dec` 까지만 업데이트한 상태에서 reader 가 `dec` 와 `hex` 를 읽으면 이 둘은 같지 않기 때문.

### 3) Exclusive Lock

- 다음처럼 lock 을 걸면 해결되긴 한다.

```c title="writer.c"
pthread_mutex_lock(&lock);
data->dec = i;
sprintf(data->hex, "%X", i);
pthread_mutex_unlock(&lock);
```

```c title="reader.c"
pthread_mutex_lock(&lock);
int dec_num = data->dec;
int hex_num = strtol(data->hex, NULL, 16);
pthread_mutex_unlock(&lock);

if (dec_num != hex_num) { /* ... */ }
```

- 물론 위와 같이 하면 안되긴 한다.
	- 왜냐면 이건 writer-reader 간의 lock 뿐 아니라 불필요한 reader-reader 간의 lock 도 잡히기 때문.
	- 하지만 이건 굳이 해결 안한다. 어차피 lock 은 다 걷어내고 MVCC 로 갈거니까.

### 4) Two-version MVCC

- 원래는 MVCC 에 버전을 두개만 유지해도 될 줄 알았다.
	- 일단 첫번째 버전 (`new`) 에는 지속적으로 update 가 일어나고,
	- Read 요청이 왔을 때 `new` 를 sealing 해서 두번째 버전 (`old`) 으로 만들어 이후의 read 요청은 여기에 있는 것을 읽어가는 형태
- 근데 이렇게 하면 문제가 좀 있다.
	- 한번 `old` 가 만들어진 다음에는 여기에는 update 가 일어나지 않는데, reader 는 언제 이 `old` 을 새로 만들라고 요청해야 할까?
		- 일단 이를 위해서는 그냥 기존의 `old` 를 읽어가는 API 와
		- `old` 를 새로고침하라고 하는 API 두개가 필요하다.
			- `old` 을 새로고침하는 것은

### 5) MVCC 로 가자..

- 기본적인 MVCC 구현
- Array -> LinkedList 변경
- Free after read 문제
- GC
	- 

## 비고: C 정리

- [[C - Direct IO (O_DIRECT)]]
- [[C - POSIX thread mutex]]
- [[C - Struct]]
- [[C - Basic file IO (fopen, fwrite, fread, fclose)]]
- [[C - Memory Dynamic Allocation (malloc, calloc, free)]]
- [[C - 메모리에 데이터 저장하기 (memset, memcpy)]]
- [[C - Decoding number string (atoi, strtol)]]
- [[C - File IO syscall (open, write, read, fsync, close)]]