---
tags:
  - 용어집
  - PKIX
---
> [!info] 참고 [문서](https://support.dnsimple.com/articles/what-is-common-name/)
## 용어 설명

- CN 혹은 Common Name 은 간단하게 생각하면 인증서의 도메인이다.
	- 물론 이렇게만 설명하면 잘못된 설명일 수 있다.
	- *서버의 이름* 이라고 보통 설명하지만 그렇게 말하면 감이 잘 안오잖아 그치?
- 가령 지금 자네가 보고 있는 이 블로그 의 인증서를 확인하면 CN 이 도메인과 동일하게 `mdg.haeramk.im` 로 되어 있는 것을 볼 수 있다.

![[Pasted image 20231201194649.png]]

- 근데 여러개의 도메인을 인증하고 싶은 경우 CN 을 사용하면 하나만 인증할 수 있기 때문에 좀 불편하다.
- 그래서 나온게 [[Subject Alternative Name, SAN (PKIX)|SAN (Subject Alternative Name)]] 이다

## CN 설정 예시

### OpenSSL Config 파일 예시

- OpenSSL Config 파일에서는 다음과 같이 CN 을 지정해 줄 수 있다

```
[req]
distinguished_name = cert_dn

[cert_dn]
CN = 여기에 적으면 된다!
```

### `openssl` 명령어 예시

- OpenSSL Config 를 사용하지 않고 `openssl` 명령어에서 바로 넣어줄 때는 `-subj` 옵션을 사용하면 된다.
- 10년짜리 Self-signed 인증서를 만드는 아래의 명령어를 참고하자.

```bash
openssl req -x509 \
    -newkey rsa:4096 \
    -keyout key.pem \
    -out cert.pem \
    -sha256 -days 3650 -nodes \
    -subj "CN=여기에 적으면 된다!"
```