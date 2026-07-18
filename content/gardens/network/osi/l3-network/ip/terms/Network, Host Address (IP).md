---
tags:
  - mdg
  - network
  - ip
  - terms
date: 2026-07-16
aliases:
  - Network Address
  - Host Address
---
> [!info] 작물 단계: #seed 

## Network, Host address

> [!tip] Host address
> - Host address 는 아래 나온 의미 말고도 그냥 '호스트' (즉, 현재 컴퓨터) 의 IP 주소라는 의미로도 쓰인다.
> - 문맥따라 알아서 판단하시길.

- [[Internet Protocol, IP (L3 Network Layer)|IP address]] 는 두 파트로 나눌 수 있다.
	- 앞부분인 *Network address* 는 '네트워크' 들을 구분하기 위한 주소이다.
		- 두 컴퓨터의 IP address 가 있다고 할 때, 이 두 IP address 의 network address 가 같으면 이 두 컴퓨터는 같은 네트워크에 속한다.
		- 만약 다르다면, 이 두 컴퓨터는 다른 네트워크에 속한다.
	- 뒷부분인 *Host address* 는 그 네트워크 안의 '호스트' 들을 구분하기 위한 주소이다.

```
IP Address (bit): 10101010 10101010 10101010 10101010
                  |                  |              |
                  + Network address  + Host address +
```

- *Network address* 는 다양한 표현방식을 가진다.
	- [[Class (IP)|IP Class]] 에서는 그냥 `a.b.0.0` 이런식으로 표현한다.
		- 이 말은 같은 네트워크에 속한 두 IP 는 항상 `a.b.` 로 시작한다는 의미이다.
	- [[Variable Length Subnet Mask, VLSM (IP)|VLSM]] 에서는 `a.b.c.d` 와 subnet mask `e.f.g.h` 으로 표현된다.
		- 이 말은 같은 네트워크에 속한 두 IP 에 [[Variable Length Subnet Mask, VLSM (IP)|subnet mask]] `e.f.g.h` 를 `AND` 하면 항상 `a.b.c.d` 가 나온다는거다.
	- [[Classless Inter-Domain Routing, CIDR (IP)|CIDR]] 에서는 `a.b.c.d/e` 으로 표현한다.
		- 이건 위의 VLSM 과 비슷한데, subnet mask 가 MSB 부터 시작해서 `e` 개의 1bit 로 구성된 문법이다.
- *Host address* 는 2가지가 금지된다.
	- *Host address* 파트가 전부 0bit 라면 그건 그냥 *Network address* 와 같아진다. 그래서 이렇게는 *host address* 로 설정할 수 없다.
	- *Host address* 파트가 전부 1bit 라면 그건 [[Broadcast (Network)|Broadcast]] 용도로 reserve 되어있다. 그래서 이렇게도 *host address* 를 설정할 수 없다.