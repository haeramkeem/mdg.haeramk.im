---
tags:
  - 용어집
  - PKIX
date: 2023-12-11
---
> [!info] 참고 [문서](https://support.dnsimple.com/articles/what-is-ssl-san/)

## 용어 설명

- 인증서가 여러개의 도메인을 인증할 수 있도록 해주는 기능이다.
- [[Common Name, CN (PKIX)|Common Name]] 에서도 설명한 것처럼, 이것이 하나의 도메인밖에 커버하지 못한다는 문제를 해소하기 위해 나왔다.

## SAN 설정 예시

### OpenSSL Config 파일 예시

- OpenSSL Config 파일에서는 다음과 같이 SAN 을 지정해 줄 수 있다

```
[req]
x509_extensions = v3_req

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.0 = 첫번째 도메인
DNS.1 = 두번째 도메인
IP.0 = IP 도 가능하다!
```