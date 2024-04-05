---
tags:
  - 논문
  - Storage
---
> [!info] 이 글은 USENIX ATC '21 에 소개된 [ZNS: Avoiding the Block Interface Tax for Flash-based SSDs](https://www.usenix.org/system/files/atc21-bjorling.pdf) 논문을 읽고 정리한 것입니다.

> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

## 1. Introduction

- 본 논문에서는 아래의 다섯가지 contribution 을 소개한다:
	1. 기존의 Block SSD 와 ZNS SSD 간의 성능 비교
	2. ZNS 에 대한 전반적인 리뷰
	3. Host software layer 에 ZNS SSD 적용하는 과정에서 배운 점들
	4. ZNS 를 사용하기 위해 Storage stack 전반을 수정한 내용
		- 여기에는 Linux 커널, F2FS 파일시스템, NVMe 드라이버, Zoned Block Device 서브시스템, fio 벤치마크 툴이 포함된다.
	5. RocksDB 에서 ZNS SSD 를 사용하기 위한 새로운 스토리지 백엔드로 ZenFS 구현

## 2. The Zoned Storage Model

### 2.1. The Block Interface Tax: 기존 방식의 문제점

- [[Logical Block Addressing, LBA (Storage)|Block Interface]] 는 이전의 HDD 를 위해 고안된 것으로, 고정된 크기의 block 들을 1차원 배열로 묶어 사용/관리하는 방식이다.
- [[Flash Memory, SSD (Storage)|SSD]] 가 등장했을 때에는 이러한 Block interface 와의 backward-compatibility 를 위해 [[Flash Translation Layer, FTL (Storage)|FTL]] 과 같은 레이어가 추가되었다.
- 하지만 SSD 와 HDD 는 작동 방식이 다르기에 FTL 은 여러 부작용 을 낳았다.
	- [[Garbage Collection, GC (Storage)|GC]] 오버헤드
	- GC 에서 데이터를 이동할 때 사용할 임시 저장 공간을 위한 [[Over Provisioning, OP (Storage)|OP]]
	- [[Flash Translation Layer, FTL (Storage)|FTL]] 을 위한 DRAM
	- GC 오버헤드를 줄이기 위한 Application level 의 최적화 - 에 따라 증가하는 복잡도
	- 성능을 예측하기 힘듦 (performance unpredictability)
- 위의 자원들 중 OP 와 DRAM 은 모두 현재의 SSD 가 감수해야 하는 아주 비싼 자원들이다.
- Block interface 를 위해 고안된 FTL 은 Host 가 LBA 에만 접근할 수 있도록 하여 Host 의 물리적인 데이터 저장 위치를 관리 권한이 박탈되었다.

### 2.2. Existing Tax-Reduction Strategies: 문제점을 해결하기 위해 이전에 시도된 것들

1. [[Multi-stream SSD (Storage)|Multi-stream SSD]]: GC 를 줄이는데 도움은 되나, 여전히 OP 공간과 FTL 을 위한 DRAM 을 필요로 한다.
2. [[Open Channel SSD, OCSSD (Storage)|OCSSD]]: GC 도 줄이고 OP 공간과 DRAM 의 필요성을 줄여주었지만, 모든 SSD 에 대응할 수 있는 인터페이스가 OS 에 구현되어야 하기 때문에 한계점이 있다.

### 2.3. Tax-free Storage with Zones: 문제를 해결하기 위한 접근

- "Backward-compatibility 는 포기하더라도, SSD 를 위한 새로운 방식의 Interface 를 만들자" 라는 생각으로 Block Interface Tax 문제에 접근한 것이 [[Zoned Storage Model (Storage)|Zoned Storage Model]] 이다.
- 해당 Model 에 대한 NVMe 의 구현체인 ZNS 는 이러한 기능을 제공해 준다:
	- Zoned Storage Model 와 완벽하게 호환됨
	- SSD 의 특징을 최대한으로 이끌어내 성능을 높임
	- (OCSSD와는 다르게) 각 디바이스의 특성과는 무관함

## 3. Evolving towards ZNS: ZNS를 도입해 보자

- ZNS 는 data placement 및 gc 과정을 host 에게 위임함으로써 device level 의 [[Write Amplification, WA and Write Amplication Factor, WAF (Storage)|WAF]] 를 없앴고, 따라서 OP 도 적게 사용하며 성능과 ssd 의 수명도 늘렸다

### 3.1. Hardware Impact

#### Zone Sizing

- Zone 은 여러 die 의 block 들 (이것을 *stripe* 라고도 한다) 로 구성된다.
- Zone size 가 커지는 것은 더욱 많은 die 의 block 들을 응집할 수 있으므로, (1) die-level fault 에서 데이터를 보호하기 쉽고 (2) 병렬 처리율이 높아진다는 장점이 있다.
	- 반대의 극단을 생각해보면 이해가 빠르다: zone 의 block 이 한 die 에 속하게 된다면,
	- (1) 해당 die 에 문제가 생기면 zone 전체가 날라가게 되고 [^1]
	- (2) 해당 die 에만 command 를 실행할 수 있으므로 병렬처리율도 낮아져 성능도 낮아진다.
- 반대로 커지는 것에 대한 단점은 zone 의 갯수가 작아지기 때문에 data placement 선택권이 낮아져 ZNS 의 이점을 살리지 못한다.
	- 만일 storage 전체를 커버하는 zone 하나만이 존재한다고 생각해 보자.
	- 그럼 모든 종류의 lifecycle 을 가지는 data 들이 하나의 zone 에 포함되게 되고, 결국에는 gc 를 해야 하거나 reset 시 valid data 가 날라가게 된다.
- 따라서 data placement 선택권을 최대한 주기 위해 zone size 를 최대한 줄이되, die-level fault 에 영향과 병렬 처리율 감소를 감당할 수준이 될 정도까지만 줄였다고 한다.
- 만일 reliability 를 포기한다면 zone(stripe)-wide parity 를 없애서 zone size 를 더욱 더 줄일 수 있으나 host level 에서 이런 parity 를 구현하거나 작아진 zone size 를 위해 IO queue depth 를 늘리는 것과 같은 희생을 감내해야만 한다.

#### Mapping Table

- 기존의 Block interface SSD 에서는 [[Flash Translation Layer, FTL (Storage)#Page level mapping|Fully-associative mapping table (Page level mapping)]] 을 사용했는데, 이것은 당연히 엄청난 양의 DRAM 공간을 필요로 한다.
- 하지만 ZNS 의 Sequential write constraint 는 이것을 [[Flash Translation Layer, FTL (Storage)#Block level mapping|erase block level]] 혹은 [[Flash Translation Layer, FTL (Storage)#Hybrid log-block FTL|hybrid fashion]] 으로 바꿀 수 있게 해서 DRAM 공간을 줄이거나 필요성을 아예 없앨 수도 있다고 한다 [^2].
- 어떻게 ZNS 가 이런 것을 가능하게 하는지는 설명 안한다.

#### Device Resources

- 이것은 [[Zoned Storage Model (Storage)#Open Zone Limit|Open Zone Limit]] 과 연관된 내용이다.
- Active zone 의 data 와 parity 를 위해서는 XOR 엔진이나 SRAM, DRAM 같은 자원과 parity 보존을 위한 power capacitor 가 필요하다.
- 하지만 zone 의 data 와 parity 의 사이즈는 아주 크고 [^3] 자원의 양은 한정되어 있기 때문에 8개에서 32개의 active zone 만을 유지할 수 있고 이것이 Open Zone Limit 으로 제한걸려있는 것.
- 이 active zone 개수를 늘리기 위해서는 다음과 같은 전략을 취할 수 있다고 한다 [^4] :
	- 더 많은 자원을 구비하거나 (adding extra power capacitors)
	- 최적화를 통해 자원 사용량을 줄이거나 (utilizing DRAM for data movements)
	- Parity 를 조금 포기하는 방법

### 3.2. Host Software Adoption

- 이 섹션에서는 ZNS 를 도입하기 위한 host software 변경 세 가지를 소개한다:
	- Host-side FTL (HFTL)
	- File System
	- End-to-End Data Placement
- ZNS 는 sequential write 가 기본 원리에 깔려있기 때문에, sequential write 를 자주 사용하는 application 에 적합하다.
	- 가령 [[Log Structure Merge Tree, LSM Tree (Data Structure)|LSM tree database]] 와 같은 것들
	- 당연히 in-place update 가 잦은 시스템은 ZNS 도입이 어렵다.

#### Host-side FTL (HFTL)

- 이놈은 ZNS 의 sequential write 와 application 의 random write (+ in-place update) 간의 다리 역할을 해준다.
- 기존의 FTL (SSD FTL) 과의 차이점은
	- 이름이 HFTL 인 만큼 SSD 에 포함되는 것이 아닌 Host OS 에 포함되는 계층이라는 것
	- SSD FTL 의 역할 중 (1) address translation mapping 과 (2) GC 만 담당하는것 이다.
- 이놈이 host 에서 작동한다는 것은, 다음과 같은 장단점을 가질 수 있다:
	- 일단 장점으로는 host 의 정보를 활용하여 data placement 와 gc 를 수행할 수 있도록 해준다
	- 단점 (주의할 점?) 으로는 host 와 cpu 및 mem 을 공유하기에 너무 많은 cpu 와 mem 을 먹지 않도록 해야 한다고 한다.
- 이것의 구현체는 다음과 같은 것들이 있다고 한다:
	- [dm-zoned](https://docs.kernel.org/admin-guide/device-mapper/dm-zoned.html)
	- [dm-zap](https://github.com/westerndigitalcorporation/dm-zap) - 논문 작성 시점에는 이놈만 ZNS 를 지원했다고 한다
	- [pblk](https://www.kernel.org/doc/html/v5.4/driver-api/lightnvm-pblk.html)
	- [SPDK FTL](https://spdk.io/doc/ftl.html)

#### File System

- File system 은 application 들이 "file" 형식으로 storage 에 접근할 수 있도록 해준다.
- File system 을 zone 과 통합함으로써 [^5], 여러 overhead 들 (data placement overhead 혹은 indirect overhead [^indirection-overhead] 와 같은 FTL 과 HFTL 이 발생시키는 overhead) 을 없앨 수 있다고 한다.
- 또한 file 의 데이터 특성 정보들을 data placement 에 활용할 수 있다.
	- 적어도 이러한 정보들이 file system 에서 인지할 수 있도록 해준다.
- 대부분의 file system 들은 in-place write 를 사용하기 때문에 zone 을 사용하기 힘들다.
- 하지만 [[Flash Friendly File System, F2FS (Storage)|f2fs]], [btrfs](https://en.wikipedia.org/wiki/Btrfs), [zfs](https://en.wikipedia.org/wiki/ZFS) 는 sequential write 자주 사용하고, 따러서 zone 또한 지원하도록 업데이트 되었다고 한다.
	- 물론 모든 write 가 sequential 한 것은 아니다; superblock 이나 metadata 같은 경우에는  in-place write 를 사용한다.
	- 하지만 이러한 non-sequential write 의 경우에는 strict log-structured write, floating superblock 과 같은 방법을 이용해 해결할 수 있다고 한다.
- 이러한 file system 에는 HFTL 의 로직들이 많이 포함된다고 한다.
	- Metadata 를 통해 on-disk 로 관리되는 LBA mapping table 이랄지
	- GC 기능이랄지
- 하지만 논문 작성 당시 위 file system 들은 ZAC/ZBC 만을 지원했고, 따라서 본 논문에서는 f2fs 에서 ZNS 를 지원하도록 개발했다고 한다.

#### End-to-End Data Placement

- End-to-End Data Placement 는 application 이 중간 fs 와 같은 layer 를 거치지 않고 직접 device 에 data placement 를 실시하게 하는 것이다.
	- 이렇게 함으로써 application 에는 data placement 에 대한 최대의 자율성을 제공해 줄 수 있고
	- 동시에 indirection overhead [^indirection-overhead] 도 줄일 수 있다.
	- 또한 application 자체에서 raw block device 에 접근하는 것이기에 성능이 향상되고 WAF 도 줄어든다.
- File system 을 포기하는 것은 당연히 쉬운 일은 아니다; file 형식을 사용할 수 없기 때문에, application 에 직접 zone support 를 추가해야 되고, data inspection, error checking, backup/restore operation 을 위한 tool 또한 제공되어야 한다.
- 이 방법을 사용하기에 용이한 application 은 당연히 sequential write 를 활용하고 있는 것들이고, 여기에는 대표적으로
	- LSM 을 활용하는 RocksDB
	- 캐싱 스토어인 CacheLib
	- 오브젝트 스토어인 Ceph SeaStore
- 본 논문에서는 RocksDB 에 ZNS E2E Data Placement 를 지원하기 위한 ZenFS 를 개발하였고, 이것을 f2fs 를 사용했을 때 등과 비교했다고 한다.

## 4. Implementation

- 본 논문에서는 ZNS support 를 위해 다음의 4가지 기여를 했다고 한다.
	- Linux kernel 수정
	- F2fs 수정
	- Fio 수정
	- ZenFS (ZNS 용 RocksDB backend store) 개발

### 4.1. General Linux Support

- Linux kernel 의 Zoned Block Device (ZBD) subsystem 은 zoned storage model 을 따르는 device 들에 대한 API 를 제공해 준다.
	- 이 API 들에는 list devices, report of zones, zone management (open, reset 등) 이 포함된다.
	- Kernel-level 및 user-level (`ioctl`) API 모두 제공한다더라.
- 이런 API 들을 활용해 fio 와 같은 툴들이 device-speecific 하지 않은 zoned storage model operation 을 이용하게 된다.
- 본 논문에서는,
	- ZBD subsystem 에서 ZNS SSD 를 등록하거나 나열할 수 있게 하기 위해 NVMe 드라이버를 수정했고
	- ZNS 를 테스트할 때 활용하기 위해 ZBD subsystem 에 [[Zoned Storage Model (Storage)#Zone Size, Zone Capacity|zone capacity]] attribute 와 [[Zoned Storage Model (Storage)#Active Zones Limit|active zones limit]] 을 추가했다고 한다.

#### Zone Capacity

- Linux kernel 은 모든 zone 에 대한 zone descriptor data structure [^zone-descriptor] 들을 host memory 상에 저장해 두고 사용하고, 문제가 생겼을 경우에는 특정 디스크로부터 다시 가져와서 사용한다.
- 논문의 저자들은 Zone descriptor data structure 에 zone capacity 라는 attribute 를 추가했다고 한다.
- 그리고 fio 와 f2fs 에서 해당 attribute 를 사용하기 위한 수정을 했다.
- fio 의 경우에는 그냥 zone capacity 내에서만 IO 를 수행하도록 수정하면 되었지만,
- f2fs 의 경우에는 수정할 것이 많았다고 한다.

![[zone_cap.png]]

- 기존의 f2fs 는 다음과 같은 특징을 가졌다고 한다.
	- f2fs capacity (zone capacity 랑 다른거임) 는 segment (2MiB) 단위로 관리되고, 이 segment 들이 모인 것을 section 라고 하며, 이놈의 크기가 zone size 이다
	- f2fs 는 section 의 segment 들에 sequential write 를 수행하고,
	- 일부만 write 할 수 있는 segment 따위는 없었다.
- 여기에 zone capacity 를 f2fs 에서 지원하기 위해 다음과 같은 변경이 이루어졌다
	- 기존의 세 segment type (free, open, full) 이외에 두개의 segment type (*unusable*, *partial*) 이 추가되었다고 한다.
		- *unusable* 은 zone 의 unwritable part (아마 zone size 에서 zone capacity 를 제하고 남은 공간) 을 나타내는 segment
		- *partial* 은 unwritable 과 writable 이 섞여있는 segment (zone capacity 가 끝나고 unwritable 이 시작되는 부근의 segment)
		- 즉, zone capacity 크기가 segment 크기의 배수가 아닌 경우에 partial 이 생김
- [[Shingled Magnetic Recording HDD, SMR HDD (Storage)|SMR HDD]] 에는 zone capacity 를 지원하지 않기 때문에, zone capacity 는 zone size 와 동일하게 초기값이 설정된다.

#### Limiting Active Zones

- [[Zoned Storage Model (Storage)#Active Zones Limit|Active Zone Limit]] 은 Zoned Block Device subsystem 에서 device listing 을 할 때 인식되어 kernel/user-space API 로 노출된다.
- 이것은 ZNS SSD 만의 특징이기에 SMR HDD 에는 필요하지 않는 값이고, 따라서 0으로 초기화된다.
- Fio 의 경우에는 이것을 위한 수정사항은 없다고 한다; 그냥 사용할 때 알아서 이 limit 을 지켜야 하고, 만일 그렇지 않는다면 IO error 가 발생한다.
- F2fs 의 경우에는 이 limit 이 f2fs 의 open segment limit [^open-segment-limit] 과 결부된다. f2fs 에서는 open segment limit 을 6으로 제한해 놓았고, 만일 device 가 active zone limit 을 6까지 지원하지 않는 다면, 그에 맞게 조정할 수 있다.

> [!note] 주인장의 한마디
> - Zone 은 여러 segment 들로 구성되는 것을 고려해 보면, open segment limit 이 너무 적은 것 아니냐 싶을 수 있다.
> - 근데 아마 zone 당 open segment 를 1개씩만 유지하는 것이 아닐까 싶다.
> - Zone 은 어차피 writing pointer 가 있는 segment 에만 write 할 것이기 때문에, 해당 segment 만 open 하면 되지 않을까.
> - 따라서 f2fs 의 open segment limit 이 6이기 때문에, f2fs 를 사용할 때에는 active zone limit 도 6을 넘지 못할 것 같다.

- F2fs 는 메타데이터를 [[Zoned Storage Model (Storage)#Conventional Zone|Conventional Zone]] 에 저장하는 것을 필요로 한다.
	- Zoned Storage Model 에도 있는 만큼 ZNS SSD 에서 이것을 지원하는 것이 기본이고, 따라서 본 논문의 저자도 이것과 관련해서는 딱히 수정을 하지 않았다고 한다.
	- 하지만 어떤 ZNS SSD 의 경우에는 이것을 지원하지 않는 경우도 있을 것이고, 이때에는 btrfs 나 dm-zap 에서 처럼 [[Zoned Storage Model (Storage)#Sequential-write-required Zone|Sequential write required zone]] 에서 일반적인 block interface 를 제공하도록 기능을 추가할 수도 있을 것이다.
- F2fs 에서는 Zoned device 들에서 [[Slack Space Recycling, SSR (File System)|SSR]] 기능을 사용하지 못하도록 되어 있다.
	- 이것은 어느 정도 성능 저하를 유발할 수 있는데, 그럼에도 불구하고 ZNS SSD 의 전반적인 빠른 성능때문에, 일반 SSD 에서 f2fs-SSR 기능을 사용했을 때보다 더 성능이 좋았다고 한다.

### 4.2. RocksDB Zone Support

- 이 섹션에서는 RocksDB 에서 Zoned device 를 사용하기 위해 ZenFS 라는 backend store 를 구현한 것에 대해 설명한다.
	- RocksDB 는 LSM 을 이용해 데이터를 저장 관리하고, 이것들을 이용해 seqential-only compaction 을 수행한다.
	- ZenFS 는 위와 같은 작업들을 최대한 활용한다.
- 본문에서는 RocksDB 의 개략적인 작동 원리에 대한 설명이 포함되어 있다. 이것은 RocksDB 공식 문서와 같이 정리한 [[Leveled Compaction (RocksDB)|Leveled Compaction]] 문서를 참고하자.
- LSM tree 는 여러개의 level 로 구현되고, 이 중 L0 은 메모리 안에 저장되고, 나머지는 storage 에 저장된다.
- 우선 L0 에서의 작동 과정을 보고 가자.
	- Key-value 데이터 쌍은 새롭게 추가되거나 변경될 경우 우선 L0 에 반영되게 되는데,
	- 구체적으로는 [[Write Ahead Log, WAL (Database)|WAL]] 으로 메모리에 저장되는 식으로 반영된다.
	- 그리고 이들은 주기적 혹은 메모리 공간이 다 찼을 경우 storage 에 저장하기 위해 flush 를 하여 하위 level 로 내려간다.
	- Flush 과정중에는 중복을 제거하고 Key 를 기준으로 정렬되어서 Sorted String Table (SST) 형식으로 SSD 에 저장된다.
		- 따라서 하나의 SST 는 중복되지 않고 key 를 기준으로 정렬된 key-value 쌍들로 구성된다.

> [!note] 주인장의 한마디
> - 이러한 SST 의 구조는 여러 프로그래밍 언어에서 찾아볼 수 있는 Map 와 유사하다고 생각할 수 있다.
> - 가령 [C++ std::map](https://en.cppreference.com/w/cpp/container/map) 의 경우에도 unique key 에 대해 정렬된 형태를 띄기 때문.

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

- RocksDB 는 File System Wrapper API 를 통해 다양한 backend storage 를 단일 인터페이스를 통해 사용할 수 있도록 설계되어 있다.
- Wrapper API 는 데이터의 단위 (SST 파일 혹은 WAL 등) 을 고유한 식별자 (파일 이름 등) 으로 식별한다.
- 이 식별자들은 파일과 같은 하나의 연속된 주소 공간 (byte-addressable linear address space) 상에 저장된다.
- 이 식별자들에 대해서는 add, remove, current size, utilization, random access, sequential r/w 의 연산이 가능하다.
- 따라서 이런 연산들은 file interface 과 유사하기에, RocksDB 도 file 을 주된 backend store 로 사용한다.
- 즉, 데이터 접근이나 버퍼링, free space management 등을 fs 의 도움을 받아서 사용하는 것이 흔하나
- File system 을 거치지 않고 zone 에 직접 data 를 넣는 e2e 방식을 사용하면 더욱 성능이 좋아질 것이기에 ZenFS 를 개발하게 된 것.

#### 4.2.1. ZenFS Architecture

---
---
---
## ZNS 특징

- ZNS 는 flash erase boundary 와 write ordering rule 들을 Host 에 노출시켜서 이러한 세금을 해결한다고 한다.
- NVMe Zoned Namespace Command Set Specification
- 기존의 Block interface 는 Block 을 1차원 배열로 취급해 관리했지만, ZNS 는 logical block 들을 zone 으로 묶는다
- zone 의 블럭들은 random read 는 가능하지만 무조건 sequential write 되어야 한다.
- 또한 zone 은 매 rewrite 작업때마다 erase 되어야 한다.
- ZNS SSD 는 zone 과  physical media boundary 를 정렬해서 데이터 관리를 Host 가 직접 하도록 한다?
- ZNS 는 디바이스들마다 다른 reliability 특성들과 media 관리 복잡성은 Host 로부터 감춘다?
- ZNS 는 효율적으로 erase block 을 하기 위한 책임을 Host 로 이전한다.
- LBA-PBA 매핑과 데이터 저장 위치 선정을 통합하는 것보다는 이러한 FTL 의 책임 중 일부를 Host 에 이관하는 것은 덜 효과적이다?

## ZNS 성능 측정

- Concurrent write 수행시 ZNS SSD 가 Block SSD 보다 2.7배 [[Throughput (Storage)|Throughput]] 이 좋았다.
- Random read 수행시 ZNS SSD 가 Block SSD 보다 64% 낮은 [[Latency (Storage)|Latency]] 를 보여줬다.
- RocksDB 를 f2fs + ZNS SSD 와 POSIX fs + Block SSD 에서 사용했을 때, ZNS 를 사용할 때가 2-4 배 낮은 random read latency 를 보여줬다.
- 또한 RocksDB 를 ZenFS + ZNS 에서 사용했을 때, POSIX + Block SSD 를 사용했을때 보다 2배 높은 throughput 을 보여줬다.

![[Pasted image 20240316093233.png]]
> [출처](https://www.usenix.org/system/files/atc21-bjorling.pdf)

- 위 그림은 ZNS SSD 와 OP 가 다르게 설정된 Block SSD 두개 총 세개의 SSD 의 write throughput 을 실험한 것이다.
- 실험은 SSD 의 물리 사이즈인 2TB 데이터를 총 4번 concurrent 하게 write 하는 방식으로 진행했다. (0~2: 첫번째 write, 2~4: 두번째 write, 이런식으로 아마?)
- 첫 write 에서는 SSD 가 fresh 한 상태였기에 세 SSD 간의 성능 차이가 없었지만, 두번째 write 부터는 기존 데이터가 overwrite 되며 Block SSD 들에서 성능 저하가 나타났다.
- 또한 Block SSD 끼리 비교했을 때에는, OP 를 더 많이 설정한 SSD 가 그나마 성능 저하가 덜 나타나는 것으로 확인됐다.
- 다만 28% OP 를 먹인 SSD 의 경우에는 공간이 부족하기 때문에 write 가 6TB 을 넘어가자 더이상 기록되지 않는 것을 볼 수 있다.

[^1]: 다만, (1) 의 경우에는 본문에서는 좀 다른 뉘앙스로 말한다. 여러개의 die 에 분산되어 있으면 parity 를 구성하기 용이하기에 여러 die 에 분산시키는 것이 protection 에 유리하다고 한다. - *"There is a direct correlation between a zone’s write capacity and the size of the erase block implemented by the SSD. In a block-interface SSD, the erase block size is selected such that data is striped across multiple flash dies, both to gain higher read/write performance, but also to protect against die-level and other media failures through per-stripe parity."*

[^2]: 이 부분은 확실히 모르겠다. 기존의 block interface SSD 에서도 block level 혹은 hybrid 방식의 mapping table 이 사용되고 있었기 때문에, 기존의 SSD 에서 page level 만 사용하고 있었다고 말하는 것도, ZNS 덕분에 block/hybrid 로 구현하는 것이 가능해졌다고 말하는 것도 뭔가 이상해 보인다.

[^3]: 본문에서는 zone 사이즈가 큰 이유로 [[One-shot Programming (Storage)|Two-step programming]] 을 언급하지만, 어떤 연관이 있는지 모르겠다.

[^4]: 본문에서는 SLC 에서의 Write-back cache 를 사용하는 방법도 소개한다. 이게 뭔지는 모르겡누

[^5]: 본문에서는 통합의 예시로 "ensuring a primarily sequential workload" 를 제시하는데 감이 안온다.

[^indirection-overhead]: 본문에서 말하는 *"Indirection overhead"* 는 [Don’t stack your Log on my Log, INFLOW '14](https://www.usenix.org/system/files/conference/inflow14/inflow14-yang.pdf) 논문에서 제기된 문제를 말하는 것이다. 해당 논문에서는 sequential write 를 활용하기 위한 방법 중 하나인 log-structured 를 중복해서 사용하는 것 (가령, log-structured fs 위에서 log-structured application 을 사용하는 등) 이 오히려 성능 저하를 유발한다고 한다.

[^zone-descriptor]: "Zone Descriptor Data Structure" 는 본문에 별도의 설명이 되어 있지는 않지만, 일단 zone 의 메타데이터로 생각하고 넘어가자. 아마 "Zone Descriptor" 는 zone 의 attribute 들에 대한 key-value 쌍이 아닐까.

[^open-segment-limit]: 본문에는 "Open Segment Limit" 과 같은 용어는 나오지 않는다. 대신 "The number of segments that can be open simultaneously" 라는 표현이 나오며, 주인장이 이것을 단어화 한 것.