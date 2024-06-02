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

> [!warning] #draft 내용이 정리가 안돼있슴다

## Border Gateway Protocol, BGP

- 우선 Internet 생태계의 구조를 간단하게 살펴보자.
	- Internet 은 [[Autonomous System, AS (BGP)|AS]] 들이 독립적으로 내부 네트워킹을 구축 관리하고, 이 AS 들 간의 통신을 가능하게 해 전체적인 네트워킹이 이루어지도록 되어 있다.
	- 따라서 internet 은 *Network of Networks* 라고도 표현한다.
- 이때 하나의 AS 내에서 라우터들 간의 경로를 정하는 프로토콜이 [[Interior Gateway Protocol, IGP (Network)|IGP]] 이고 그중 [[Open Shortest Path First, OSPF (Network)|OSPF]] 가 대표적이라면
- AS 간의 경로를 정하는 프로토콜을 [[External Gateway Protocol, EGP (BGP)|EGP]] 라 하고 그 중 BGP 가 대표적이다.
	- 대표적이긴 한데 사실 EGP 에는 BGP 하나밖에 없다.
- BGP 에서 BG 는 *Border Gateway* 의 약자로 AS 외부와 통신할 수 있는 라우터를 의미한다.
- 그렇기 때문에 BGP 는 BG 들 간의 경로 탐색 프로토콜이고 따라서 AS 간의 통신에만 관여하는 것이 아니고, AS 내부에서의 BG 간 통신도 BGP 의 일부이다.
- 179/[[Transmission Control Protocol, TCP (Network)|TCP]] 위에서 작동한다고 한다.. FYI

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

## AS-path, Next Hop

![[Pasted image 20240529115436.png]]

- *AS-path* 는 어떤 AS 에 도달하기까지 거쳐가야 할 AS 들을 의미한다.
	- 즉, 역으로는 이 NLRI 가 어떤 AS 에서 출발해서 자신에게까지 오기까지 거쳐온 AS 들인 것.
	- 위의 예시를 보면 AS 300 에 도착한 메세지에는 `160.10.0.0/16` (AS 100) 에 대해 AS-path 가 `200 100` 으로 되어 있고, 이것은 AS 300 에서 AS 100 으로 가기 위해서는 AS 200 -> AS 100 의 경로를 타야 한다는 것을 의미한다.
	- 이 AS-path 값은 어떤 BGP update msg 를 전파할 때 모든 NLRI 의 AS-path 에 자신의 ASN 을 넣어주는 것으로 설정하게 된다.
- *Next-hop* 은 어떤 NLRI 의 AS 에 보내기 위해 "지금 당장에" 패킷을 보내야 할 BGP peer IP 을 의미한다.
	- 위의 예시에서는 `160.10.0.0/16` (AS 100) 으로 패킷을 보내기 위해서는 AS 300 입장에서는 AS 200 의 라우터 C (`192.10.1.1`) 로 패킷을 보내야 한 다는 것을 보여주고 있다.
	- 따라서 BGP peer 에게 update msg 를 전파할 때에는, 이 값을 BGP update msg 가 빠져나가는 본인 AS 의 Router IP 로 적으면 되는 것.
	- 다만, 이 Next-hop 은 iBGP 통신에서는 바뀌지 않는다.

## Unfeasible (Withdrawn) route

![[Pasted image 20240529120748.png]]

- 한 AS 의 NLRI 에 해당하는 네트워크 대역이 다운되어, 여기로 패킷을 보내지 마라는 것을 전파하는 것은 *Unfeasible (Withdrawn) route* field 를 활용한다.
- BGP update msg 에는 이 field 가 있어 주변으로 전파되며 이 NLRI 를 무효화 시킨다.

## Routing Information Base (RIB)

- BGP update msg 로 외부에서 오거나 IGP/iBGP 로 내부에서 온 route 정보는 *Routing Information Base* (*RIB*) 에 정리된다.
- RIB 에는 대강 아래와 같은 형식으로 정리된다:

![[Pasted image 20240529121913.png]]

- 일단 맨 처음에 있는 것은 *BGP Status Code* 이다.
	- 몇가지만 보면
	- `*`: Valid - 유효한 path 이다.
	- `>`: Best - best path 로서, routing table 에 추가되었다.
	- `r`: RIB failure - BGP 로 받은 path 지만, 더 좋은 path 가 있어 routing table 에 넣지는 않았다.
	- `i`: Internal - iBGP 로부터 받은 path 이다.
- Network 는 IP prefix 이고 Next-hop 항목은 위에서 설명했으니까 넘어가고
- Path 는 AS-path 를 의미하는데, 그냥 ASN 이 적혀있으면 위에서 설명한 것처럼 해당 AS 로부터 왔다는 의미이고, 추가적으로
	- `i`: IGP 로 전달된 것, 즉 본인 AS 내부의 라우터가 보내온 것이라는 의미다.
	- `?`: IGP 를 iBGP 로 전달된 것, 즉 본인 AS 내부의 라우터가 보내온 메세지 (IGP) 를 다른 BG 가 다시 보내온 것 (iBGP) 라는 의미다.
- 이 RIB 에서 Best path 를 선택하고, 그 중에서도 (1) prefix/length 가 unique 하고 (2) AD 가 가장 짧은 것을 Routing table 에 추가하게 된다.

## In/Out

- AS 200 이 AS 100 으로부터 BGP update msg 를 받아 주변으로 뿌리는 상황을 생각해 보자.

### In-process

![[Pasted image 20240529123340.png]]

- 우선 BGP update msg 가 접수되면 이것을 RIB 에 넣고 여러 Status 값들을 설정해 준다.
- 따라서 IGP 로부터 받은 route 두개 (`160.10.1.0/24`, `160.10.3.0/24`) 에 추가적으로 `173.21.0.0/16` 이 등록된다.

### Out-process

![[Pasted image 20240529123358.png]]

- BGP update msg 를 뿌릴 때에는 RIB 에 있는 route 들을 뿌리는데
	- Best path 만 전파하는건지 아니면 Routing table 에 추가한 것까지 전파하는 건지는 모르겠는데 아마 best path 를 전파할 것 같음.
- Path 에 본인의 ASN (AS 200) 을 추가하여 뿌리게 되는 것.
	- IGP route (`i`) 의 경우에는 당연히 본인에게 속한 것이기 때문에 본인의 ASN (AS 200) 로 바뀐다.

## Administrative Distance (AD)

![[Pasted image 20240529130410.png]]

- *Administrative Distance* (*AD*) 혹은 *Protocol Distance* 는 같은 AS 로 향하는 여러 route 들 중에 하나를 결정해야 할 때 "프로토콜 적인 측면" 에서 점수를 매기는 방법이다.
	- 즉, 이 route 가 어떤 방법으로 라우터에 제공되었냐에 따라 다르게 점수를 메기고, route 선택에 사용하는 것.
- 각 protocol 에 대한 점수는 위 그림과 같고, 점수가 낮을수록 좋은거디.

## Multi-Exit Discriminator (MED)

- 한 AS 에 대해 BGP peer 로 가는 방법이 여러개일 때, 그 중에서 어떤 방법을 선호할 것인지를 명시하는 것.
- 점수가 낮을수록 좋다.

## Local Preference

- 뭐 비즈니스적인 이유와 같은 정책으로 인해 route preference 를 조정해야 할 때 사용된다.
- 즉, Static preference 이며 우선순위도 제일 높다.
- 이 점수는 높을수록 좋다.

## Origin

- Route 가 어떤 방법으로 라우터에게 제공되었는지? AD 랑 뭐가 다르노

## Community

- Desctination 을 group 으로 관리하는 tag (마치 k8s 의 label 과 같은) 이다.

## BGP Synchronization

![[Pasted image 20240529131724.png]]

- 만일 AS 209 의 NLRI 35/8 이 AS 1880 의 라우터 B 로 전파되었다고 해보자.
- 이때 AS 1880 의 라우터 A, B 는 iBGP peer 관계에 있다면 A 로 전달될 것이고, A 는 이것을 AS 690 의 D 한테도 알려줄 것이다.
	- 다만 A 와 B 는 직접적으로 연결되어 있지는 않고, 라우터 C 에 의해 간접적으로 연결되어 있다.
- 그럼 AS 690 에서 35/8 로 보내고자 한다면, D 에서 A 로 보내게 될 것이고, 그럼 A 는 C 로 보내게 될 것이다.
- 근데 문제는 C 는 이 35/8 에 대한 경로는 모른다는 것이다

## Best path

- BGP 에서 Best path 를 결정하는 것은 다음과 같은 순서대로 이루어진다
	- Local preference 가 높은 것
	- AS-path 가 짧은 것
	- Origin type 이 작은 것
	- MED 가 작은 것
	- Next hop 으로 가기 위한 IGP 의 비용이 작은 것
	- Next hop 의 router id 가 작은 것