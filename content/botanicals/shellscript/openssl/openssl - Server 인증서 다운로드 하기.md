---
tags:
  - 쉘스크립트
---
## 개요

- 내가 Server 를 설정하는 입장이 아니라 Client 로 Server 에 접속하는 입장이라면, Server 가 어떤 인증서를 제시하는지 확인하는 방법을 알아두면 디버깅시 활용할 수 있당.

## TL;DR!

- 서버에 접속해서 인증서 다운로드:

```bash
openssl s_client -showcerts -connect $IP:$PORT </dev/null 2>/dev/null \
	| openssl x509 -outform PEM \
	> $FILENAME.crt
```

- 인증서 뿐 아니라 연결 상태 등도 같이 체크하고 싶을 때는 `openssl s_client ...` 만 실행하면 된다.
	- `openssl x509 -outform PEM` 은 그냥 인증서 PEM 만 추출하는 것.
- 파일로 리다이렉트 시키지 않고 다른 것으로 연계하는 것도 가능하다.
	- 예를 들어, [[openssl - 인증서 상세 정보 확인하기|인증서 상세 정보 확인하는 방법]] 으로 인증서 자체에 대한 inspect 도 가능하다.