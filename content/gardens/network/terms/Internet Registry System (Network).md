---
tags:
  - terms
  - network
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [[5. RPKI, BGPSEC]]
> - [어떤 회사 RPKI 소개글](https://www.noction.com/blog/rpki-overview)

## Internet Number Resource Allocation

![[Pasted image 20240525132413.png]]

- 인터넷과 관련된 자원들 ([[Autonomous System, AS (BGP)|ASN]], IP 등) 은 위와 같은 구조로 계층적으로 관리된다.
	- IANA 가 최상위 조직이고,
	- 각 대륙별로 조직 (*RIR - Regional Internet Registry*) 이 하나씩 있다.
		- 북미: [ARIN](https://www.arin.net/)
		- 유럽 + 러시아: [RIPE NCC](https://www.ripe.net/)
		- 아시아 + 태평양 인근: [APNIC](https://www.apnic.net/)
		- 남미 (라틴아메리카): [LACNIC](https://www.lacnic.net/)
		- 아프리카: [AFRINIC](https://afrinic.net/)
	- 그리고 그 아래에는 *NIR (National Internet Registry)* 혹은 *LIR (Local Internet Registry)* 가 있고
		- NIR, LIR 구성은 각 나라마다 자율적으로 수행한다.
		- 우리나라의 경우에는 [KISA](https://www.kisa.or.kr/) 가 NIR 에 해당한다.
	- 그 아래에는 [[Internet Service Provider, ISP (Network)|ISP (Internet Service Provider)]] 가 있다.
		- 여기에는 KT, SKT, LG U+ 가 해당되겠지
	- 마지막으로 그 아래에는 End User 가 있다.
		- 이 End User 는 개인 단위가 아니고 조직 단위다. (가령 서울대학교 등)