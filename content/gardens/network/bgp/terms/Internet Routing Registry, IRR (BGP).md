---
tags:
  - 용어집
  - Network
  - BGP
date: 2024-05-25
---
> [!info]- 참고한 것들
> - [[5. RPKI, BGPSEC#1. IRR (Internet Routing Registry)|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 기본 아이디어

![[Pasted image 20240525133729.png]]

- IRR 의 기본적인 아이디어는 "각 AS 가 가진 routing 정보들을 DB 에 담아 누구든 조회 가능하게 하자" 이다.
	- 전 세계적으로 많은 IRR 들이 구성되어 있고, 이 IRR 들도 계층적으로 구성되어 있는데 최상단에는 5개의 RIR 이 운영하는 IRR 이 있다고 한다.

### IRR Object

- IRR Object 는 간단하게 생각하면 DB entry 이다.
	- RPSL (Routing Policy Specification Language) 라는 언어로 작성된다고 한다.
- IRR 의 object 는 type 이 있는데, 흔하게 사용되는 type 은 이 정도가 있다고 한다.

| TYPE                   | FULL NAME         | DESCRIPTION                            |
| ---------------------- | ----------------- | -------------------------------------- |
| `Mntner`               | Maintainer        | AS 관리자에 대한 credential (로그인 정보)         |
| `Aut-num`              | Autonomous Number | ASN                                    |
| `Inetnum` / `Inetnum6` | Inet Number       | AS 가 소유하고 있는 IP addr block (IP prefix) |
| `Route` / `Route6`     | Route             | 특정 IP addr block 에 대한 routing 정보       |
| `AS-Set`               | AS Set            | ASN 들의 그룹                              |
| `ROUTE-Set`            | Route Set         | Route 정보들의 그룹                          |

- 위 정보들은 서로 연관되어 참조된다고 한다.
	- DB relation 라고 생각하면 된다.

### IRR 단점

- 가장 큰 단점은 "강제성이 없음" 이다.
	- AS 관리자는 굳이 IRR 에 자신의 정보를 올리지 않아도 된다.
	- 따라서 IRR 의 많은 데이터 (거의 40%) 가 outdated 되어있어 신뢰성이 많이 떨어진다고 한다.