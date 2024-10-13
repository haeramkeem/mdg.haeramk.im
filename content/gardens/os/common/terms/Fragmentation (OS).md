---
tags:
  - terms
  - os
date: 2024-04-11
aliases:
  - Internal fragmentation
  - External fragmentation
---
## 란?

- *Fragmentation* (*단편화*) 라는 것은 공간 자체는 충분히 많이 남아있지만, 구조상 문제 때문에 그 공간을 사용할 수 없게 되는 문제이다.
- 따라서 [[Virtual Memory (Memory)|Virtual memory]] 나 [[Logical Block Addressing, LBA (Storage)|Storage]] 등 어떤 "공간" 을 다루는 분야에서 자주 등장하게 된다.
- 이건 *Internal fragmentation* (*내부 단편화*) 와 *External fragmentation* (*외부 단편화*) 로 나뉜다.

## 내부단편화, Internal Fragmentation

- 이것은 어떤 "고정된 크기의 공간" 을 전부 사용하지 못해 해당 공간 내에 "사용하지 않고 비는 공간" 을 의미한다.
	- 가령 [[Virtual Memory (Memory)|Virtual memory]] 의 page 나
	- [[Logical Block Addressing, LBA (Storage)|LBA]] 에서의 block 에서 발생하는 문제.

## 외부 단편화, External Fragmentation

- 이것은 어떤 공간이 free 상태가 됐다가 해당 자리에 더 작은 데이터가 들어와서 남는 공간을 말한다.
- 이렇게 말하니까 원래 알던 사람 아니면 뭔소린지 모를 것 같긴 하다.
	- 예를 들어 4KB 파일 + 5KB 파일 + 6KB 파일이 순차적으로 디스크에 저장되어 있었다고 해보자.
	- 그리고 이때 5KB 파일이 지워지고, 해당 자리에 3KB 파일이 저장되었다고 해보자.
	- 그럼 여기에는 2KB 만큼의 구멍이 뚫리게 되고, 2KB 보다 작은 파일만 저장이 가능해 질 것이다.
	- 이런 것을 외부 단편화라고 하는 것.
- 위의 예시에서는 크기가 크니까 별 문제가 아닌것 처럼 보이지만, 이건 빵꾸가 쫌쫌따리로 많이 생기다 보면 결국에는 합쳐봤을 때 생각보다 많은 공간을 사용하지 못하게 된다.
- 옛날 windows xp 시절에 있었던 "디스크 조각 모음" 이 데이터를 빈공간이 없어지게끔 밀어 빵꾸를 합쳐 큰 빵구로 만드는 기능이다.