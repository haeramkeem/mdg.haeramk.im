---
tags:
  - PKIX
  - 용어집
date: 2024-01-11
---
> [!info] 참고 [문서 - GlobalSign](https://www.globalsign.com/en/blog/what-is-a-certificate-signing-request-csr)

## 용어 설명

- 별거 없다 - [[Certificate (PKIX)|Certificate]] (인증서) Signing (서명) Request (요청), 즉, 이 파일에 담긴 내용을 가지고 인증서를 하나 생성해 달라는 일종의 신청서 같은 것이라 보면 된다.
- 이 파일에는 크게 두 종류의 정보가 담긴다:
	- 서버 정보
		- [[Common Name, CN (PKIX)|Common Name (CN)]] 부터 해서, Organization (O), Organization Unit (OU) 등의 요청하는 서버에 대한 정보들
	- 인증서에 사용될 키 쌍에 대한 정보
		- 키 쌍 중에서 공개키와, 키 타입 (RSA 인지 ECC 인지 등), 그리고 키 길이 (RSA 의 경우 2048 인지 4096인지 등) 정보
