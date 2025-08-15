---
tags:
  - terms
  - network
  - dns
date: 2024-03-25
aliases:
  - Top Level Domain
  - TLD
---
> [!info]- 참고한 것들
> - [[6. DNS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 이게 뭐임

- [[Namespace (DNS)|DNS Namespace]] 내에서 root 바로 아래에 있는 [[Full Qualified Domain Name, FQDN (DNS)|domain]] 들을 *Top Level Domain, TLD* 라고 부른다.
- [ICANN](https://www.icann.org/) 이라는 단체에서 관리한다.

## 종류

### Generic TLD (gTLD)

- 특정 의미를 가지고 국가 등에 상관 없이 사용할 수 있는 TLD 이다.
- `com`, `net`, `org` 등이 포함된다.

### Country Code TLD (ccTLD)

- 특정 국가에 속한 TLD 를 말한다.
- 우리나라는 `kr` 이고, 다른 나라 중에는 `uk`, `ca`, `au` 등이 여기에 속하는 것

### Open ccTLD

- 특정 국가의 TLD 이긴 하지만, 해당 국가가 아닌 곳에서도 등록할 수 있는 TLD 를 말한다.
	- 아마 도메인 장사를 국가사업으로 삼는 경우에 이 짓을 한다. 실제로 `io` 는 영국령 인도양 지역의 ccTLD 인데, 요즘 스타업들에서 많이 사용하며 수입이 짭짤하다고 한다.
- `co`, `io`, `be`, `me` 등이 있다.