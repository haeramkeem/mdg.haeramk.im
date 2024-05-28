---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-03-24
---
> [!info]- 참고한 것들
> - [어떤 회사 사이트](https://www.cynet.com/attack-techniques-hands-on/how-hackers-use-dns-tunneling-to-own-your-network/)

## DNS query 를 이용해 데이터를 주고받기

- DNS Tunneling 은 다음과 같은 DNS 의 특성을 이용한다:
1. DNS query 에 들어가는 URL 은 어떤 것이든 될 수 있다.
	- 가령 `oh-shit.haeramk.im` 으로 query 를 보낸다고 해서 문제될 것은 없다.
	- 즉, URL 에 어떤 데이터를 넣어 보내는 것도 가능하다는 뜻.
2. DNS query 와 response 는 방화벽에 걸리지 않는다.
	- DNS 메세지는 아주 흔하게 사용되기 때문에, 이것은 보통 방화벽 설정에서 막아놓지 않는다.

## 작동 원리

![[Pasted image 20240329171836.png]]
> [이미지 출처](https://www.cynet.com/attack-techniques-hands-on/how-hackers-use-dns-tunneling-to-own-your-network/)

1. 공격자는 `evilsite.com` 과 같은 도메인을 하나 구매한다.
2. 공격자는 malware 를 서버에 설치한다. (이 서버를 *malserver* 라고 부르자.)
3. 그리고 서브도메인을 생성한 후, *malserver* 가 [[Nameserver (DNS)#Authoritative Nameserver|authoritative nameserver]] 가 되도록 [[Zone Delegation (DNS)|DNS delegation]] 을 수행한다.
	- 즉, 위의 예시에서는 `tun.evilsite.com` 을 생성한 후에 해당 zone 의 authoritative nameserver 를 *malserver* 로 설정하게 한 것이다.
	- 따라서 `*.tun.evilsite.com` 에 대한 DNS query 는 이 *malserver* 로 가게 된다.
4. 공격하고자 하는 네트워크 (가령 다른 회사 내부) 에 감염된 컴퓨터 (이놈을 *victim* 이라고 하자.) 하나를 준비한다.
	- 이건 딱히 정해진 방법이 없다. 뭐 스팸메일을 이용하건, 자기가 발로 뛰어서 직접 갖다놓던지 간에 그냥 컴퓨터 하나가 네트워크 안에 준비되어 있기만 하면 된다.
5. 이후에 *victim* 이 `{data}.tun.evilsite.com` 에 대한 DNS query 를 보내서 *malserver* 에 데이터를 보낸다. 구체적으로는:
	1. 해당 DNS query 는 네트워크 안의 DNS resolver 로 가게 되고,
	2. DNS resolver 는 ([[Resolver (DNS)|여기]] 에서 설명한 일련의 과정을 거친 뒤에) 해당 query 를 *malserver* 에 보내게 된다.
	3. 그럼 query 는 네트워크의 방화벽을 별 탈 없이 뚫고 *malserver* 에 도달하게 된다.
	4. *malserver* 는 원하는 데이터를 담아 DNS response 를 보내게 된다.
	5. 결과적으로, DNS resolver 를 사이에 두고 *victim* 과 *malserver* 가 데이터를 주고 받는 connection 이 생기게 된다.