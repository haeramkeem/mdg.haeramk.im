---
tags:
  - shellscript
  - bash-haproxy
date: 2024-08-30
---
## TL;DR

- 다음의 내용을 `/etc/haproxy/haproxy.cfg` 에 추가
	- `33000` 포트를 사용한다는 가정

```
listen stats
	bind *:33000
	stats enable
	stats realm Haproxy\ Statistics
	stats uri /
```

- 추가 옵션:
	- `bind *:33000 ssl crt /path/to/cert.pem` 로 stat page 에 대한 [[Transport Layer Security (TLS)|TLS]] 인증서를 지정해줄 수 있다.