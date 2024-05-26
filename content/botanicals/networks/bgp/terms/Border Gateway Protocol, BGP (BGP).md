---
tags:
  - 용어집
  - Network
  - BGP
date: 2024-05-25
---
> [!info]- 참고한 것들
> - [BGP의 개념 (Border Gateway Protocol)](https://ddongwon.tistory.com/97)
> - [BGP란? (Boarder Gateway Protocol)](https://blog.naver.com/PostView.naver?blogId=taeheon714&logNo=222384978033&parentCategoryNo=&categoryNo=6&viewDate=&isShowPopularPosts=true&from=search)
> - [[3. BGP|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## Border Gateway Protocol, BGP

- 우선 Internet 생태계의 구조를 간단하게 살펴보자.
	- Internet 은 [[Autonomous System, AS (BGP)|AS]] 들이 독립적으로 내부 네트워킹을 구축 관리하고, 이 AS 들 간의 통신을 가능하게 해 전체적인 네트워킹이 이루어지도록 되어 있다.
	- 따라서 internet 은 *Network of Networks* 라고도 표현한다.
- 이때 하나의 AS 내에서 라우터들 간의 경로를 정하는 프로토콜이 [[Interior Gateway Protocol, IGP (Network)|IGP]] 이고 그중 [[Open Shortest Path First, OSPF (Network)|OSPF]] 가 대표적이라면
- AS 간의 경로를 정하는 프로토콜을 [[External Gateway Protocol, EGP (BGP)|EGP]] 라 하고 그 중 BGP 가 대표적이다.
	- 대표적이긴 한데 사실 EGP 에는 BGP 하나밖에 없다.
- BGP 에서 BG 는 Border Gateway 의 약자로 AS 외부와 통신할 수 있는 라우터를 의미한다.
- 그렇기 때문에 BGP 는 BG 들 간의 경로 탐색 프로토콜이고 따라서 AS 간의 통신에만 관여하는 것이 아니고, AS 내부에서의 BG 간 통신도 BGP 의 일부이다.
- TCP 위에서 작동한다고 한다.. FYI

## eBGP, iBGP

![[Pasted image 20240526142656.png]]
> 그림 출처: Cisco

- *eBGP*: External BGP - AS 외부의 BG 간의 통신
	- *eBGP* 로 통신하는 구간은 *DMZ* 라고 한다
	- eBGP 의 경우에는 (1) peer 와 직접적으로 연결되어 있어야 하며 - 즉, 다른 router 를 거처가는 것이 아닌 (2) 당연히 모든 BG 와 연결할 필요 없이 peer 하려는 BG 와만 연결되어 있으면 된다
- *iBGP*: Internal BGP - AS 내부의 BG 간의 통신
	- iBGP 의 경우에는 (1) peer 와 직접적으로 연결될 필요는 없다 - 패킷 전달은 IGP 가 대신 해줄테니 (2) 모든 iBGP peer 와 연결되어 있어야 한다 (full mesh)
- 설정할 때 Local ASN 에는 자신의 ASN 을 적고, Remote ASN 에다가 peering 을 할 ASN 을 적으면 되는데
	- 만일 Local ASN 과 Remote ASN 을 동일하게 적으면 iBGP 로 설정된다.

## BGP 작동 원리

### 용어들

- *Neighbor* (*Peer*): 인접한 BG 를 의미한다.
    - *eBGP peer* (*external peer*) 는 AS 간의 BGP peer 를 말하는거고
    - *iBGP peer* (*internal peer*) 는 같은 AS 내의 peer 를 말한다.
        - 얘도 마찬가지로 라우팅 정보를 공유한다.
- *[[Network Layer Reachability Information, NLRI (BGP)|NLRI]]* (*Prefix*): AS 에 할당된 IP prefix 로, ASN 와 IP prefix 의 조합이다.
- *Route* (*Path*): neighbor 에 announce 한 NLRI 를 의미한다.
	- 이 메세지를 *Update message* 라고 한다.
- *Router ID*: 라우터에 설정된 여러 IP 들 중 highest IP 를 일컫는다.
	- Router 의 primary IP 라고 생각하면 될듯
	- Highest IP 가 정확이 뭔지는 잘 모르겠음.

### 간단 요약

- AS 각각은 NLRI 을 갖고 있고
- 이 NLRI 를 neighbor 간에 공유한다.
- 공유된 정보에 따라 최적의 경로를 정해 router 의 route table 에 저장하고 그에 따라 routing 한다.
- 추가적으로, 일부 패킷은 AS 내부의 사정에 따라 route policy 를 static 하게 정해 routing 할 수도 있다.

## BGP update message

- 