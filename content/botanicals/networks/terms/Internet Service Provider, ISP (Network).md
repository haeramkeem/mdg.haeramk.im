---
tags:
  - 용어집
  - Network
date: 2024-06-26
---
> [!info]- 참고한 것들
> - [[3. BGP|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 인터넷 서비스 제공자

- 말 그대로 기관 혹은 일반 사용자에게 인터넷을 제공해주는 업체.
- 이 ISP 들은 하나 이상의 [[Autonomous System, AS (BGP)|AS]] 를 운용하며 고객이 다른 AS 와도 통신이 가능하게 해준다.
- 따라서 ISP 들은 [[National Internet Registry, NIR (Network)|NIR]] 등으로 부터 IP 를 할당받게 되고, 할당받은 IP 들을 다음과 같이 관리한다.
    - 자신의 서버나 네트워크를 위해 IP 몇개 냄겨 놓고
    - 자신들의 고객에게 제공해 줄 IP block 도 정하고
    - 고객이 많아 질 때를 대비해 몇개 꽁쳐둔다.