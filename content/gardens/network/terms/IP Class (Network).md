---
tags:
  - terms
  - network
date: 2023-02-02
aliases:
  - IP Class
---
> [!info]- 참고한 것들
> - [[Network] IP주소 클래스(A,B,C class)란?](https://limkydev.tistory.com/168)

## Network, Host address

- IP 는 알다시피 `NETADDR.HOSTADDR` 형태로 구성된다
- 일단 하나의 네트워크에 할당되는 값이 *Network Address* 이고
- 그 네트워크에서 거기에 속한놈들에게 나눠주는 *Host Address* 가 있더라
- Network Address 는 네트워크에 할당되기 때문에 좀 더 글로벌하고 공인된 단체가 할당해주겠지 → 이런 숫자 관련해서 등장하지 않으면 이상한 IANA 가 할당해준다

## Class A, B, C

![[Pasted image 20240526223441.png]]
> Source: 한국인터넷정보센터

- IP 는 A ~ E 까지의 5개 Class 로 나뉘는데 A ~ C 가 많이 쓰이고 D, E 는 연구 등의 특수목적이기 때문에 몰라도 된다
- A ~ C Class 는 위 사진 보면 됨
- 근데 이정도는 좀 외워둬라

| Class | IP의 첫번째 숫자 | Host address 개수 |
| ----- | ---------- | --------------- |
| A     | 0 ~ 127    | 256^3           |
| B     | 128 ~ 191  | 256^2           |
| C     | 192 ~ 223  | 256             |