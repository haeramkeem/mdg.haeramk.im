---
tags:
  - terms
  - network
  - dns
date: 2024-03-24
---
> [!info]- 참고한 것들
> - [[6. DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [[11. Application Layer, DNS#Domain Name Space|충남대 김상하 교수님 컴퓨터네트워크 강의 (Spring 2021)]]

## 이게 뭐임

- 흔히 말하는 domain 이라고 생각하면 된다.
- 근데 이제 [[Namespace (DNS)|DNS Namespace]] 의 관점에서 보자면, 어떤 한 노드를 유일하게 구분해 주는 ID 로 FQDN 을 정의할 수 있다.
- 형식은 원하는 노드에서부터 시작해 root 까지 올라오며 지나친 노드들의 label 을 `.` 으로 연결해 주면 된다.
	- 아래 `challenger.atc.fhda.edu.` 예시 보면 기깔나게 이해될 것이여

![%E1%84%8B%E1%85%B5%E1%84%85%E1%85%A9%E1%86%AB11%20-%20Application%20Layer,%20DNS%20cf00b598d59a4faa847406eedca1bf01/image2.png](gardens/network/originals/comnet.fall.2021.cse.cnu.ac.kr/images/11_cf00b598d59a4faa847406eedca1bf01/image2.png)

- 따라서 원래 모든 FQDN 은 `.` 으로 끝나야 하지만, 생략해도 된다.
- 어떤 노드의 FQDN 을 알면 해당 노드의 domain namespace 내에서의 위치도 대략 알 수 있다.