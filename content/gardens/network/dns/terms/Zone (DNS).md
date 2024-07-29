---
tags:
  - 용어집
  - Network
  - DNS
date: 2024-03-25
---
> [!info]- 참고한 것들
> - [[6. DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]
> - [네트워크에서 빼놓을 수 없는 'Under attack?' 회사 블로그](https://www.cloudflare.com/learning/dns/glossary/dns-zone/)

## 이게뭐고

- *Domain Zone* 은 하나의 기관 혹은 관리자에 의해 관리되는, [[Namespace (DNS)|DNS Namespace]] 내의 sub-tree 이다.
	- DNS Namespace 가 모든 domain 들에 대한 가상의 영역이라면, 특정 기관 혹은 관리자가 이 영역 중 어디를 땅따먹기 해서 관리하고 있는지 표시한 것이 Zone 인 것.
	- 따라서 Zone 들은 DNS namespace 를 비는 곳 없이 커버한다. (모든 Zone 의 합집합은 DNS namespace)
	- 가령, `.` (root) 와 그의 직계 자식 ([[Top Level Domain, TLD (DNS)|TLD]] 라고 부른다) 은 [ICANN](https://www.icann.org/) 에서 관리하는 하나의 zone 이다.

![[Pasted image 20240327212746.png]]
> 출처: 교수님 감사합니다.

- Zone 에 있는 모든 도메인을 관리하는 것은 너무 힘들기 때문에, zone 을 분리해서 다른 기관(관리자) 에게 넘기는 경우가 많고, 이것을 [[Zone Delegation (DNS)|위임 (Delegation)]] 한다고 한다.
- 각 zone 은 해당 zone 의 담당기관(관리자) 에 의해 [[Nameserver (DNS)|DNS nameserver]] 를 운영하며 record 와 query 에 응답할 의무가 있다.