---
tags:
  - 논문
  - Storage
---
> [!info] 이 글은 USENIX ATC '21 에 소개된 [ZNS: Avoiding the Block Interface Tax for Flash-based SSDs](https://www.usenix.org/system/files/atc21-bjorling.pdf) 논문을 읽고 정리한 것입니다.

> [!info] 논문 내용 중 ZNS 에 대한 개념들은 [[Zoned Namespaces, ZNS (Storage)|여기]] 에 정리되어 있고, 본 글은 ZNS 의 성능 테스트 및 ZNS 를 실제 시스템에서 운용하는 방법 등에 대한 내용에 포커스가 맞춰져 있습니다.

## 개요

- 본 논문에서는 아래의 다섯가지 contribution 을 소개한다:
	1. 기존의 Block SSD 와 ZNS SSD 간의 성능 비교
	2. ZNS 에 대한 전반적인 리뷰 (는 [[Zoned Namespaces, ZNS (Storage)|이 문서]] 에 정리될 것이다)
	3. Host software layer 에 ZNS SSD 적용하는 과정에서 배운 점들
	4. ZNS 를 사용하기 위해 Storage stack 전반을 수정한 내용
		- 여기에는 Linux 커널, F2FS 파일시스템, NVMe 드라이버, Zoned Block Device 서브시스템, fio 벤치마크 툴이 포함된다.
	5. RocksDB 에서 ZNS SSD 를 사용하기 위한 새로운 스토리지 백엔드로 ZenFS 구현

- Concurrent write 수행시 ZNS SSD 가 Block SSD 보다 2.7배 [[Throughput (Storage)|Throughput]] 이 좋았다.
- Random read 수행시 ZNS SSD 가 Block SSD 보다 64% 낮은 [[Latency (Storage)|Latency]] 를 보여줬다.
- RocksDB 를 f2fs + ZNS SSD 와 POSIX fs + Block SSD 에서 사용했을 때, ZNS 를 사용할 때가 2-4 배 낮은 random read latency 를 보여줬다.
- 또한 RocksDB 를 ZenFS + ZNS 에서 사용했을 때, POSIX + Block SSD 를 사용했을때 보다 2배 높은 throughput 을 보여줬다.
- 