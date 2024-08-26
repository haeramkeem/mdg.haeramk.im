---
tags:
  - os
  - snu-aos24s
  - 논문
---
> [!info] 본 글은 [Marshall K. McKusick](https://en.wikipedia.org/wiki/Marshall_Kirk_McKusick) 의 논문 [A Fast File System for UNIX (ACM TOCS '84)](https://dl.acm.org/doi/pdf/10.1145/989.990) 를 읽고 정리한 글입니다.

> [!info] 별도의 명시가 없는 한, 본 글의 모든 그림은 위 논문에서 가져왔습니다.

> [!fail] 본 문서는 아직 #draft 상태입니다. 읽을 때 주의해 주세요.

## Abstract - 개요

- 기존의 UNIX 파일시스템을 더 개선시킨 "Fast File System - FFS" 에 대한 내용이다.
	- 데이터 지역성을 살려 접근 가능
	- 많은 주변기기들과 CPU 들에 적용될 수 있음
- 이건 대략 이런 식으로 가능하다고 한다:
	- 순차적으로 접근되는 데이터들을 모으기
	- 큰 파일들을 빠르게 접근하는 것과 작은 파일을의 fragmentation 을 줄어주는 두 토끼를 모두 잡기 위한 두 종류의 block size

## 1. Introduction

- 이 논문에는 기존의 512-byte 파일 시스템에서 개선되어 BSD 4.2 에 포함된 파일시스템에 대해 다루고 있다.

### Outline

- 크게 outline 을 잡아보면,
	- Motivation - 왜 기존의 파일시스템을 개선하게 되었는지
	- Method - 이러한 개선점들을 적용하는데에 사용된 방법들
	- Rationale - 어떤 이유에서 이렇게 디자인했는지
	- Implementation - 새로운 구현에 대한 설명
	- Conclusion - 얻어진 결과들, future plan, 프로그래머들을 위해 추가적으로 변경된 점

### Problem Statement

- 기존의 PDP-11 에서의 파일 시스템
	- I/O 는 커널레벨에서 버퍼가 되었고
	- 데이터 전송 순서에 딱히 정해진 규칙은 없었다
	- 모든 작업은 동기적으로 이루어 졌다 - 아마 I/O 작업이 끝나기 전까지 hang 걸리는?
	- 디스크에는 512-byte 블럭 크기로 저장되었고, FS 의 데이터 공간 임의의 공간에 저장 가능
	- 디스크 용량 이외에는 제약사항이 거의 없었다
- VAX-11 에서의 파일시스템
	- 512-byte FS 로는 application 이 원하는  throughput 을 제공해주기 힘들다
	- 가령, 많은 파일들에 대해 작은 작업을 하는 경우 FS 에서 throughput 을 받쳐줘야 한다.
	- FS 에 있는 파일을 process 의 virtual memory 에 올려서 사용해햐 하는 경우에는 paging data I/O 가 빈번하게 발생하기 때문에 마찬가지로 throughput 이 받춰줘야 한다.
	- 하지만 기존의 UNIX 의 FS 에서는 디스크 최대 대역폭에 비해 2%밖에 성능을 못 내고 있으며 디스크 arm 당 20Kb/s 의 throughput 밖에 안나온다고 한다.

### Improvement

- 이러한 기존 FS 의 문제점을 해결하고자 개선을 했다고 한다.
	- UNIX FS 의 인터페이스는 사용하기 편했고 그 자체로 성능 저하를 만들어내는 것이 아니었기에, 개선에서는 인터페이스 변경 없이 기저에 깔린 구현을 변경했다.
	- 즉, 사용자는 이 변경에 대해 추가적으로 대응할 필요가 없는 것

## 2. Old File System

### Traditional File System - Bell Labs 버전

- "*Traditional File System*" 은 처음에 Bell Labs 에서 고안한 버전을 일컫는다.
- 하나의 디스크는 여려개의 partition 으로 나뉘고, 각각의 파이션에는 하나의 FS 를 가질 수 있다.
	- FS 는 여려개의 파티션에 나뉘어 설치될 수는 없다
- FS 내에는 *Superblock* 이라는 공간이 있고, 여기에 FS 에 대한 parameter 들이 들어가게 된다: (이 superblock 은 [[Superblock (Storage)|이 Superblock]] 과는 다른것이다.. 아마?)
	- FS 내의 data block 의 갯수
	- 최대 파일 갯수
	- free list 테이블을 가리키는 pointer
	- FS 내의 free block 들을 연결지어놓은 linked list
- FS 내에는 파일들이 있는데, 어떤 파일은 디렉토리로 구분된다. 디렉토리는 다른 파일에 대한 포인터들을 저장하는 파일로, 이 "다른 파일" 에는 또 다른 디렉토리가 들어갈 수 있다.
- 모든 파일은 해당 파일을 설명하는 자료구조인 *inode* 과 연관되어 있고, 여기에는 이러한 정보들이 저장된다:
	- 파일 소유자
	- 마지막 변경 시간
	- 마지막 접근 시간
	- 파일들의 데이터 블록들에 대한 포인터들을 저장하는 배열
	- Indirect Block
- 여기서 *Indirect Block* 은 파일들의 데이터 블록을 계층적으로 참조하기 위한 블럭이다.
	- "파일들의 데이터 블록들에 대한 포인터들을 저장하는 배열" 에는 파일의 첫 8개의 블록들의 포인터만 저장되기 때문에, 이 공간을 다 사용하고 나면 추가적으로 포인터들을 저장할 공간이 필요하기 때문
	- *Singly indirect block* 에는 128 개의 data block address 가 들어간다.
	- *Doubly indirect block* 에는 128개의 *Singly indirect block* 이 들어간다.
	- *Triply indirect block* 에는 128 개의 *Doubly indirect block* 이 들어간다.
	- 이것과 관련된 내용이 기억이 안난다면, [[10. File Systems#Inode, Inode List Block|여기]] 에서 복습하도록 하자.
- 150-megabyte UNIX file system 은 4Mb 의 inode 와 146Mb 의 데이터로 구성된다
- 이것은 inode 와 data 를 분리하게 되는데 inode 를 들렀다가 data 에 방문해야 하기 때문에 seek time 이 많이 소모되었다.
- 단일 디렉토리의 파일들에 대한 inode 들은 연속된 4MB inode 공간에 할당되지 않는다. 따라서 이 파일들에 대한 작업을 수행할 때는 각 inode 들을 계속 찾아 다녀야 한다.
	- 즉, 같은 디렉토리에 속한 파일들의 inode 는 4MB inode 공간 내에 sequential 하게 배치해 놓으면 그냥 순차적으로 쭉 읽으면 되기 때문에 훨씬 빠를 것이다. 하지만 Old file system 에서는 그렇게 하지 않아 성능 저하가 발생한다는 소리.
- 데이터 블럭의 할당 또한 최적화와는 거리가 멀었다고 한다. 이전의 FS 에서는 disk 에게 한 transaction 당 512byte 이상의 데이터를 보내지 않았는데, 어떠한 경우에는 다음 data block 이 같은 cylinder 에 있지 않아 transaction 사이에 seek time 이 발생하게 된다고 한다.

### Old File System - Berkely 버전

- Berkely 에서 시도한 방법은 reliability 와 throughput 의 관점에서 개선이 있었다.
- FS 정보들은 staging 되어 reliability 를 보장하게 되었다; 즉, 해당 데이터는 정상적으로 변경되던지 아니면 문제가 생겼을 경우에는 완전히 revert 되게 된다.
- 또한 block 의 사이즈를 512byte 에서 1024byte 로 두배 늘렸다.
- 이렇게 하면 디스크가 한번에 가져올 수 있는 양이 두배로 늘게 되고, inode 에서도 direct data block 에 저장되는 양이 많기 때문에 indirect data block 에 접근하는 빈도도 낮아지게 된다.
- 이것은 block 사이즈를 늘리는 것은 분명 throughput 을 늘리는데 도움이 된다는 것을 보여주긴 한다.

### 이것의 문제점...

- 하지만 그럼에도 불구하고, throughput 은 디스크 최대 수치의 4% (기존 2%에서 두배가 된) 에 머물게 된다.
- 이것은 다음과 같은 문제점 때문이다:
	- 디스크는 처음에는 free block list 가 sequential 하게 정렬되어 있지만, 파일들이 생성되고 삭제되는 과정이 반복되다 보면 free block 들이 랜덤한 곳에 위치하게 된다.
	- 이것은 결국에는 파일의 데이터가 랜덤 위치의 블럭들에 저장되는 결과를 초래하고, block 들에 접근할 때 마다 seek 을 하게 된다.
	- 수치적으로 보자면 디스크는 처음에는 175Kb/s 의 대역폭을 가지지만 시간이 지나다 보면 30Kb/s 까지 떨어진다.
- 이것은 FS 전부를 리빌딩하지 않는 이상 원래의 속도로 되돌아오지 않는다.

## 3. New File System Organization

### Superblock

- 새로운 버전에는 이전과 동일하게 파티션별 1개의 FS 가 설치되고, drive 가 여러개의 FS 를 가지게 된다.
- 각 파티션의 처음에는 해당 파티션의 FS 를 설명하는 Superblock 이 동일하게 들어간다.
- 이 Superblock 은 중요하기 때문에 여러개로 복사되지만, 이 내용이 변경되지는 않기 때문에 복원 작업이 아니라면 접근되지 않는다.

### 4096 Byte-sized Block

- 위에서 언급한 [[#Old File System - Berkely 버전|Berkely 버전]]에서, block 사이즈를 늘리면 throughput 이 늘어난다는 것을 확인했다.
- 2^32 byte 짜리 파일을 단 2단계의 indirect data block 으로 구성하기 위해서는, 블럭의 사이즈가 최소 4096 byte 가 되어야 한다.
- 따라서 FS 의 블럭 사이즈는 4096 byte 보다 큰 2 의 제곱승 byte 가 된다.
- 이 블럭 사이즈는 superblock 에 저장되기 때문에, 시스템에서는 블럭 사이즈에 구애받지 않고 FS 를 사용할 수 있다.
- 하지만 이 값은 처음에 FS 를 구성할 때에만 설정할 수 있고, 이후에 임의로 변경하는 것은 안된다; 변경하기 위해서는 FS 전체를 리빌딩해야 한다.
- FS 의 block 사이즈를 (물론 FS 초기화시에) 변경할 수 있게 되었기에, 시스템에 여러 block 사이즈들이 공존할 수 있게 되었고, 따라서 최적화된 I/O size 를 application 에 제공해주기 위해 FS 인터페이스가 확장되었다고 한다.
	- 파일의 경우에는 최적의 I/O 단위는 당연히 block 사이즈 일 것이다. 또한 파일이 아닌 pipe 나 socket 의 경우에는 최적의 I/O 단위는 버퍼의 사이즈이다.
	- 이러한 것들은 stdio 라이브러리에서 사용되고, 이 라이브러리는 application 에서 사용된다.
	- 또한 stdio 라이브러리를 사용하지 않는 경우에도 마찬가지로 이러한 기능을 사용하기에 이런 인터페이스 확장이 필요했던 것.
- 4096byte block system 을 이용했을 경우에는 512byte 나 1024byte 일 때보다는 당연히 동일한 파일에 대한 data block 의 개수는 줄어들기 때문에 이것을 추적하기 위한 data block pointer array, indirect data block array 사이즈는 줄어들게 된다.
	- 다만, free block 을 추적하기 위해 필요한 공간은 늘어나기 때문에 결국에는 이러한 공간 절감은 상쇄된다.

### Cylinder Group

- *Cylinder Group* 은 하나 이상의 인접한 실린더로 구성된 단위이고, 하나의 partition 은 이 cylinder group 들로 구성된다.
- 이런 그루핑을 하는 이유는 seek time 을 줄이기 위해서다.
	- 파일을 구성하는 block 들이 인접한 cylinder 에 있으면 seek 에 걸리는 시간이 적게 걸리기 때문
	- 또한 파일들을 삭제하고 생성하는 과정에서 block 들이 특정한 cylinder 에서만 이동하게 한다면, 모든 cylinder 에 흩뿌려지는 것에 비해서는 당연히 시간이 흘러도 성능 저하가 적게 나타나게 된다.

#### Bookkeeping Information

- 각 cylinder group 에는 *Bookkeeping information* 이 저장되어 있다
	- 여기에는 superblock 정보의 복사본,
	- inode 를 위한 공간,
	- free block bit map,
	- data block 사용 현황 같은 요약 정보들이 들어간다
- Free block bit map 은 기존 FS 의 superblock 에 저장된 free list 를 대체한다.
	- 아마 list 가 아니라 bitmap 이기 때문에 free block 정보를 관리하는데에 있어 더 적은 공간과 더 빠른 속도를 보여줄 것.
- 각 cylinder group 에는 일정한 개수의 inode 들이 저장될 수 있다고 한다.
	- 기본 정책으로는 cylinder group 의 크기를 2048 byte 로 나눈 갯수만큼 inode 를 저장할 수 있다고 한다.
	- ~~물론 위 내용은 주인장이 임의로 해석한 것이다; 원본에서는 Cylinder group 에서 2048 byte 마다 하나의 inode 를 할당한다고 되어 있는데, inode 는 각 파일마다 존재하는 것이고 한 개의 block 이 4096 byte 인 점 등을 감안하면 이게 뭔소린지 잘 감이 안오기 때문~~
- *Bookkeeping information* 은 각 cylinder group 의 맨 앞에 둘 수도 있지만, 그렇게 하지 않는다.
	- Cylinder 는 단순히 platter 의 한 평면이 아니고 원통형이기 때문에, 이것을 cylinder group 의 시작점에 둔다면 모든 Bookkeeping information 이 disk 맨 위의 platter 에 모여있게 될 것이고, 만약 이 상태에서 맨 위 platter 에 fail 이 발생하게 되면 모든 cylinder group 의 bookkeeping information 이 날라가기 때문
- 따라서 이 정보는 각 cylinder group 마다 다른 offset 을 가지고 시작점에서 떨어진 위치에 저장되게 된다.
- 대략 이렇게 계산된다고 한다:
	- 이전 cylinder group 의 offset + 현재 cylinder group 의 track size = 현재 cylinder group 의 offset
	- 이렇게 하면 이 정보들이 나선형으로 아래로 쭉 내려가며 저장되어 어떤 한 track 이나 cylinder, platter 의 실패도 모든 Bookkeeping information 의 손상으로 이루어지지 않게 된다.
- 첫번째 cylinder group 만 제외하면, cylinder group 의 시작점부터 bookkeeping information 의 시작점까지가 data 저장 공간으로 사용된다???
	- ~~아니 그럼 모든 cylinder group 은 앞부분에 data block 들이 있고 뒤에 bookkeeping info 가 있는 양분된 형태인건가??~~

### Optimizing Storage Utilization

- 자 이렇게 4096 byte 짜리 block 들을 인접한 cylinder 에 때려박아 아주 빠른 데이터 접근 속도를 구현해 냈다.
- 근데 이 경우에는 당연히 [[08-2. Physical Memory Allocation#Fixed Partition (고정 분할 방식)|Internal Fragmentation]] 이 문제가 된다.
- 저자의 실험에 따르면, block 사이즈를 늘림에 따라 낭비되는 공간의 크기가 점점 늘어나는 것으로 나타났다:
	- 심지어 block size 를 4096 byte 로 했을 때에는 45.6% 나 되는 양이 낭비되었다고 한다.

![[Pasted image 20240325193919.png]]

#### Fragment

- 이것을 해결하기 위해, 하나의 block 을 2/4/8 개로 나눠 사용하는 기법인 *Fragment* 라는 것이 도입되었다.
- 몇개의 fragment 들로 나눌 것인지는 FS 를 구성할 때 정하게 되고
- Fragment 의 최소 사이즈는 최소 sector 사이즈와 같은 512byte 이다.
	- Block 사이즈, fragment 수준 모두 FS 구성시에 변경이 가능하기에 fragment 의 크기 또한 초기 설정이 가능하다는 것을 잊지 말자.
- 각각의 fragment 는 주소가 있어서 해당 주소로 접근이 가능하다.
- [[#Bookkeeping Information|여기서]] 언급한 block 에 대한 bitmap 도 block 레벨이 아닌 fragment 수준으로 free 여부를 나타내게 된다.
	- 따라서 block 가 free 한지를 알기 위해서는 당연히 그 아래 수준인 fragment 까지 모두 비어있는지 확인해야 한다.
	- 또한 연속된 free fragment 가 충분히 큰 사이즈로 있다고 하더라도, 이들이 여러개의 block 들에 걸쳐 있다면 하나의 block 처럼 사용할 수는 없다. (잘 이해가 안된다면 아래의 예시를 보자.)
- 이 fragment bitmap 에 대해서는 맥커식씨 (저자) 가 친절히 제공해 준 아래의 예시를 보며 살펴보자.

![[Pasted image 20240325195727.png]]

- 일단 위 상황은 4096 byte block, 1024 byte fragment (4분할) 설정에서 데이터가 저장된 fragment 를 `X`, 비어있는 fragment 를 `O` 로 나타낸 것이다.
	- 오해하지 말자: `XXXX` 가 Fragment 0~3 을 의미하는 뭐 특별한 코드 뭐 그런게 아니라, Fragment 0~3 의 현재 상태가 `XXXX` 라는 소리다.
- 위의 bitmap 을 보고서 block 3 번만이 모든 fragment 가 비어있으므로 이 block 도 비어있다고 판단하게 된다.
- 또한 block 1, 2 에 걸쳐 있는 fragment 6, 7, 8, 9 는 block 의 사이즈와 같은 4096byte 지만 이 공간을 하나의 block 으로 사용하지는 못한다.
- 다만 여기서 알아야 할 것은 fragment 가 미리 잘려져있지는 않다는 것이다:
	- 파일은 block 단위로 저장하게 되고, block의 남는 부분은 그때 fragment 로 바뀌어 다른 파일이 저장될 수 있게 된다.
- 이렇게 fragment 를 사용했을 경우에는 fragment 사이즈와 동일한 사이즈의 block 사이즈를 사용했을 때와 유사한 양의 내부 단편화가 발생한다는 것이 실험적으로 입증되었다.
	- 즉, 4096byte block + 1024byte fragment 를 이용할 경우 1024byte block 을 이용할 경우와 유사한 내부 단편화 비율을 보여준다는 것
- 즉, block 의 크기를 늘려 throughput 을 늘리는 데에도 성공하고, fragment 기법을 이용해 내부 단편화 문제도 해결하게 된 것이다. (여기까지 읽었을때는 그런 줄 알았다. [[#Free Space Reserve|그러나...]])

#### Data Expansion

- `write` syscall 을 호출할 때마다 시스템은 파일에 공간을 할당하게 된다.
- 또한 이때마다 시스템은 파일의 크기가 커졌는지 확인하게 되는데, 켜졌을 경우 다음의 세 조건을 따지게 된다.

1. (a) 기존의 파일에 하나의 block 혹은 fragment 만 할당되어 있고, (b) 커진 파일 또한 해당 block 혹은 fragment 에 다 들어갈 사이즈라면
	- 해당 block/fragment 의 남은 부분에 쓰여진다.
2. (a) 기존의 파일에 여러개의 fragment 되지 않은 block 들이 할당되어 있고, (b) 마지막 block 의 남아있는 공간에 새로운 데이터가 다 들어가지 못한다면
	- 우선 마지막 block 의 남아있는 공간에 새로운 데이터 일부를 채워 해당 block 을 모두 채우고
	- 남아있는 새로운 데이터 사이즈가 block 크기보다 크다면 새로운 block 을 할당해 여기에 채워넣는다. 그리고 이것을 남은 사이즈가 block 크기보다 작아질 때 까지 반복한다.
	- 마지막으로 남은 사이즈가 하나의 블럭까지 필요하지 않고 몇개의 fragment 들로 처리 가능하다면, 필요한 개수의 fragment 들이 할당된다. 반면 하나의 block 을 전부 줘야 한다면, 하나의 block 이 할당된다.
		- 즉, 4분할 fragment 정책에서 fragment 2개에 전부 들어간다면 fragment 2개만 할당한다는 것이고, 남아있는 데이터의 크기가 3.8 fragment 라면 그냥 하나의 block 을 할당한다는 뜻.
3. (a) 기존의 파일에 여러개의 fragment 들이 할당되어 있고, (b) 해당 fragment 들에 남은 공간이 부족하다면
	- i) 추가된 데이터의 사이즈와 기존에 fragment 에 저장된 데이터의 사이즈를 합쳤을 때 full block 사이즈보다 크다면
		- 해당 fragment 들을 반환하고 이들을 합쳐 full block 에 할당한다.
			- 여기서 생각해보아야 할 점은 해당 fragment 들은 무조건 파일의 마지막 부분이라는 것이다. 파일의 중간 부분이 fragment 에 저장될 일은 없다.
			- "해당 fragment 들을 반환하고 이들을 합쳐 full block 에 할당" 을 잘 생각해 보면 왜 그런지 알 수 있다: full block 사이즈를 넘치기만 해도 full block 으로 합쳐지기 때문.
		- 그 이후에는 (2) 번 과정과 동일하게 흘러간다.
	- ii) 만일 full block 보다는 작다면, 필요한 fragment 혹은 block 이 할당되게 된다.
- 위와 같은 방식이 아닌 file 사이즈를 fragment 단위로 키우는 것은 해당 fragment 가 full block 이 되었을 때 데이터를 복사하는 것에서 발생하는 오버헤드가 있고, 이러한 문제는 (파일 끝부분에서 생기는 불가피한 fragment 를 제외하면) fragment 단위가 아닌 block 단위로 저장하는 것으로 최소화 될 수 있다.
	- ~~고 한다. 솔직히 잘 이해 안된다.~~

#### Free Space Reserve

- 위와 같은 정책들이 실제로 성능 향상을 보여주기 위해서는, 파일 시스템이 꽉 차있으면 안된다.
	- 만일 free block 의 개수가 0에 가까워진다면, throughput 은 절반으로 떨어진다고 한다.
	- 이것은 공간이 부족해 지역성을 살리기 어렵기 때문, 즉, 데이터를 인접한 block 들에 저장하지 못하기 때문이다.
- 따라서 FS 에는 free block 의 개수를 일정 비율 이상으로 보장해주기 위한 *Free Space Reserve* 란 기능이 있다.
	- 이 수준 이하로 떨어지면, 시스템 관리자만이 block 들을 할당할 수 있게 된다.
- 이 값은 언제든 변경할 수 있다. FS 를 마운트하여 사용하는 와중에도 변경하는 것이 가능하다.
- 만일 free block 이 부족해져서 성능이 저하되면 충분한 free block 이 생길 때 까지 파일을 지워주면 해결된다.
- 또한 free block 이 부족해진 상태에서 생성된 파일의 경우에는 (아마 block 들이 여러 군데에 흩어져 있을 것이므로?) 접근에 시간이 좀 걸리게 되는 문제가 있을 수 있는데 (원문: Access rate), 이는 free block 이 확보된 다음 파일을 옮겨주는 것으로 해결할 수 있다.
- 저자는 이러한 Free Space Reserve 공간도 waste 공간에 포함시켜야 한다고 말한다:
	- 즉, 결국에는 이러한 reserve 공간도 system 입장에서는 사용하지 못하는 공간이기 때문에, 낭비되는 것이라 보는 것.
	- 따라서 [[#Optimizing Storage Utilization|여기]] 에 제시된 표를 참고하자면, 4096byte block + 512byte fragment 를 사용했을 경우에 대해 waste 비율은 다음과 같이 계산될 수 있다:
		- 내부 단편화 비율은 512byte block 과 유사한 6.9%
		- Free block reserve 은 5% 로 가정
		- 도합 11.9%
	- 따라서 이것은 1024byte block 을 사용했을 때의 내부 단편화 비율인 11.8% 과 유사해진다.

### File System Parameterization

- 기존의 FS 는 free list 를 생성할 때를 제외하면 하드웨어적인 요소를 고려하지 않는다.
	- 즉, 저장 매체의 물리적인 특성이나 그 매체를 컨트롤하기 위한 하드웨어들에 대한 정보를 고려하지 않는다 이마리야
- 따라서 새로운 FS 에는 이러한 저장 매체와 이것을 위한 장치들의 특성을 수치적으로 parameterize 하여 block 들이 최적의 방식으로 할당될 수 있게 한다.
- 이러한 parameter 들에는 다음과 같은 것이 있다고 한다:
	- 프로세서의 속도 (HDD 내의 프로세서가 아니고 메인 CPU 이다)
	- 대용량 정보 전송을 위한 하드웨어적 요소들 (IO Channel)
	- 저장 장치의 특성
- FS 에는 특성이 다른 여러 개의 디스크가 장착될 수 있기 때문에 성능 최적화를 위해 이러한 정보들을 수치화하여 활용하는 것은 어찌보면 당연한 셈이다.

#### Rotationally Optimal

- Platter 가 회전하며 head 에 의해 block 이 읽히는 과정에서, 이 block 들을 가장 최적의 방법으로 읽을 수 있도록 배치한 것을 *Rotationally Optimal* 이라고 한다.
- 일단 당연히 파일의 연속된 block 두개가 같은 cylinder 에 있으면 좋을 것이다.
- 하지만 이러한 block 들이 cylinder 내에서 물리적으로 인접한 block 에 저장되는 것이 좋을 것 같지만, 이것이 항상 좋은 것은 아니다.
- 이 차이는 프로세서의 특성에 따라 인접한 block 을 원큐에 읽을 수 없는 경우가 있기 때문이다:
	1.  IO Channel 을 가진 processor 의 경우에는 block transfer request 사이에 processor 가 개입할 필요가 없기에 인접한 두 block 을 원큐에 전송하는 것이 가능하고, 이것이 효율적이다.
	2.  하지만 IO Channel 을 가지지 않은 processor 의 경우에는 이러한 request 들 사이에 processor 가 개입하게 되어 인접한 두 block 을 원큐에 전송하는 것이 불가능하다. 따라서 두 block 사이에 일정 간격을 두는 것이 오히려 효율적인 배치가 된다.
- 2번 케이스에 대해 조금 더 자세히 살펴보자.
	- IO Channel 이 없다면 Block 하나가 전송된 뒤에는 전송 완료 interrupt 가 걸리게 되고, 따라서 processor 에서 해당 interrupt 를 처리하며 다음 block 을 전송할 수 있도록 작업을 스케줄링한다.
	- 연이은 block 데이터 전송 사이에는 이러한 processor 개입때문에 시간이 약간 뜨게 되는데,
	- 이 시간 동안 disk 는 회전하고 있으므로 몇개의 block 들은 건너뛰게 되는 것.
	- 따라서 이 건너뛰게 되는 block 들을 고려하여 파일의 block 을 배치하면 processor 개입이 종료된 이후에 바로 다음 block 에 접근할 수 있게 된다.
	- 예를 들어 processor 개입 기간 동안 5개의 block 을 지나치고, 한 track 에는 100 개의 block 이 있다고 가정했을 때,
		- 만일 파일의 block 이 5개의 block 간격을 두고 배치되어 있다면 첫번때 block 을 읽은 뒤 processor 개입 동안 5 개의 block 을 지나치고 다음 block 을 읽을 수 있을 것이다.
		- 하지만 파일의 block 이 연달아 배치되어 있다면, 첫번째 block 을 읽은 뒤 5개의 block 을 지나치게 되어 다음 block 을 읽기 위해서는 95 개의 block (100-1-5+1) 을 지나 한바퀴를 돈 다음, 다음 block 을 읽어야 할 것이다.
- 이러한 경우에 그럼 몇개의 block 간격을 두고 배치해야 될까. 즉, 몇개의 block 들을 processor 개입 기간동안 지나치게 될까.
- 이를 계산하기 위해서는 processor 의 특성과 disk 의 특성을 모두 알아야 한다.
	- Processor 측면에서는, interrupt 를 걸고 새로운 작업을 scheduling 하는데 걸리는 시간을 알아야 한다.
	- Disk 측면에서는, track 에 몇개의 block 이 있는지와 회전 속도를 알아야 한다.
- 새로운 FS 에서 이러한 시간 간격은 parameterize 되어 설정 가능하다.
	- 만일 이것이 잘못 설정된다면, 파일들의 block 들이 예상한 위치에 있지 않기 때문에 당연히 성능 저하가 나타날 것이다.
	- 따라서 현재의 시스템에 맞는 값으로 설정이 되어야 할 것이고,
	- 만일 디스크를 다른 시스템으로 옮긴다면, 해당 시스템에 맞는 값으로 조정해줘야 할 필요가 있을 것이다.
		- 만일 옮기려고 하는 시스템에 대한 정보가 없어도 옮긴 후에 조정해 주면, 조정한 이후에 배치된 block 들에 대해서는 최적화된 방식으로 작동할 수 있을 것이라 함.

#### Rotational Layout Table

- 이것을 위해 Superblock 내의 cylinder group summary information 에는 *Rotational Layout Table* 이 존재한다.
- 여기에는 *Rotational Position* 별로 그 안의 data block 들에 대한 mapping 이 되어 있어 해당 data block 의 free 여부를 알 수 있다.
	- *Rotational Position* 은 "Rotationally Optimal 한 block 들의 집합" 정도로 생각하면 될 것 같다.
- 따라서 allocatable block 을 찾기 위해서는
	1. Rotational position 에 대한 summary (해당 rotational position 에 free block 이 몇개 있는지 나와 있음) 를 보며 rotational block 을 하나 정한다.
	2. 그 다음 해당 rotational position 에 대한 rotational layout table 의 entry 를 찾아 그 안의 data block mapping 을 보며 free block 을 찾는 방식으로 진행된다.

### Layout Policies

- Layout Policy 는 두 종류가 존재한다.
- 끝까지 읽어봤을 때 *Global Policy Routine* 는 대략 cylinder group 을 선택하는 것이 목적이고, Local *Allocation Routine* 은 cylinder group 내에서 block 을 할당하는 것이 목적인 것 처럼 보였다.

#### Global Policy Routine

- *Global Policy Routine* 은 cylinder group 을 야무지게 선택해 locality of reference 를 늘리고 seek time 을 줄이는 것이 목적이다.
- 이놈은 FS 전체에 대한 summary information 을 이용해서 새로운 디렉토리와 파일들의 inode 와 data block 을 어디에 할당할 지 결정한다.
- 또한 rotationally optimal block layout 을 계산하여 언제 cylinder group 을 변경해 긴 seek time 을 감수할 것인지 결정한다.
	- cylinder group 의 용량이 부족해 지면, 어쩔 수 없이 cylinder group 을 변경해야 할 필요가 있기 때문
	- ~~뭐라는겨~~
- 연관이 있는 데이터는 유사한 cylinder group 에 배치되어야 하고, 연관성이 없는 데이터는 다른 cylinder group 에 배치되어야 한다.
	- 만일 localization 이 너무 심해지면, 즉, 연관성이 적은 데이터들이 유사한 cylinder group 에 모이게 되면, cylinder group 의 가용 공간이 줄어들 뿐 아니라 cylinder group 이 old file system 과 유사해 지게 된다.
	- 만일 spreading 이 너무 심해지면, 연관성이 있는 데이터들이 다른 cylinder group 에 흩뿌려지게 되고, 이것은 seek time 을 늘려 성능이 저하될 것이다.
- 따라서 Global policy 는 이 두가지 사이에서 밸런스를 맞추며 성능이 향상되도록 한다.

#### Local Allocation Routine

- Global routine 은 block 하나를 **대충** 골라 *Local Allocation Routine* 을 호출해 여기에 할당하라고 시킨다.
- 여기서 **대충** 이라는 워딩에 집중할 필요가 있다:
	- Global routine 입장에서 FS 전체에 대한 free block 정보를 정확하게 꿰고 있는 것은 쉽지 않기 때문에 ~~(왜 쉽지 않은지는 설명 안해준다)~~, 적당히 정확한 정보 (*Heuristic*) 을 가지고 block 을 고르게 되는 것.
- 그럼 Local Allocation Routine 이 이것을 받아 실제 block 할당을 담당하게 된다.
- 아래는 요청받은 block 이 free 하지 않은 경우 local routine 의 처리 과정이다:
	1. 같은 cylinder group 내에서 rotationally closest 한 놈을 골라 할당한다.
		- 여기서 head switching time (platter 간 head 를 전환하는 시간?) 은 없다고 가정한다.
		- 아마 cylinder group 내에서는 platter 가 달라서 발생하는 접근 시간의 차이는 거의 없기 때문인듯
		- 하지만 그렇지 않은 경우에는 rotational layout table 을 구성하는 데에 있어 이것도 고려되어야 한다고 한다.
	2. 만일 rotationally closest 한 놈이 없으면, 그냥 cylinder group 내에서 찾는다
	3. 만일 cylinder group 이 완전히 차버려서 cylinder group 내에서는 free block 이 전혀 없다면, 현재의 cylinder group number 를 quadratic hash 하여 다른 cylinder group 을 정해 free block 을 찾는다
		- Quadratic hash 는 [이 글](https://jicoding.tistory.com/94) 을 참고하자
		- 이 방법을 사용하는 이유는 빠르기 때문이라고 한다
			- 만일 일정 free block 을 보존하도록 설정된 경우에는 이 (3) 번까지 오지도 않는다.
			- (3) 까지 왔다는 것은 free block reserve 설정이 되어 있지 않아 많은 block 들이 랜덤하게 배치되어 있다는 소리이고, 따라서 이 경우에는 조금이라도 빠른게 장땡이다.
	4. 만일 (3) 번으로도 찾지 못했다면, 모든 cylinder group 에서 free block 을 (마치 브루트포스 방법처럼) 찾는다.

#### Inode Allocation

- 같은 디렉토리 내에 위치하는 파일들의 inode 들은 함께 참조되는 경우가 많다
	- 뭐 `ls` 명령어 생각하면 맞는 말이긴 하다
- 따라서 이러한 inode 들은 같은 cylinder group 에 위치하도록 한다
- 하지만 디렉토리의 경우에는 다른 방식을 사용한다.
- 디렉토리는 free inode 의 개수가 평균보다 많고, 디렉토리를 제일 적게 갖고 있는 cylinder group 에 배치된다
	- 아마 이것은 같은 디렉토리 내의 파일들은 모두 하나의 cylinder group 에 저장되기에 디렉토리를 배치할 때 free inode 가 많은 곳에 배치해야 앞으로 해당 디렉토리에 생성될 파일들에 대한 inode 를 감당하기 유리해서인듯
- Cylinder group 내에서 inode 를 배치하는 것은 next-free 방법을 사용한다:
	- 즉, rotationally optimal 한 방법이 아닌 그냥 랜덤 배치를 한다는 소리임.
	- 이것은 하나의 cylinder group 에는 최대 2048 개 inode 만이 배치될 수 있기 때문에, 많아봐야 16 번의 disk read 면 cylinder group 에 있는 모든 inode 를 읽어올 수 있기 때문.
	- "최대 2048개" 라는 것은 [[#Bookkeeping Information|여기]] 에서 언급된 특성 때문이다.
- 하지만 Old File System 의 경우에는 디렉토리의 파일들 inode 를 가져오는 데에 한번의 disk transfer 만 하면 된다
	- ~~그럼 New File System 이 더 안좋은거 아닌가?~~

#### Data Block Allocation

- 당연히 파일의 data block 은 같이 접근되는 경우가 많기 때문에, 얘들은 되도록이면 같은 cylinder group 안에서 rotationally optimal 하게 저장되도록 한다.
- 하지만 이 경우 문제가 되는 것은 큰 파일의 경우이다:
	- 큰 파일이 하나의 cylinder group 에 들어가게 되면 cylinder group 의 가용 블럭을 아주 빠르게 소진해 버리기 때문
	- 이것은 해당 파일이 넘치는 것 뿐 아니라 다른 파일이 들어올 경우 넘치게 되는 것까지도 포함한다.
- 어떤 Cylinder group 도 꽉 차지 않도록 관리하는 것이 이상적이다.
- 이 문제를 해결하기 위해 파일의 크기가 48Kb 를 초과하면 다른 cylinder group 으로 넘겨버리는 방법을 사용한다.
	- 또한 다른 cylinder group 에 저장하다가도 저장한 양이 megabyte 단위가 되면 또 다른 cylinder group 을 선택하여 저장하게 된다.
- 새로운 cylinder group 은 free block 개수가 평균보다 많은 cylinder group 중에서 고른다.
- 넘친 이후에는 megabyte 단위로 다른 cylinder group 에 저장되기 때문에 megabyte 데이터는 긴 seek time을 가지게 된다. 하지만 이 긴 seek time 의 비용은 작다 ~~(?)~~

## 4. Performance

> [!fail] #draft 성능 좋겠지 뭐; 시간이 없어서 일단 패스..

## 5. File System Functional Enhancements

- 지금까지 얘기한 것들은 FS 의 인터페이스를 바꾸지는 않았기에, 사용자 입장에서 FS 를 재구성해야 할 필요는 없었다.
- 이 섹션에서는 (비록 FS 를 재구성해야 할 지라도) 인터페이스까지 변경을 해 더욱 성능을 향상시키는 방법에 대해 설명한다.

### 5.1. Long File Names

- File name 은 임의의 길이를 가질 수 있다.
- 디렉토리를 읽는 프로그램만이 이 개선에 영향을 받는다.
- 새로운 FS 를 사용하지 않는 시스템과의 호환성을 위해, 몇개의 디렉토리 접근 routine 이 소개되었다.
- 디렉토리는 chunk 라 불리는 512byte 단위에 저장된다.
- 디스크에 단 한번의 작업으로 저장될 수 있게 하기 위해 이 사이즈로 결정됐다고 한다.
- 이 chunk 는 가변 사이즈의 directory entry 들로 구성된다.
- Directory entry 는 파일의 이름과 파일의 inode 를 연관짓는 정보로 구성된다
- Directory entry 가 많아진다고 해서 chunk 사이즈보다 커질 수는 없다
- Directory entry 는 세개의 고정 크기 필드로 시작한다
	- inode 번호
	- entry 의 크기
	- 파일 이름 크기
- 그리고 나머지 부분은 가변 크기 필드로, 여기에 파일 이름이 들어간다.
	- 당연히 이 파일 이름의 크기는 고정 크기 필드에 명시된 파일 이름 크기와 동일해야 하고
	- (C 언어 베이스이기 때문에?) null 문자로 end-of-string 이 명시되어 있으며
	- 이 가변크기 필드는 4byte 단위가 되도록 padding 이 들어가 있다
	- 현재 최대 파일 이름의 크기는 255 character 라고 한다.
- 디렉토리의 공간은 여러개의 entry 로 구성되고, 그 각각은 `entry 의 크기` 필드에 명시된 만큼의 공간을 차지하고 있다.
	- 어떤 entry 들은  `entry 의 크기` 가 `파일 이름 크기` 와 고정 크기 필드의 크기의 합보다 큰 경우도 있으며
	- 이 `entry 의 크기` 들을 모두 더하면 정확히 디렉토리 chunk 의 크기가 된다고 한다.
- entry 가 삭제될 경우에는 해당 공간은 그 이전 entry 로 귀속된다고 한다.
	- 이것은 단순히 이전 entry 의 `entry 의 크기` 값을 삭제된 entry 의 크기 만큼 늘려주는 것으로 가능하다
	- 만일 그 이전 entry 가 없을 경우에는, 즉, 이 entry 가 유일한 entry 였다면, 해당 entry 의 inode 를 0으로 만들어 해당 공간이 사용되지 않고 있음을 명시한다.

### 5.2. File Locking

> [!fail] #draft Timeout... 시간이 없어서 이후로는 읽지 못했습니다.