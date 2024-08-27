---
tags:
  - storage
  - pci
  - terms
date: 2024-08-27
aliases:
  - BAR
---
## Device 내의 레지스터

- *Base Address Register*, *BAR* 은 이름 그대로 "기준이 되는 주소" 를 저장하는데,
- 주소의 종류가 겁나게 많자나? 여기에 저장되는 것은 host 의 physical memory address 를 말한다.
- 즉, [[Memory-mapped IO, MMIO (OS)|MMIO]] 로 device 의 bus address 를 host 의 physical memory 에 매핑하고자 하는데, 그때의 base 값을 이 레지스터에 저장하는 것.
- 이것을 이용해 $PhysicalAddress - BARPhysicalAddress = Offset = BusAddress$  로서 physical address -> bus address 변환이 가능하고,
	- 이 변환을 수행하는 것은 PCI controller 와 같은 host bridge 가 수행한다.
- 좀 더 구체적으로 말하면, 여기에는 기본적으로
	- (위에서 말한 것처럼) Base physical memory address 와
	- Boundary 를 지정하기 위한 size 가 들어가고
	- 이외에 여러 정보들 (가령 MMIO 말고 [[Port-mapped IO, PMIO (OS)|PMIO]] 를 사용할 것이라든지) 이 포함되게 된다.
- 사이즈는 32bit 가 기본이고, 이것 두개를 사용해 64bit 체계를 사용할 수도 있다고 한다.