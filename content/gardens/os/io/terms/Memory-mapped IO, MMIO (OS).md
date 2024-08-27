---
tags:
  - os
  - os-io
date: 2024-08-27
aliases:
  - MMIO
---
> [!info]- 참고한 것들
> - [자랑스러운 후배님의 글](https://hyeyoo.com/152)
> - [kernel.org](https://www.kernel.org/doc/Documentation/DMA-API-HOWTO.txt)

## OS <-> Device "Controller" communication

- MMIO 는 device 의 address space 를 host 의 physical memory space 와 kernel (혹은 device driver) 의 [[Virtual Memory (Memory)|virtual memory address]] 에 매핑하는 것이다.
- 이렇게 매핑한 이후에는 virtual address 에 접근하는 방식으로 device controller 의 address 에 접근하게 된다.
	- 즉, 이렇게 함으로써 kernel 과 device controller 간의 high-level 통신 채널이 생기는 것.

## Using MMIO

> [!info] 이후의 내용 + 용어는 PCIe 기반입니당.

### Initiate

- 컴퓨터의 전원이 들어오면, 부팅 과정에서 BIOS (혹은 OS) 가 부착되어 있는 PCI 장비들을 검색한다.
- 이때 PCI 장비는 [[Base Address Register, BAR (PCIe)|BAR]] 레지스터에 host 의 원하는 physical memory size 를 명시하여 BIOS (혹은 OS) 에게 요청한다.
	- 보통은 그냥 전부 `1` 로 채워 얼만큼 매핑할지도 BIOS (혹은 OS) 가 결정하게 한다고 한다.
- 그럼 BIOS (혹은 OS) 는 매핑할 physical memory space 를 선정한 후, 이곳의 시작 주소를 BAR 에 채워넣는다.
	- 그럼 이제 BAR 에는 mapping 될 physical memory space 의 (1) 시작주소와 (2) 크기가 저장되는 셈이다.
- 이후에 OS 는 이 BAR 에 저장된 physical memory address 를 이용해 kernel 혹은 device driver 의 virtual memory space 에 매핑한다.

### Access

```
               CPU                  CPU                  Bus
             Virtual              Physical             Address
             Address              Address               Space
              Space                Space

            +-------+             +------+             +------+
            |       |             |MMIO  |   Offset    |      |
            |       |  Virtual    |Space |   applied   |      |
          C +-------+ --------> B +------+ ----------> +------+ A
            |       |  mapping    |      |   by host   |      |
  +-----+   |       |   (MMU)     |      |   bridge    |      |   +--------+
  |     |   |       |             +------+             |      |   |        |
  | CPU |   |       |             | RAM  |             |      |   | Device |
  |     |   |       |             |      |             |      |   |        |
  +-----+   +-------+             +------+             +------+   +--------+
```
> [출처: kernel.org](https://www.kernel.org/doc/Documentation/DMA-API-HOWTO.txt)

- 어떤 device driver 가 virtual memory address 로 MMIO 에 접근하려 한다고 해보자.
- 그럼 일단 이 주소는 [[Memory Management Unit, MMU (OS)|MMU]] 에 의해 physical memory address 로 바뀔 것이다.
- 그리고 이 주소는 PCI controller 에 의해 *bus address* 로 바뀐다.
	- 저 *bus virtual address* 는 *IO address* 혹은 *device virtual address* 라고도 불리고, device 내부적인 주소 체계라고 이해하면 된다.
	- 바꾸는 과정을 좀 더 구체적으로 설명하면,
		- PCI controller 는 BAR 를 읽어 base physical memory address 를 알아낸다.
		- 그리고 requested physical address 에 저 값을 빼면 offset 이 나올 테고, 그것이 *bus address* 인 것.