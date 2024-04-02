---
tags:
  - 논문
  - OS
  - SNU_CSE_MS_AOS24S
---
> [!info] 본 작물은 [The design and implementation of a log-structured file system (SOSP '91)](https://dl.acm.org/doi/10.1145/121132.121137) 논문을 읽고 정리한 글입니다.

## 1. Abstract & Introduction

- 어차피 뒤에서 다 자세히 설명해 줄 테니 지금 당장 왜??? 라는 생각이 들어도 일단 넘어가자.

### Problem Statement

- CPU 속도는 음청나게 빨라지는 반면, disk 속도는 거의 그대로이고, 따라서 disk 속도가 여러 application 에서 병목이 되고 있다.
- 이 문제를 해결하기 위해 저자들은 (특히 다수의 작은 파일들을 처리할 때 더 특출난) [[Log-structured File System, LFS (File System)|LFS]] 라는 새로운 file system 을 개발했다고 한다.

### Log Structure

- 파일들은 메모리 상에 캐싱되기에 read 작업은 메모리 사이즈에 주로 영향을 받는다는 것을 전제로 깔고 간다.
- 이렇게 되면 (read 는 메모리에 더 의존하기 때문에) disk traffic 의 대부분은 write 가 차지하게 된다.
- LFS 는 모든 새로운 혹은 변경된 사항들을 *log* 의 형태로 sequential 하게 disk 에 저장한다.
- 이 방법을 사용하면 write performance 를 극적으로 늘릴 수 있고, seek time 을 거의 없애버릴 수 있다.
	- 어떻게 이것이 가능한지는 뒤에 나올것이니 조급해지지 말어라
- 또한 이러한 sequential write 는 crash recovery 에도 도움을 준다.
	- 기존의 UNIX file system 은 crash recovery 를 하기 위해 storage 전체를 다 훑어서 복구를 하지만, LFS 의 경우에는 log 의 마지막 일부분만 사용하면 되기 때문.
	- 이것도 아마 뒤에 더 구체적인 설명이 나올 것이다.
- *Log* 를 사용하는 방법은 기존에도 있었지만, 기존에는 log 를 단순히 데이터의 임시 보관으로만 활용했고, 기존의 random write 방식을 메인으로 사용했다고 한다.
- 하지만 LFS 의 경우에는 모든 데이터를 log 로 저장하고, 다른 저장 방식은 없다.

### Indexing Information

- 이 방식은 read 시에 성능 저하를 가져올 수 있다: new or updated data 가 log 에 저장되므로 이전에 write 된 데이터를 읽어오기 위해서는 옛날 데이터로 거슬러 올라가야 하기 때문.
- 하지만 LFS 에서는 이것을 indexing information 을 이용해 해결했다:
	- 옛날 데이터로 선형적으로 거슬러 올라가며 원하는 데이터를 찾도록 하는 것이 아닌, 해당 데이터의 위치를 log 에 남겨 한번의 indirection 으로 바로 해당 데이터를 찾을 수 있게 한 것.
	- 예를 들어보자면: A, B 중 B 만 변경되면 마지막 log 에는 B 의 변경사항만 적혀 있고 A 의 데이터를 읽기 위해서는 이전 log 를 봐야 한다.
	- 하지만 만약에 마지막 log 에 A 데이터는 어디에서 확인할 수 있습니다 라는 indexing information 까지 적혀 있다면, 더 빠르게 해당 데이터를 읽어올 수 있는 것.

### Segment, Segment Cleaning

- LFS 가 빠르고 효율적으로 작동하기 위해서는, storage 에 free space 가 많이 남아 있어야 한다.
- 하지만 LFS 의 경우에는 sequential write 를 하기 때문에, 아무런 조치도 취하지 않으면 free space 가 다 없어져 정상적으로 작동하지 않을 것이다.
- 이를 위해서 LFS 에서는 log 를 잘게 나눈 *Segment* 라는 단위와 이 segment 들을 정리해서 free space 를 확보하는 *Segment Cleaning* 이라는 방식을 사용한다.
	- *Segment Cleaning* 을 통해 잘게 나뉘어진 *segment* 들을 압축해서 free space 를 확보하는 것
	- 아마 이후의 log 에서 변경되어서 더이상 유효한 정보를 갖고 있지 않은 *segment* 들이 이때 정리될 것이다.
- 저자들은 여러 cleaning policy 들을 실험하였고, cost 와 benefit 에서 적절한 타협점을 찾은 효율적인 cleaning policy 를 찾아냈다고 한다.
	- 결론부터 말하면 잘 변경되지 않는 데이터와 변경이 잦은 데이터들을 나눠서 cleaning 을 한다.
	- [[Hot Cold Separation (Storage)|Hot cold separation]] 과 유사한 방법인 셈.

### Sprite LFS

- 저자는 *Sprite LFS* 이라는 프로토타입을 만들었고, [Sprite Network Operating System](https://en.wikipedia.org/wiki/Sprite_(operating_system)) 에서 실제로 사용하고 있다고 한다.
- 벤치마킹을 돌려본 결과, 다수의 작은 파일들을 write 하는 작업이 기존의 UNIX FS 에 비해 월등히 빨랐다고 한다.
- 이외의 read, large file write 작업의 경우에도 기존의 UNIX FS 와 비슷하거나 더욱 빠른 속도를 보여줬다고 한다.
	- 다만 random write 이후 sequential read 를 하는 한가지 경우에 있어서만 UNIX FS 가 더 빨랐다고 한다.
- 실험 결과, LFS write operation 의 대역폭이 디스크 최대 대역폭의 65~75% 에 달하는 것으로 확인됐다.
	- 나머지는 cleaning operation 에 사용됐다고 한다.
	- 이것은 기존 UNIX FS 에서 write operation 대역폭이 5~10% 밖에 안나오는 것에 비하면 아주 극적인 성능 향상인 셈.

## 2. Design for file systems of the 1990s

- 파일시스템 디자인은 두가지 요소에 영향을 받는다:
	- Technology: 하드웨어 측면에서의 기술의 발전
	- Workload: Process 가 수행하는 작업의 특성

### 2.1. Technology

#### CPU

- 파일시스템에서 CPU 와 Disk, Memory 의 기술 발전은 아주 큰 영향을 가져온다.
- 지난 날들 동안 CPU 는 아주 빠르게 발전해 왔고, 이를 최대로 활용하려면 Disk 와 Memory 도 그에 맞는 속도로 발전해 와야 할 것이야
- 근데 특히 Disk 는 발전속도가 아주 더디고, 이것이 결국에는 발목을 잡고 있는 것이 현재 상황이라고 한다.

#### Disk

- Disk 가 그렇다고 해서 발전이 없는 것은 아니다; 이놈도 지난 세월동안 아주 많은 발전을 해왔다.
- 하지만 진행되온 주된 발전은 금액을 낮추고 용량을 크게 하는 것이었고, 속도를 더욱 빠르게 하는 것은 발전하긴 했지만 CPU 의 발전 속도를 쫒아가기에는 역부족이었다.
- 그 이유에 대해 좀 더 분석해 보자: 디스크의 성능을 높이는 것은 크게 (1) 전송 대역폭과 (2) 접근 시간과 관련이 있다.
- 이때 전송 대역폭의 경우에는 여러개의 disk (여기서 disk 는 HDD 내의 원판을 말하는 것인듯) 혹은 head 를 사용하는 방법으로 개선이 가능하다.
- 하지만 access time 의 경우에는 결국에는 disk 를 돌리고 head 를 움직이는 다소 기계적인 작업이기 때문에, 발전 속도에 제한이 있다.
- 따라서 만약 application 이 다수의 파일들을 seek time 을 곁들여서 접근해야 한다면, 해당 application 은 CPU 가 발전하면 뭐하노 데이터를 읽어오지를 못하는데

#### Memory

- Memory 같은 경우에는 발전을 거듭하며 크기가 점점 커지고 있다.
- Disk 에서는 속도에 비해 크기의 발전이 주되게 일어나는 것이 골칫거리였다면, memory 는 이 크기가 커지는 것이 전반적인 성능 향상까지 같이 이끌어 내게 된다.
- 이것은 메모리가 캐시로 사용되기 때문 - 현대의 FS 는 최근에 사용된 데이터를 메모리에 캐싱하는 방법을 사용하기에, 메모리의 크기가 커진다는 것은 그만큼 더 많은 데이터를 캐싱할 수 있다는 얘기와 같다.
- 이것은 두가지 영향을 가져온다.
- 첫째는, 더 많은 데이터를 메모리에 올려 놓을 수 있기 때문에, read 작업이 disk 에 덜 의존한다는 것이다.
	- 하지만 write 의 경우에는 결국에는 disk 에 반영되기 때문에 상대적으로 disk 의존하는 비중이 크다.
- 둘째는, 메모리를 버퍼로 사용해 데이터들을 메모리에 모아 한번에 disk 로 write 할 수 있다는 것이다.
	- 버퍼링은 더욱 더 효율적으로 write 할 수 있게 해준다.
		- 이렇게 생각하면 된다: 만일 5MB 가 버퍼링되고 10MB 를 write 해야 한다면, 두번의 write 가 필요하고, write 할 위치를 seek 하여 write 를 한 후에는 새로운 위치를 seek 하여 이어서 write 해야 할 수도 있다. (즉, 2번의 seek)
		- 하지만 10MB 가 버퍼링된다면 write 전 한번의 seek 으로도 가능하기에, 더욱 더 효율적이 되는 것
- 물론 버퍼링이 항상 좋은 것은 아니다; 버퍼링을 하게 되면 crash 상황에서 데이터가 날아갈 가능성이 더 커지게 된다.
	- 본 논문에서는 crash 에 대해 언제든지 예상치 못하게 발생할 수 있고, 이를 해결하기 위해 최대 분단위의 downtime 까지는 인정하는 것으로 가정했다고 한다.

### 2.2. Workloads

- 저자는 Workload 를 크게 두 분류로 나누어 접근했다: 크기가 작은 파일과 큰 파일
	- 그리고 결론부터 말하자면, LFS 은 크기가 작은 파일의 성능 향상에 초점을 맞췄다고 한다.

#### Small files

- 크기가 작은 파일들은 FS 에서 다루기 까다로운 반면, 실생활에서는 아주 자주 사용되는 형태이다.
	- 가령 사무실에서 사용되는 word processor 와 같은 파일들의 경우에도, 조사 결과 KB 단위의 아주 작은 파일들이었다.
- 이 파일들은 small random IO 를 유발하고, 이들을 생성하거나 삭제하는 것도 파일의 metadata (inode 와 같은) 를 건드려야 하기 때문에 마찬가지로 small random IO 가 발생한다.

#### Large files

- 슈퍼컴퓨팅 분야에서는 큰 사이즈의 파일들에 대한 sequential access 가 필요한데, 이들의 성능 저하는 file system design 에 있지는 않다.
- 이러한 파일들을 인접한 cylinder 에 배치해 적은 seek time 으로 sequential 하게 접근하게 해주는 기술은 이미 존재한다. (아마 [[논문 - A Fast File System for UNIX|FAST FS]] 도 이것의 일종일듯)
- 이들의 성능을 좌우하는 것은 대역폭과 많이 연관되어 있고, 따라서 LFS 에서는 큰 파일들에 대한 성능 향상은 하드웨어에 맡기고, 작은 파일들에 대한 성능 향상에만 집중했다고 한다.

#### 2.3. Problems with existing file systems

- 당시의 FS 는 두 가지 문제점이 있었다고 한다:
	- 데이터들이 디스크에 너무 흩뿌려져 있어서 small access 가 많이 발생했고
	- Write 가 다소 동기적으로 (synchronous) 수행된 것
- 저자는 [[논문 - A Fast File System for UNIX|UNIX FFS]] 를 대표적인 prior work 으로 잡고 비교를 했으나, 다른 FS 에도 동일하게 적용되는 문제점이었다고 한다.

#### Spread information

- 위에서 말한 것 처럼, 당시의 FS 들은 데이터들을 디스크에 흩뿌려 놓았고, 따라서 small access 가 너무나 많이 발생했다고 한다.
- 가령 UNIX FFS 의 경우에는 cylinder group 개념을 이용해 데이터들을 sequential 하게 배치하기는 하였으나, 다른 파일의 경우에는 (아마 다른 cylinder group 에 배치되어?) 물리적으로 다른 위치에 배치되도록 하였다.
- 또한 UNIX FFS 는 inode 와 (directory 내에 있는) file name,  file content 를 모두 격리시켜 놓았다.
	- 따라서 UNIX FFS 에서는 하나의 파일을 생성하기 위해서는 적어도 5번의 access 가 필요하다.
		- inode
		- 파일 데이터
		- directory entry
		- directory inode
		- ~~(하나는 모르겠음..)~~
- 따라서 small file 하나를 생성할 때에는 max bandwidth 의 5% 밖에 사용하지 못하고, 나머지는 전부 seek time 에 소모된다.

#### Synchronous writes

- 나머지 하나의 문제는 write 작업이 *synchronous* 하게 이루어진다는 것이다.
	- 좀 더 쉽게 말하면, 하나의 작업을 시작하기 위해서는 이전 작업이 끝나기를 기다려야 한다는 것이다.
	- 반대인 *asynchronous* 는 write 작업을 background 에서 수행되도록 맡겨 놓고, 다음 작업을 받는 것을 의미한다.
- 또 다시 UNIX FFS 를 꺼내오자면 여기에서는 file data 는 asynchronous 하게 write 가 이루어지지만 inode 나 directory 같은 경우에는 synchronous 하게 이루어진다.
- 따라서 small file write 의 경우에는 어차피 file data 의 크기는 얼마 안되기 때문에 이러한 inode, directory 에 대한 synchronous write 에 모든 정신이 팔려버린다는 것.
- 이러한 단점때문에 결국에는 좋아진 CPU 성능이나 memory cache 의 장점들이 모두 쓸모 없게 되어 버린다.
- 심지어 NFS 의 경우에는 기존에는 없었던 synchronous 작업까지 추가했고, crash recovery 기능이 있기는 하지만 이 기능때문에 성능이 더욱 더 저하되는 등의 문제점이 있었다고 한다.

## 3. Log-structured file system

- LFS 의 위와 같은 문제점을 해결하기 위한 가장 핵심 키워드는 이것 두개이다:
	1. Memory cache 에 변경사항들을 sequential 하게 buffering
	2. 모든 변경사항을 한번의 writing operation 에서 디스크에 sequential 하게 write
- 이러한 방법을 이용해 LFS 는 random synchronous small write 를 sequential asynchronous large-amount write 로 변환하고, 결과적으로 대역폭을 최대로 활용할 수 있게 한다.
- 원리는 간단하긴 하지만 이로인해 발생하는 두가지 문제점이 있고, 이들을 [[#3. Log-structured file system|3번 섹션]] 에서 다루고자 한다.
	- 어떻게 sequential update log 에서 원하는 데이터를 읽어올 수 있을까? - [[#3.1. File location and reading|3.1]] 섹션
	- 어떻게 sequential write 에 필요한 free space 들을 확보할 수 있을까? [[#3.2. Free space management segments|3.2]], [[#3.3. Segment cleaning mechanism|3.3]], [[#3.4. Segment cleaning policies|3.4]], [[#3.5. Simulation results|3.5]], [[#3.6. Segment usage table|3.6]] 섹션

### 3.1. File location and reading

- Log-structured 에서는 새롭거나 변경된 데이터가 log 에 기록되기 때문에 log 에서 원하는 데이터를 읽어들이기 위해서는 선형 탐색 (아마 최신 log 부터 거슬러 올라가는 방식으로) 을 해야 될 것 같으나, LFS 는 그런식으로 구현되지 않았다.
- LFS 는 기존의 FFS 와 거의 비슷하거나 조금 더 빠르게 데이터를 읽어들이는 것을 목표로 한다.
- LFS 에서 random access read 를 지원하기 위해 도입한 것이 index structure 이다.

#### Index structure - inode map

- 일단 LFS 나 FFS 나 기본적인 데이터 구조는 동일하다:
	- 동일하게 inode 를 사용하고,
	- 여기에는 권한같은 metadata 와
	- [[논문 - A Fast File System for UNIX#Traditional File System - Bell Labs 버전|direct, indirect block]] 들의 주소가 저장됨
- 따라서 inode 를 찾은 이후에는 (direct 혹은 indirect block 을 따라가서 read 하면 되므로) IO 횟수는 LFS 나 FFS 나 동일하다.
- 그럼 이제 LFS 의 read 성능을 FFS 와 비슷하게 유지하려면 inode 를 어떻게 찾냐가 관건일 것이다:
	- 일단 FFS 에서는 inode 의 위치가 정해져 있었다. inode number 를 이용해 간단한 계산으로 inode 의 주소를 계산해 낼 수 있었다.
	- 하지만 LFS 에서는 inode 가 정해진 위치에 저장되지 않고 log 내의 어딘가에 저장된다.
	- 이것이 LFS 에서 *inode map* 을 도입한 이유이다:
		- *inode map* 은 file id number 와 inode 주소를 연결지어 놓은 테이블이다.
		- 따라서 file id number 를 알면 inode map 을 통해 inode 가 어디에 있는지 바로 알 수 있다.
	- 그럼 이 inode map 은 어디에 있는가
		- 일단 이놈은 block 단위로 쪼개어져 log 에 포함되게 되고
		- 이 inode map 을 구성하는 block 들의 위치는 *Checkpoint Region* 이라 불리는 log 밖의 고정된 위치에 저장되게 된다.
	- inode map 은 생각보다 작고, 따라서 (물론 전부가 memory 에 올라가지는 못하더라도) inode map 의 active portion [^active-portion] 은 memory 에 캐싱되어 inode map 을 접근하는 과정은 disk 에 거의 접근하지 않는다고 한다.
- 정리하자면, *checkpoint region* 을 통해 *inode map* 의 block 을 찾고, 이걸 통해 *inode* 를 찾은 후에는 FFS 와 동일하게 작동하는 것이다.
- 아래 그림은 LFS 와 FFS 의 작동 data lookup 과정을 그린 것이다.
	- LFS 에서 inode map 으로 inode 를 찾아가는 점선 화살표를 제외하면 양쪽은 동일한 과정을 거쳐서 data block 을 찾게 된다.
	- 하지만 차이점이라면, FFS 보다 LFS 가 더 공간을 컴팩트하게 활용하고 있다는 것이다.

![[Pasted image 20240402015524.png]]

### 3.2. Free space management: segments

- 시간이 흐르면 log 가 점점 쌓여서 더 이상 공간이 없게 되고 이때 free space 는 유효한 데이터와 더불어 삭제되었거나 변경된 파일들로 채워지게 된다.
- 따라서 모종의 작업을 하여 이 free space 를 확보하는 것이 필요하다.
- 이것을 위해서는 *Threading* 과 *Copying* 두가지 방법을 사용할 수 있다고 한다.

#### Threading

![[Pasted image 20240402064251.png]]

- 위 그림에서 New data block 이랑 Previously deleted block 이 잘 구분 안되긴 한데
- Threading 이란 live data 를 그냥 냅둔 상태로 sequential write 시에 live data block 을 만나면 건너뛰는 것이다.
	- 그리고 이때 log block 사이의 pointer 는 유지되어 crash recovery 에 사용된다 [^log-block-pointer].
- 장점은 당연히 cost 가 적다는 것이다: 데이터를 복사하는 과정이 없기 때문에 당연히 적은 비용으로 수행할 수 있다.
- 단점은 benefit 이 적다는 것이다: live data block 이 모여있지 않고 듬성듬성 있기 때문에, free space 들이 파편화되게 되고, 따라서 큰 파일을 write 하는 것이 불가능하거나 [^write-large-file-on-thread] 기존의 FS 에 비해 성능 개선이 많이 이루어지지 않게 된다.

#### Copying

![[Pasted image 20240402065553.png]]

- 다음 방법은 Copying 으로, 이것은 live data block 들을 압축하여 log 의 시작점으로 옮기는 방법을 의미한다.
	- 물론 log 시작점이 아니라 다른 FS 나 다른 LFS 로 옮길 수도 있다고 한다.
- 장단점은 [[#Threading|Threading]] 의 반대이다.
- 즉, 장점은 live data 들이 압축되어 log 시작점이 모이기 때문에 비교적 큰 크기의 free space 를 확보하는 것이 가능하기에 성능 저하가 적은 (benefit 이 많은) 것이지만
- 단점으로는 live data 를 복사해야 되기 때문에 여기서 발생하는 overhead 가 있어 cost 가 크다는 것이다.
	- 특히 long-lived data 에 대해서는 이러한 문제가 더 심하게 발생한다 [^long-lived-data].

#### Hybrid (Segment)

- LFS 는 *Segment* 라는 단위에 대해 위 방법 둘 모두를 이용해서 trade-off 상황에 대한 타협점을 찾는다.
- 디스크 전체를 고정크기에 sequential write 만 가능한 *Segment* 로 나누고, *segment* 내에서는 [[#Copying|copying]] 을 수행한다.
	- 즉, *segment* 내의 live data 들은 압축되어 복사된다.
- 그리고 *segment* 외부적으로는 [[#Threading|threading]] 을 수행한다.
	- 만일 하나의 *segment* 에 대해 live data 로 전부 채워져 있다면, 해당 *segment* 는 건너뛰는 것.
- *Segment* 는 크기가 꽤 크다. (512KB ~ 1MB) 따라서 *segment* 에 대한 seek time 은 *segment* 의 데이터를 read/write 하는 시간에 비해 상대적으로 작아지고, 따라서 대역폭을 최대로 활용할 수 있게 된다.

### 3.3. Segment cleaning mechanism

- Segment 에 대해 [[#Copying|copying]] 작업을 수행하는 것을 *Segment Cleaning* 이라고 한다.
- 세 단계에 의해 이루어 진다:
	1. 여러 개의 segment 들을 메모리로 읽어들인 뒤,
	2. 그 안에서 live data 를 선별해 내고
	3. 더 적은 수의 segment 들로 이 live data 를 복사해 넣고 읽어들인 segment 들은 clean 으로 마킹해 놓는다.

#### Segment summary information

- Segment cleaning 과정에는 이 두 문제점이 있다:
	1. 어떻게 live data 를 구별해 낼 것인가?
	2. 어떻게 live data 의 소속 (해당 live data 를 소유한 file) 을 알아내 주소가 변경되었음을 inode 에 반영할 것인가?
- LFS 에서는 이 문제를 segment 별로 *Segment Summary Information* 을 유지하는 것으로 해결했다.
- 여기에는 segment 의 block number 와 file number 간의 mapping 이 되어 있다.
	- 이렇게 하면 일단 문제점 (2) 는 해결된다: block number 를 통해 file number 를 알 수 있고, 따라서 [[#Index structure - inode map|inode map]] 을 통해 inode 를 찾을 수 있게 됨.
- 이 *segment summary information* 으로 live data 를 식별해 내는 것은 다음과 같이 할 수 있다.
	- 우선 이것으로 한 block 에 대한 inode 를 찾은 다음
	- inode 의 direct, indirect block 이 해당 block 을 여전히 참조하고 있는지 확인하면 되기 때문.
- *Segment summary information* 은 segment 당 하나씩 들어가고, 가끔 하나 이상이 들어갈 때도 있다.
	- 이것은 segment 하나를 채우기 위해 하나 이상의 log 가 필요할 때 인데,
	- Memory cache 로 부터 들어온 dirty block 들로 하나의 segment 를 채우기는 힘들 때 이런 일이 발생한다고 한다 [^dirty-block-cache].
- *Segment summary information* 은 write 작업에 부과하는 overhead 도 적고, crash recovery 등에서도 사용될 수 있어 아주 유용하다고 하네

#### Inode map version number field

- Segment summary information 으로 live data 를 선별해 내는 과정은 inode map 에 *version number* 필드를 추가하는 것으로 최적화가 가능하다.
- 해당 필드의 값은 파일이 삭제되거나 파일 사이즈가 0이 되면 증가한다.
	- 라고 저자는 말하고 있지만 일단은 그냥 말의 의미에 충실하게 파일 데이터가 변경되면 version number 도 올라가는 것으로 생각하자.
- File number 와 version number 를 합친 것을 *UID (Unique ID)* 라고 하고, 이놈을 이용해 liva data 를 더욱 빠르게 선별해 낼 수 있다.
	- 일단 segment summary information 에 file number 가 아닌 UID 와 block number 를 매칭시켜 놓는다면
	- 해당 block 이 어떤 file 의 어떤 version 에 mapping 되어 있는지 저장되어 있는 셈이다.
	- 이때 inode map 에 있는 file number + version number 와 비교해 봤을 때, 일치한다면 변경점이 없다는 의미이기 때문에 live data 인 것이고,
	- 반대로 일치하지 않는다면 변경된 것이 있다는 의미이기 때문에 live data 가 아닌 것으로 판단할 수 있는 것.
- 여기까지 본다면 LFS 에는 free space 를 위한 list 나 bitmap 이 없다는 것을 알 수 있을 것이다.
	- 얘네들은 추가적인 memory 와 저장공간을 필요로 하고 crash recovery 를 어렵게 만들기에, 이것을 없애는 것은 분명한 개선이다.
	- 만일 쟤네들이 있었다면, 이것의 crash recovery 를 위한 추가적인 parity 도 필요했을 것이다.

### 3.4. Segment cleaning policies

- Segment Cleaning 을 위해서는 다음의 네 가지 정책이 필요하다:
	1. 언제 segment cleaning 을 진행할까? 낮은 우선순위의 background 로? 아니면 밤에? 아니면 공간이 없을 때?
	2. 한번에 얼마나 많은 segment 들을 clean 해야 할 까? 더 많이 clean 하면 당연히 free space 도 많이 생기겠지만 그만큼 cleaning cost 도 늘어날 것이다.
	3. 어떻게 cleaning 할 segment 를 선정할까? 가장 파편화가 많이 진행된 segment 가 적절해 보이지만 이것이 정답은 아니었다.
	4. 새로운 Segment 내의 block 들은 어떻게 배치할까? 지역성을 살려서? (가령 같은 디렉토리의 파일 등) 아니면 마지막 변경 시각을 기준으로 정렬해서?
- 저자는 (1) 번과 (2) 번 policy 에 대해서는 크게 다루지 않았다고 한다. 얘네들은 LFS 의 성능에 크게 영향을 끼치지 않았기 때문.
	1. 일단 segment cleaning 은 clean segment 가 10 개정도보다 적어지면 진행한다.
	2. 그리고 한번에 10 개정도씩 cleaning 을 진행하고, 50~100 개정도의 clean segment 가 확보되면 멈춘다.
- 반면에, (3) 번과 (4) 번 policy 에 대해서는 LFS 의 성능과 직결되었기 때문에, 면밀한 분석을 진행했다고 한다.

#### Write Cost

- 일단 이름에서부터 알다시피 클수록 안좋은 값이다.
- 정의는 "새로운 데이터 1 바이트를 write 하는 데 걸리는 시간" 이다.
	- "시간" 이기 때문에 cleaning overhead 뿐 아니라 seek time 등 모든 것을 포함한 모든 것이 고려된다.
- 이 값은 대역폭으로 환산하면 어떤 값인지 더욱 이해가 잘 될것이다: $bandwidthRate = 1 / writeCost$ 정도로 대역폭으로 환산된다.
	- 즉, $writeCost$ 가 1 이라면 new data write 에 100% 의 대역폭을 활용하고 있는 것이고
	- 10 이라면 10% 의 대역폭을 활용하고 있는 셈.
	- 나머지는 cleaning 등에 사용되고 있는 것이다.
- 결론부터 말하자면, LFS segment cleaning 의 $writeCost$ 는 다음과 같이 계산된다:

![[Pasted image 20240402100347.png]]

- 이제 왜 저렇게 되는지 살펴보자.
- LFS 의 경우에는 segment 의 크기가 크기 때문에, seek time 과 latency time 등은 무시된다.
	- 위에서 말한 것처럼, r/w 에 걸리는 시간이 더 크기 때문.
- 따라서 write cost 를 다음과 같이 추산할 수 있다.
	- $writeCost = totalWriteTime / writeNew$ 에서
	- $totalWriteTime$ 에 (1) seek time, (2) latency time, (3) cleaning 에서의 segment 를 읽는 시간, (4) cleaning 에서의 live data 를 write 하는 시간, (5) 새로운 데이터에 대한 write time 이 포함되는데,
	- (1) 과 (2) 는 무시할 수 있으므로 나머지 (3 + 4 + 5) 를 새로운 데이터에 대한 write 시간 (5) 로 나눈 값이 $writeCost$ 이다.
	- 즉, $writeCost = (readSegs + writeLive + writeNew) / writeNew$ 가 되는 것.
- 여기서 segment utilization factor 를 $u$ 라고 하자.
	- 이 값은 cleaning 을 하려고 하는 segment 들에 대해 live data 가 차지하고 있는 비중 (0 ≤ $u$ ≤ 1) 이다.
	- 즉, 이 값은 cleaning 이후에 남아있게 되는 data 의 양이라고 생각할 수 있다.
- 그리고 segment 들의 byte 크기를 $N$ 라고 하자.
- 그럼 각각의 값들은 $u$ 와 $N$ 으로 표현된다 [^time-byte]:
	- $readSegs = N$ : cleaning 작업에 segment 전체를 읽는다는 가정하에, $N$ byte 를 읽어들임
	- $writeLive = N * u$ : cleaning 작업에서 live data 만이 복사되어 write 되기 때문에, segment 크기에서 live data 가 차지하는 비중만이 write 됨
	- $writeNew = N * (1 - u)$ : cleaning 의 결과로 확보된 나머지 공간에 새로 write 가 가능하기 때문에 전체 사이즈에서 live data 가 차지하는 사이즈를 뺌
- 결국에는 위의 그림과 동일하게 되는 것이다.
	- 다만, 몇가지 예외? 랄 것이 있다.
	- 만약 live data 가 하나도 없을 때에는 cleaning 이 발생할 필요가 없기 때문에, $writeCost$ 는 1이다.

#### Choosing a segment to clean

![[Pasted image 20240402102745.png]]

- 위 그래프는 FFS today (기존의 UNIX FFS) 와 FFS improved (logging 및 delay writing 을 도입한 UNIX FFS 의 개선판) 에서의 write cost 에 대한 그래프이다
	- 실선이 LFS 에 대한 $u$ - $writeCost$ 관계
	- 굵은 점선은 FFS today 에 대한 $u$ - $writeCost$ 관계
	- 얇은 점선은 FFS improved 에 대한 $u$ - $writeCost$ 관계
- 보면 FFS today 는 write cost 가 10 (대역폭이 10%) 정도 나오고, FFS improved 는 write cost 가 4 (대역폭이 25%) 정도 나오는 것을 볼 수 있다.
- 이것을 기준으로 LFS 에서 어떤 segment 를 cleaning 할 지 정해보자.
	- 만약에 LFS 가 FFS today 보다 나은 성능을 보여주고 싶다면, $u$ 가 $0.8$ 인 segment 를 clean 하면 될 것이다.
	- 그리고 FFS improved 보다 나은 성능을 보여주고 싶다면, $u$ 가 $0.5$ 인 segment 를 clean 하면 된다.
- 근데 여기서 관심을 가지는 utilization 이 disk 전체가 아니라 cleaning 하고자 하는 segment 이기 때문에, 어떤 segment 는 평균보다 낮은 utilization 을 보여줄 수도 있고, 이때에는 제일 under-utilized 한 segment 를 선택할수도 있다 한다...
- 여기에서도 cost 와 benefit 사이에 trade-off 가 있다.
	- Utilization 이 낮아지면 대역폭은 올라가 더 성능은 좋아지지만
	- 말 그대로 사용하는 비율이 적어지는 것이기에 저장할 수 있는 데이터의 양은 더 적어진다.
	- 하지만 이러한 경향성은 LFS 에만 적용되는 것은 아니다; FFS 도 최대 90% 만 사용하게 하는 제한이 걸려 있다.
- 이 trade-off 를 상쇄하기 위해서 특정 segment 는 거의 빈 상태로 놔두고 나머지 segment 들을 거의 다 채울 수 있게 하는 bimodal segment distribution 전략을 취할 수 있다. (이 내용이 [[#3.5. Simulation results|다음 문단]] 부터 나온다.)

### 3.5. Simulation results

> [!fail] 여기부터 대충 정리함

- LFS uniform 의 경우
	- Access: 모두 동일한 확률
	- Cleaning policy: Greedy - utilization 이 가장 낮는 segment 부터 cleaning
	- Reorganize: live block 의 순서는 바뀌지 않음
- LFS hot-and-cold
	- Access: 특정 파일은 자주, 나머지 파일은 덜 자주
	- Cleaning policu: 마찬가지로 greedy policy 적용
	- Reorganize: live block 이 age 에 따라 정렬됨 - hot 과 cold 가 다른 segment 에 분리되는 효과
- uniform 에서보다 hot-and-cold 가 더 안좋았음
- greedy 에서는 가장 utilization 이 안좋은 놈을 clean 하기 때문에 모든 segment 들이 전반적으로 낮아지게 된다
- 근데 cold 의 경우에는 utilization 이 그리 빠르게 떨어지지 않기 때문에 아주 많은 양의 free space 들을 아주 오랜 기간동안 잡고 있음
- hot 은 free space 를 만들어도 곧 다시 사용되기 때문에 free space 를 생성하는 주기를 늦추고 더 많은 데이터가 invalid 가 되도록 냅두는 방식을 사용한다.
- 정리하면 free space 의 가치는 데이터의 안정성 (stability) 에 달려있다
- 하지만 이것은 예측하기 힘들다
- 따라서 나이가 많은 데이터는 앞으로도 잘 안바뀔 것이라는 가정하에 나이를 기준으로 hot cold 를 구분한다
- 

#### Cost-benefit policy

![[Pasted image 20240402111449.png]]

- cold segment 의 경우에는 변화가 적기 때문에 free space 가 적게 생기고, 오랜 기간동안 free 로 남게 된다
- hot segment 의 경우에는 변화가 커서 free space 도 많이 생기지만 곧 다시 새로운 데이터가 write 될 것이다.
- 따라서 hot 보다는 cold segment 의 free space 가 더 가치가 있다
	- 어차피 금방 occupied 될 hot free space 보다는 오랜기간 free 로 남아 있을 cold free space 가 더 가치있다
- 위 수식에서 cost 는 cleaning 에서의 read 데이터 양 (segement 전체, 즉 1) 과 cleaning 에서의 live data 의 양 (u) 의 합이 될 것이다
- 그리고 age 는 segment 내의 가장 최근에 변경된 block 을 기준으로 산출한다.

- cost-benefit policy 에서 cold segment 는 75% util 에서 clean 이 이루어졌고, hot 은 15% utili 에서 이루어 졌다.
- 결과적으로 write cost 를 50% 정도 줄이고
- 

### 3.6. Segment usage table

- Cost-benefit policy 를 지원하기 위해, *Segment Usage Table* 이 추가되었다
- segment usage table 에는 segment 의 live byte 와 last modified time 이 들어간다
	- 이 값들은 segment 에 write 되기 시작할 때 채워지고, 데이터가 삭제/변경되며 live byte count 가 내려간다
	- live byte cound 가 0 이 되면 clean 없이 사용 가능
- segment usage table 의 block 들은 log 에 저장되고 checkpoint 에 해당 block 들이 어디에 있는지 저장된다
- [[#Segment summary information|Segment summary information]] 에는 가장 어린 block 의 나이를 기록한다.
	- LFS 에서는 file 을 block 단위로 modify time 을 체크하지는 않는다.
	- 대신 파일 전체 단위로 modify time 을 체크하기에 전부가 바뀌는 것이 아닌 일부 block 만 바뀌는 경우에는 이 시간이 변경되지 않는다.
	- 따라서 추후에는 block 단위 modify time 을 넣으려고 한다고 한다.

### 4. Crash Recovery

- 일반적으로 crash 가 발생하게 되면 reboot 중에 이것을 다 고치게 되는데
- Logging 기능이 없던 UNIX FS 의 경우에는 어쩔 수 없이 모든 metadata 를 뒤지며 파일이 정상적으로 존재하는지, 누락된 데이터는 없는 지 등을 체크한다.
- 하지만 이것은 몇십분이나 되는 시간을 먹게 되는 문제점이 있었다
- 하지만 LFS 에서는 마지막 로그에 마지막 작업이 남아있기 때문에 문제가 생겼을 만한 데이터의 범위를 쉽게 좁힐 수 있고, 따라서 빠르게 복구가 가능하다
- Crash recovery 를 위해서는 checkpoint 와 roll-forward 기술이 사용된다.

### 4.1. Checkpoints

- Checkpoint 는 한 시점에서의 로그를 가리키고, 이 시점에서는 모든 FS 의 구조와 데이터들이 일관되고 완료되었다는 의미를 가진다.
	- 말이 좀 모호하긴 한데 이상하게 생각할 것은 없다; 그냥 언제든 이 시점으로 돌아와도 정상작동한다고 정도로 생각하자
- 모든 변경사항들을 log 에 적고
- 위에서도 여러번 언급한 checkpoint region 을 디스크의 특정한 위치에 적는다.
	- inode map, segment summary information 들의 block 위치
	- 현재 시간
	- 마지막 segment 의 위치
- 재부팅 중에 이 checkpoint region 을 읽어서 메인 메모리 데이터 구조를 초기화함
- HA 를 위해 두개의 checkpoint region 을 갖고 있다
- checkpoint operation 에서 두개의 checkpoint region 을 바꾼다?
- checkpoint time 은 checkpoint region 의 마지막 block 에 있기 때문에 checkpoint operation 이 실패할 경우 이 시간이 업데이트되지 않는다
- checkpoint operation 에서는 두 checkpoint region 을 모두 확인하고 더 일찍 생성된 놈을 사용한다.
- 주기적, fs unmount, system shutdown 때 이 checkpoint 를 생성한다
- 이 주기가 짧으면 recovery 시 더 최신의 checkpoint 가 사용되기에 더욱 신뢰성이 있지만, 생성의 오버헤드가 있고 주기가 긴 경우에는 반대
- 보통 LFS 에서는 30초로 설정
- 이것도 너무 길다
- 대안으로는 특정 양의 새로운 데이터가 작성되었을 때 수행하는 것
- 이것은 recovery time 을 일정하게 유지하고 checkpoint overhead 를 줄일 수 있다

### 4.2. Roll-forward

- 문제가 생겼을 때 재부팅을 해서 checkpoint 로 돌아가는 것은 간단하고 빠른 해결방법이지만 checkpoint 이후의 데이터는 손실될 가능성이 있다
- 따라서 마지막 checkpoint 이후의 log 를 보면서 추가적인 복구를 하는 것이 roll-forward 이다
- segment summary information 을 보면서 최근에 write 된 block 을 찾고
- 만약 해당 block 이 inode 라면 그것을 inode map 에 추가한다
	- 이것은 해당 inode 와 연결된 data block 까지 복구되는 효과를 가진다
- 만약 해당 block 이 data block 이고, 연결된 inode 가 없다면 해당 write 가 완료되지 않은 것으로 간주해 복구하지 않는다. (아무짓도 안함)
- roll-forward 작업에서는 checkpoint region 의 segment usage table 의 utilization 값도 재조정한다.
	- checkpoint 이후에 추가된 데이터에 대한 segment util 은 0으로 표기되어 있을 것이기에, 재조정
	- 마찬가지로 checkpoint 이후에 삭제/변경된 데이터에 대한 segment util 로 재조정

#### Directory operation log

- directory 내용이 변경되었을 경우 LFS 는 *Directory Operation Log* 라는 특별한 record 를 log 에 추가한다.
	- 어떤 작업인지 (operation code)
	- 변경된 directory entry 의 위치 (directory 에 대한 inode number 및 directory 내에서의 index)
	- 변경된 directory entry 내용 (파일의 inode number 및 파일 이름)
	- 변경된 directory entry 에 해당하는 파일의 inode reference count
- 이 정보들을 이용해 directory entry 와 inode 간에 일관성을 유지한다.
	- directory entry 변경에 대한 log 는 있지만 inode 나 directory block 가 없다면, roll-forward 시에 directory 혹은 inode 를 생성한다.
	- 

## 5. Experience with the Sprite LFS

### 5.1. Micro-benchmarks

### 5.2. Cleaning overheads

### 5.3. Crash recovery

### 5.4. Other overheads in Sprite LFS

## 6. Related work

## 7. Conclusion

[^active-portion]: 이게 정확히 어떤 것을 의미하는 지는 잘 모르겠음.

[^log-block-pointer]: 뭔소린지 모르겠다.

[^write-large-file-on-thread]: 이것도 모르겠다. Live data block 을 skip 한다면 결국엔 상관없는 것 아닌가.

[^long-lived-data]: 본문에서는 long-lived data 에서의 문제에 대해 다음과 같은 예시로 설명하지만, 뭔소린지 모르겠다: "In the simplest case where the log works circularly across the disk and live data is copied back into the log, all of the longlived files will have to be copied in every pass of the log across the disk." 

[^dirty-block-cache]: 어떤 상황인지 잘 감이 안오긴 한다 그쵸?

[^time-byte]: 어느샌가 time 에서 byte 로 단위가 바꿔었는데 그냥 그런갑다 하자.