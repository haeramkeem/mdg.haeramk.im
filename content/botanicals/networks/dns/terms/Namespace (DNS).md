---
tags:
  - 용어집
  - Network
  - DNS
---
> [!info] 참고한 것
> - 컴퓨터 네트워크 특강 (권태경 교수님 '24H1, SNU CSE)

## Domain Tree

- [[Domain Name System, DNS (DNS)|DNS]] 는 *Domain Namespace* 라는 이름의 트리 자료구조 형태를 가진다.

![[Pasted image 20240327210443.png]]
> 출처: 교수님 감사합니다.

- 위 그림처럼, 최상단의 root node 는 `.` 이고, 그 아래로 node 마다 label 이 붙는 형태의 트리 전체를 domain namespace 라고 한다.
- 이 트리에는 여러 특징이 있다:
	- Domain namespace 는 여러개의 [[Zone (DNS)|Zone]] 으로 나뉘어 관리되고, 모든 Zone 들이 합쳐져 domain namespace 전체를 커버한다.
	- 각 노드는 [[Full Qualified Domain Name, FQDN (DNS)|FQDN]] 이라는 포맷으로 유일하게 구분된다.