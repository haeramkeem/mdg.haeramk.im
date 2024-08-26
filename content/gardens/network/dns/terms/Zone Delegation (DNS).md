---
tags:
  - terms
  - network
date: 2024-03-24
---
> [!info]- 참고한 것들
> - [어떤 회사 블로그](https://www.catchpoint.com/dns-monitoring/dns-delegation)

## 이게뭐임?

- 말 그대로 [[Zone (DNS)|DNS Zone]] 의 관리를 위임 (Delegate) 하는 것이다.
- 여기서 "관리" 라는 것은 해당 DNS zone 에 대해
	- [[Resource Record, RR (DNS)|DNS record]] 들을 저장하고
	- DNS record 에 따라 query 에 응답하는 것이라고 생각하면 될 것 같다.
- 또한 아무한테나 위임하는 것이 아니고, parent zone (예를 들어 `.com.`) 이 child zone (예를 들어 `example.com.`) 에게 위임하는 것이다.
- 즉, Parent zone 은 child zone 에 대한 record 를 저장하고 query 를 응답해야 하지만, 이런 delegation 을 통해 parent 가 아닌 child 가 record 저장 및 응답을 하게 하는 것.

## `NS` Record, Glue Record

- 일단 DNS delegation 을 하는 과정을 살펴보면 아래와 같다.

1. 우선 child zone 에서 record 를 저장하고 응답하기 위해 child zone 에 DNS server 가 구성된다.
2. Parent zone 에는 child zone DNS server 의 *이름* 을 *`NS` record type* 으로 저장한다.
	- 여기서 중요한 것은 *이름* 을 저장한다는 것이다: DNS server 의 IP 를 저장하는 것이 아니다.
	- 예를 들어 `example.com` 의 경우에는, `ns.gltd-server.net` 등이 저장된다는 소리.
3. 근데 생각해 보면 *이름* 을 저장하게 되면 이놈에 대한 query 를 또 날려야 할 것이다. 이것을 방지하기 위해 parent zone 에 해당 *이름* 에 대한 A/AAAA record 를 같이 저장한다.
	- 이렇게 DNS server 의 이름을 저장하는 A/AAAA record 를 *Glue Record* 라고도 한다.

- 이 `NS` 와 glue record 는 query 가 왔을 때 다음처럼 사용된다.

1. 가령 `.com.` 에게 `www.example.com` 에 대한 query 가 왔다고 해보자.
2. 그럼 `.com.` 은 자신의 record 에 `example.com` 에 대한 `NS` record 로 `ns.gltd-server.net` 이 있는 것을 확인할 것이다.
3. 또한 `ns.gltd-server.net` 의 `A` record 로 `132.2.10.9` 도 있는 것을 확인할 수 있을 것이다.
4. 그럼 `.com.` 은 `132.2.10.9` 로 다시 query 하라는 메세지를 응답해 해당 query 를 보낸 놈이 `www.example.com` 에 대한 query 를 `example.com` 의 DNS server 로 보낼 수 있게 한다.