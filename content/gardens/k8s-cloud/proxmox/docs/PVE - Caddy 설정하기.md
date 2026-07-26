---
tags:
  - mdg
  - proxmox
date: 2026-07-25
---
> [!info]- 참고한 것들
> - [wg-easy 가이드](https://wg-easy.github.io/wg-easy/latest/examples/tutorials/caddy/)

## HTTPS

- 이걸 왜했냐
	- [[PVE - WireGuard 설정하기|WireGuard]] 대시보드가 HTTP 로 연결된다. VPN 으로 연결된다 할지라도 꼴보기싫다.
	- 그리고 혹시나 이놈 말고 다른 web 을 띄울 일이 있다면, 이놈으로 TLS 연결되도록 할 수 있다.
- 그럼 시작해보자.

## 1. Docker Compose

- 이렇게 `docker-compose.yaml` 을 만들자.
	- `80:80/tcp` 나 `443:443/udp` 같은거를 추가할 수 있긴 한데, 그걸 누가씀??

```yaml
services:
  caddy:
    container_name: caddy
    image: caddy:2.10.0-alpine
    ports:
      - '443:443/tcp'
    networks:
      - caddy
    restart: unless-stopped
    volumes:
      - './Caddyfile:/etc/caddy/Caddyfile:ro'
      - config:/config
      - data:/data
        
networks:
  caddy:
    name: caddy
    
volumes:
  config:
  data:
```

## 2. Caddyfile

- Caddy 의 설정파일인 `Caddyfile` 을 이렇게 만들어주면 된다.

```
{
	email 메일주소
}

도메인 {
	reverse_proxy IP혹은호스트:포트
	tls internal
}
```

- 뭐 규칙이 단순해서 보면 그냥 알 수 있다.
	- wg-easy 를 위해서는 이렇게 하면 된다.
	- 여기서 `reverse_proxy` 에 있는 `wg-easy` 는 [[PVE - WireGuard 설정하기|여기]] 의 Docker container 이름이 `wg-easy` 이기 때문이다.

```
wg.example.com {
	reverse_proxy wg-easy:51821
	tls internal
}
```

## 3. 시작

- 이제 이놈을 시작해주면 된다.

```bash
docker compose up -d
```

## 4. CA 신뢰하기

- 당연히 Caddy 가 만드는 인증서는 신뢰가 안되어있다.
- 그래서 CA 인증서를 꺼내갖고 신뢰하게 만들어야 한다.
- 이렇게 Docker container 안에서 빼내오고

```bash
docker cp caddy:/data/caddy/pki/authorities/local/root.crt ./root.crt
```

- 뭐 scp 를 쓰던 복붙을 하던 해서 내 컴퓨터에 갖고온 다음 신뢰하도록 해주면 된다.
	- [[PVE - WireGuard 설정하기|이거]] 기준으로는 지금 Docker 가 LXC 컨테이너 안에서 돌고있기 때문에 그냥 인증서 파일 `cat` 같은걸로 내용 출력해서 복붙하는게 편하다.
	- 인증서 신뢰하는건 운영체제별로 다르니까 검색하자.

## 5. wg-easy Docker compose 수정하기

- 지금 우리가 wg-easy 를 HTTPS 로 연결하기 위해 이짓을 하고 있으니까, wg-easy 의 Docker compose 도 수정해야 한다.
- [[PVE - WireGuard 설정하기|이거]] 기준으로 이렇게 수정해주자.
1. 우선 web port forward 를 지워준다.
	- 뭐 꼭 안지워도 작동은 한다. 근데 Caddy 를 쓰는 순간부터 container-container 간 통신을 할거니까 이놈은 이제 안쓰기 때문에 지워주자.

```yaml
services:
  wg-easy:
    # ...
    ports:
      - "{외부포트}:51820/udp" # <-- 이놈은 냅두고
      # - "51821:51821/tcp" <-- 이놈은 지워라
```

2. Network 를 추가해준다.

```yaml
services:
  wg-easy:
    # ...
	networks: # <-- 이거 추가
	  caddy:
	  
networks: # <-- 이것도 추가
  caddy:
    external: true
```

3. Docker compose 재시작하면 된다.

```bash
docker compose restart
```