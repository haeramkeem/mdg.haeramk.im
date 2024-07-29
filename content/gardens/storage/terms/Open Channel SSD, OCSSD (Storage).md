---
tags:
  - 용어집
  - Storage
date: 2024-03-30
---
> [!info]- 참고한 것들
> - [위키피디아](https://en.wikipedia.org/wiki/Open-channel_SSD)

## 이건 또 뭐야

- 간단하게 말하면 [[Flash Translation Layer, FTL (Storage)|FTL]] 을 SSD 내에 구현하지 않고 Host 에게로 넘겨버린 것이다.
	- 기존에는 [[Flash Memory, SSD (Storage)|SSD]] 안에 Processor 와 DRAM 존재하고, 여기에 FTL 가 구현된 SSD 펌웨어가 설치되었다면 OCSSD 에서는 FTL 을 통째로 Host 에 이관시키고 Host 의 CPU 와 RAM 을 이용하게 된다.
- 따라서 FTL 이 담당하고 있던 데이터 저장 위치 선정, [[Over Provisioning, OP (Storage)|OP]], [[Garbage Collection, GC (Storage)|GC]] 등의 작업을 전부 Host 가 담당하게 된다.
	- OS 가 OCSSD 에 접근할 수 있게 해주는 인터페이스로 [LightNVM](http://lightnvm.io/) 이 구현되어 있다.
- 다만, OCSSD 는 [[Zoned Namespaces, ZNS (Storage)|ZNS]] 의 등장에 따라 현재에는 거의 사용되지 않는다고 한다.

## 좋은 점

- 이렇게 하면 좋은점은 (지겹게 등장하긴 하지만) GC 오버헤드 등의 한계를 완화할 수 있다는 것이다.
	- 데이터를 어디에 저장하냐가 GC 오버헤드에 영향을 주고
	- 데이터의 저장 위치를 정하는 것에는 Host 가 알고 있는 정보들을 활용하는 것이 도움이 된다고 한다.
		- 이에 대해서는 [[Flexible Data Placement, FDP (Storage)|FDP 문서]] 나 [[Zoned Namespaces, ZNS (Storage)|ZNS 문서]], [[Multi-stream SSD (Storage)|Multi-stream SSD]] 에서도 여러번 언급했으니 모르겠으면 가서 보도록 하자.
	- 따라서 OCSSD 에서는 FTL 자체를 Host 로 넘겨 Host 가 알고 있는 정보를 활용하자는 아이디어이다.

## 나쁜 점

- 생각보다 RAM 을 많이 먹는다 - 4KB 의 write 작업이 지속적으로 들어오는 환경에서 SSD 용량이 1TB 라면 3GB 의 RAM 을 먹는다고 한다.
- 또한 OS 에서 모든 종류의 SSD 에 대응하는 인터페이스를 구현해야 되고, 이것이 핵심적인 문제가 되어 지금은 [[Zoned Namespaces, ZNS (Storage)|ZNS]] 로 대체되었다.