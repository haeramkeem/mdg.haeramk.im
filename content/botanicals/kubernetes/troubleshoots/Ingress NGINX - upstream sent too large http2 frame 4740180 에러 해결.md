---
tags:
  - 삽질록
---
## 문제 상황

- 기존에는 Deployment 를 NodePort Service 로 노출시켜서 접속하고 있었는데,
- 이 앞에 NGINX Ingress Controller 를 두고 이놈을 NodePort 로 노출시켜 접속하고자 하였으나 `502` 에러가 출력되었다.

## 해결 - NGINX 에의 upstream sent too large http2 frame: 4740180 에러 로그

- 발생한 로그

```
x.x.x.x - - [01/Jan/0000:00:00:00 +0000] "GET / HTTP/1.1" 502 150 "-" "curl/7.87.0" 197 0.002 [xxx] [] x.x.x.x:x 0 0.002 502 d4acbcddeb068470b9adb8c89c9fdbc4
0000/01/01 00:00:00 [error] 25460#25460: *36847278 upstream sent too large http2 frame: 4740180 while reading response header from upstream, client: x.x.x.x, server: xxx, request: "GET / HTTP/1.1", upstream: "grpc://x.x.x.x:x", host: "xxx:x"
```

- 관련 구글링
	- [All 404's result in 502 "upstream sent too large http2 frame" · Issue #4323 · kubernetes/ingress-nginx](https://github.com/kubernetes/ingress-nginx/issues/4323#issuecomment-1162939699)
	- [A misleading error when using gRPC with Go and nginx](https://kennethjenkins.net/posts/go-nginx-grpc/)
- 위의 글들을 읽어보면 결론은 다음과 같다.
	- upstream protocol 이 gRPC 이기에 NGINX 는 upstream 으로 HTTP/2 요청을 보낸다.
	- 하지만 upstream 은 HTTP/1.1 로 응답을 보낸다
		- 이 문제는 plaintext HTTP 와 gRPC 를 같은 포트에서 제공하는 경우 흔하게 발생할 수 있다. → plaintext HTTP 는 HTTP/1.1 이고, gRPC 는 HTTP/2 이기에
	- NGINX 는 이것을 받아들고 HTTP/2 로 해석을 한다.
		- 여기서 마법이 일어나게 된다.
		- HTTP/2 는 메세지를 프레임별로 쪼개고 프레임 앞에 헤더를 달되 헤더의 첫 3바이트가 헤더의 크기를 나타내는 수치인데
		- HTTP/1.1 은 무조건 메세지의 첫 줄로 `HTTP/1.1 {{ HTTP_STATUS_CODE }} {{ HTTP_STATUS_MSG }}` 를 보내기 때문에 메세지가 HTTP 버전 명시로 시작한다.
		- 이때 HTTP/1.1 메세지를 HTTP/2 로 분석하면 메세지 `HTTP/1.1 …` 의 첫 3바이트인 `HTT` 를 헤더의 길이로 해석한다.
		- ASCII 에 따르면 이 값은 `4740180` 이다. (!!!) → 그래서 NGINX 로그에 4740180 이라는 숫자가 찍혀있는 것.
		- 그리고 이것이 헤더의 길이 치고는 너무 큰값이기에 NGINX 가 에러를 내뿜는 것이다.
- 해결방법
	- 알고보니 upstream 에서는 gRPC 를 사용하지 않고 있었고, 따라서 ingress annotation 에서 GRPC 를 빼주는 것으로 해결하였다.
	- 이외에 gRPC 를 사용할 때 위같은 에러가 발생한다면, (1) gRPC 는 다른 포트를 사용하게 하거나 (2) h2c 를 이용해서 plaintext 를 HTTP2 로 응답하게 하는 방법이 있다고 한다.

## 기타 시도한 것들...

### 1. upstream 에서의 connection refused 의심 (upstream 의 port 에 접근을 못하고 있을거다)

- 하지만 NodePort 로는 접근이 잘 되고 Service 의 port 를 name 으로 지정하는 것이 아닌 port 80 으로 바꿔도 잘 되기에 네트워크 문제는 아닌 것으로 판단하였다.

### 2. Proxy buffer size 의심

- Size 어쩌고 하길래 혹시 Proxy buffer size 가 너무 작아서인가 라고 생각해 봤으나
- 하지만 NGINX ingress controller 에서 Proxy buffer 는 기본적으로 비활성화되어 있고

![[Pasted image 20240104164722.png]]

> [ConfigMap - Ingress-Nginx Controller#proxy-buffering](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#proxy-buffering)

- Proxy buffer size 와 count 를 늘려줘도 해결되지 않았다.
	- [ingress-nginx/annotations.md at main · kubernetes/ingress-nginx](https://github.com/kubernetes/ingress-nginx/blob/main/docs/user-guide/nginx-configuration/annotations.md)
- GRPC 버퍼 사이즈 바꿔도 안된다.
	- [https://github.com/kubernetes/ingress-nginx/issues/9363](https://github.com/kubernetes/ingress-nginx/issues/9363)

### 3. NGINX HTTP2 비활성화 의심

- 하지만 기본적으로 활성화 되어 있다. (Client - NGINX 간 통신시)

![[Pasted image 20240104163221.png]]

> [ConfigMap - Ingress-Nginx Controller#use-http2](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#use-http2)

- Upstream 으로의 통신에서는 HTTP2 가 활성화되어있지 않아서 그럴수도 있겠다고 생각했으나, GRPC 면 HTTP2 로 통신한다고 한다.
	- [kong nginx-ingress not support http2 upstream · Issue #2473 · Kong/kubernetes-ingress-controller](https://github.com/Kong/kubernetes-ingress-controller/issues/2473#issuecomment-1121351246)
	- upstream 으로의 HTTP2 통신은 gRPC 가 아닌 이상 비활성화된다고 한다.