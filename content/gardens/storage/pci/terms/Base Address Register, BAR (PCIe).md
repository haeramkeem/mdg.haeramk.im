---
tags:
  - mdg
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

## Format (Memory BAR)

- 자. 32bit BAR 를 생각해보자. 그럼 이놈이 표현할 수 있는 값은 최대 4GiB 까지다. 이제 이놈의 작동방식을 알아보자.
- 우선 저 32bit 는 다음처럼 base address 와 나머지로 구분할 수 있다.

```
                    1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
---------------------------------------------------------------
M T T P <------------------- Base Address -------------------->
```

- 나머지들:
	- `M`: Memory space indicator. Memory 주소를 나타내는 BAR 이면 항상 0이다.
		- Memory 주소가 아니라 IO 주소를 나타내는 BAR 일 수도 있는데, 이때는 1이다.
		- 근데 지금 이 설명은 IO 주소가 아니라 Memory 주소에 대한 것이므로 항상 0이다.
	- `T`: Type. 이건 2bit 다. `00` 이면 32bit BAR, `10` 이면 64bit BAR (즉, 이 32bit BAR 외에 다음 32bit BAR 을 하나 더 읽어야 됨) 임을 나타낸다.
	- `P`: Prefetchable. 이건 BAR 값을 caching 해도 되는지에 대한 flag 이다.
- 그리고 Base Address 는 두가지로 나눌 수 있다.
	- Hardwired: 여기는 값을 쓸 수 없다. 무조건 0이다.
	- Variable: 여기는 값을 쓸 수 있다.
	- 왜 이렇게 두개로 나뉘어있냐는 [[#Resource Allocation|아래]] 에서 설명하리라.

## Resource Allocation

- BAR 은 기본적으로 physical address space 내에 '(1) 여기부터 (2) 이만큼'을 사용할래를 저장하는 곳이다.
- 그럼 kernel 입장에서는 '(2) 이만큼' 을 알아야 physical address space 내에 할당을 하고, 그 다음 '(1) 여기부터' 를 적을 수 있게 되는거다.

### '이만큼 쓸래' 알아내기

- 이 '(2) 이만큼' 을 알아내는 로직이 아주 현명하다. 바로 모든 bit 에 1을 적어보는 것 (즉, `0xFFFFFFFF` 을 write 하는 것) 이다. [[#Format (Memory BAR)|위]] 에서의 *Hardwired* 를 활용해서 이것을 알아낼 수 있게 한다.
- 예시로 설명해보자. 일단 난 256MiB 를 사용하고자 한다. 그럼 이걸 bit 로 바꾸면 28bit 다 ($2^{28} = 256 \times 1024 \times 1024$).
- 하위 4비트는 metadata 이고 이놈도 write 가 안된다. 그럼 base address 에서 24bit 를 hardwired 로 만들어주면 28bit 를 맞출 수 있겠지?
	- 아래에서 metadata 가 `0 0 0 1` 인 이유는 [[#Format (Memory BAR)|위]] 에 나온다. Prefetchable 은 이 예시에서 그냥 1이라고 하자.

```
                    1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
---------------------------------------------------------------
0 0 0 1 <----------------- Hardwired -----------------> <- V ->
```

- 여기에 `0xFFFFFFFF` 를 써보자. 그럼 실제로 1이 적히는 곳은 저 상위 4bit 뿐이다.

```
                    1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
---------------------------------------------------------------
0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1
```

- 그럼 kernel 이 이 값을 읽으면 `0xF0000008` 다. 그럼 kernel 은 이걸 이렇게 해석한다.
	1) 우선 하위 4bit 는 metadata 라는건 나도 알고 너도 알고 온세상이 다 안다. 그래서 일단 이 값에 `0xFFFFFFF0` mask 를 AND 한다. 그럼 `0xF0000000` 가 된다.
	2) 다음 이 값을 NOT 한다. 그럼 `0x0FFFFFFF` 가 된다.
	3) 여기에 1을 더한다. 그럼 `0x10000000` 가 된다. 이 값은 정확히 $256 \times 1024 \times 1024$, 즉 256MiB 이다. 이렇게 해서 kernel 은 "이놈자슥이 256MiB를 요청하고 있구나"를 알 수 있게 된다.

### '여기부터' 정하기

- Physical address space 의 0 ~ 4GiB 사이에 저 BAR 이 요청하는 공간을 할당하게 된다.
- 근데 그냥 할당하는건 당연히 아니다. 우선 사용하지 않는 공간이어야 한다.
	- Physical address space 의 0 ~ 4GiB 사이에는 뭐 이것저것 많이 들어가게 된다. 가령 BIOS 이라던가 뭐 그런 것들.
	- 그래서 보통은 `0xC0000000` 부터 `0xFFFFFFFF` 를 *PCI MMIO hole* 이라고 해서 reserve 하게 되고, 이 구간에 할당한다.
- 그리고 아무렇게나 할당하는것이 아닌 요청하는 단위의 배수로 할당한다.
	- 위의 예시에서 보면 256MiB를 할당하려고 하고 있으므로 256MiB 의 배수가 되는 address 에 할당하게 된다.
	- 이렇게 하는 이유는 간단하다. 그냥 BAR 을 읽은 다음, metadata 를 `0xFFFFFFF0` 으로 지워주면 바로 base address 가 나오게 하려는거다.
	- 그래서 위의 예시에서, `0xD0000000` 에 할당했다고 해보자. 그럼 상위 4bit (variable bit들) 에 `0xD` 가 저장되는거고, BAR 에는 metadata 까지 해서 `0xD0000008` 이 적히게 된다.