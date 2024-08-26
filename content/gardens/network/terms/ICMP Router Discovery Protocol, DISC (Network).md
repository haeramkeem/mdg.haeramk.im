---
tags:
  - 용어집
  - network
date: 2024-05-26
---
## 란?

- 이건 Host 주변에 어떤 라우터가 존재하는지 조회하기 위한 프로토콜인데
- 이게 필요한 이유는 Host 한테 저장될 라우터들의 정보 (아마 First hop 들의 정보겠지) 를 업데이트하기 위함이다.
- 이를 위해 Host 의 전원이 켜지고 나서 패킷을 전송해 자신의 Routing table 에 주변의 Default gateway 의 정보를 추가하거나
    - 이때 송신하는 패킷을 *ICMP Router Solicitation Message* 라고 하고
    - 이 패킷을 받은 라우터들은 자신의 정보 뿐 아니라 자신이 갖고 있는 다른 라우터들의 정보까지 같이 보내준다.
- 아니면 라우터가 주기적으로 자신의 정보를 브로드캐스트로 뿌려 Host 들이 최신화할 수 있도록 한다.
    - 이떄 송신하는 패킷을 *ICMP Router Advertisement Message* 라고 하더라