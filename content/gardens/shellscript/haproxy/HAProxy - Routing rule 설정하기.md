---
tags:
  - shellscript
  - bash-haproxy
date: 2024-08-30
---
## TL;DR

- 다음의 내용을 `/etc/haproxy/haproxy.cfg` 에 추가

```
frontend {{ FE 이름 }}
	bind *:{{ FE 포트 }}
	mode tcp
	option tcplog
	default_backend {{ BE 이름 }}

backend {{ BE 이름 }}
	mode tcp
	option ssl-hello-chk
	balance roundrobin
	server {{ BE 서버 이름 }} {{ BE 서버 IP }}:{{ BE 서버 포트 }} check inter 1s fastinter 500ms rise 1 fall 1 weight 1
```

## 추가적인 옵션

### HTTP healthcheck

- Backend 에 http check 를 옵션으로 넣을 수도 있다:

```
	option httpchk GET /
	http-check expect status 200
```