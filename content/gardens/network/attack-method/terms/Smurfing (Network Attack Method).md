---
tags:
  - mdg
  - security
  - attack-method
  - terms
date: 2026-07-17
aliases:
  - Smurfing
---
> [!info]- 참고한 것들
> - [누군가의 블로그](https://blog.naver.com/brickbot/220433434765)

## 란?

- [[ICMP Router Discovery Protocol, IRDP (L3 Network Layer)|ping]] 을 보낼 때 보내는쪽 [[Internet Protocol, IP (L3 Network Layer)|IP]] 를 '공격대상' 으로 하고 받는쪽 IP 는 [[Broadcast (Network)|Broadcast]] 로 하면 네트워크 내의 모든 호스트가 이걸 받고 저 '공격대상' 쪽으로 답변할것이다.
- 이것을 개많이하면 저 '공격대상' 은 너무 많은 패킷을 받게 되므로 연결이 어려워진다. 이렇게 해서 공격하는게 *Smurfing* 이다.