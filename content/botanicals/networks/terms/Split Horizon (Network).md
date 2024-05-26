---
tags:
  - Network
  - 용어집
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [KT](http://www.ktword.co.kr/test/view/view.php?m_temp1=2489)
> - [ITBEAR : 네이버 블로그](https://blog.naver.com/taeheon714/222373688203)

## 이게 뭔가?

- *Split Horizon* 은 정보를 준놈한테 다시 그 정보를 알려주지 않는다는 원칙이다
- Split Horizon 을 지켜야 되는 이유는 정보 전달의 무한루프를 막기 위함인데
    - 뭐 딱 들어맞는 비유는 아니지만 BFS 로 경로탐색할때 생각해보면 왜 무한루프가 생기는지 감잡을 수 있다
        - BFS 에서 현재 위치와 연결된 노드를 큐에 넣어주고 현재 위치를 방문표시하지 않으면
        - 큐에 넣어준 저놈을 방문했을 때 이미 방문했던 노드를 다시 큐에 넣게되어서 무한루프에 걸리게 되는 것과 비슷한 이치임
    - 즉, 정보를 받았을 때 자신의 주변에 해당 정보를 다시 뿌리는 정보 공유 방식에서
    - 정보를 준놈한테도 뿌려주면 그놈도 다시 정보를 뿌릴 것이므로 무한루프에 걸리게 된다
- 목적지까지의 경로를 알고 있는 Link-State 방식은 이러한 규칙이 필요 없지만 그때그때 경로를 설정해야 하는 Distance-Vector 방식은 이러한 규칙이 지켜져야 한다네

## 실제 프로토콜에서는

- Split Horizon 이 지켜져야 하는 프로토콜은 대표적으로 [[Routing Information Protocol, RIP (Network)|RIP]]/EIGRP 와 [[Border Gateway Protocol, BGP (BGP)|BGP]] 가 있는데 적용방식은 좀 다르다
- RIP/EIGRP 의 경우에는 라우팅 정보가 수신된 인터페이스로는 해당 정보를 송신하지 않는 식으로 Split Horizon 을 지킨다
- BGP 의 경우에는 라우팅 정보의 출처를 좀 더 넓게 잡는다
    - RIP/EIGRP 의 경우에는 라우팅 정보의 출처를 수신된 인터페이스로 한정해서 그쪽으로는 송신하지 않지만
    - BGP 의 경우에는 라우팅 정보의 출처를 iBGP 로 잡아서 iBGP 로 연결된 놈이 전달해준 라우팅 정보는 iBGP 로 연결된 다른놈한테 보내지 않는다
    - 예를 들면
        1. [[Autonomous System, AS (BGP)|AS]] 내에 `BG0`, `BG1`, `BG2` 세개의 BG 가 있을 때
        2. `BG0` → `BG1` 으로 라우팅 정보를 보내면 (당연히 iBGP 겠제)
        3. `BG1` 은 해당 정보를 `BG2` 에게 보내지 않는다 (`BG1` 와 `BG2` 는 iBGP 로 연결되어 있으므로)