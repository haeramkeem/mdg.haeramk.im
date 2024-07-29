---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[6. DNS#DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [우리의 친구 cloudflare](https://www.cloudflare.com/learning/ddos/dns-amplification-ddos-attack/)
> - [네이버 블로그](https://m.blog.naver.com/wnrjsxo/221254492061)

## 소개

![[Pasted image 20240527021857.png]]

- [[Domain Name System (DNS)|DNS]] 를 이용한 [[Denial of Service, DoS (Network)|DoS]] 공격의 일종이다.
- 우선 이름에서 힌트를 좀 얻어보자.
	- *Amplification* - 즉, 트래픽을 "증폭" 시킨다는 것이다.
		- 가령 query 에 `ANY` 와 같은 옵션을 넣어서 간단한 query 를 날려도 음청나게 많은 양의 response 가 오게 한다.
	- *Reflection* - 즉, 내가 아닌 다른놈이 공격을 대신해 주는 것을 의미한다.
		- 여기서는 [[Resolver (DNS)|DNS resolver]] 가 대신 공격해준다.
- 그럼 어떻게 공격하는지 알아보자.
	- 일단 attacker 의 bot 은 source IP 를 target 의 IP 로 해서,
	- 최대한 간단한 query 로 최대한 많은 양의 response 를 만들어낼 수 있는 DNS query 를 resolver 에게 쏜다.
	- 그럼 이제 resolver 는 열심히 nameserver 를 돌아다니며 응답을 생성하고, 그것을 응답할 텐데
	- 문제는 source IP 가 target 의 IP 로 되어 있기 때문에 응답이 bot 으로 안가고 target 으로 가게 된다.
	- 그럼 멀뚱멀뚱 있던 target 은 갑자기 엄청나게 많은 양의 DNS response traffic 을 받게 되고, 대역폭을 다 차지하게 돼 아무도 접근하지 못하는 상황이 되어버린다.