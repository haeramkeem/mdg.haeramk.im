---
tags:
  - Proxmox
date: 2024-08-16
---
> [!info]- 참고한 것들
> - [공식 문서](https://pve.proxmox.com/wiki/Certificate_Management)

## CA 신뢰

- Proxmox 의 CA 는 당연히 self-signed 이기 때문에 신뢰하도록 설정되어있지 않다.
- 근데 Web UI 를 사용할 때 `(unsafe)` 라 뜨는 것이 불편하기도 하고, 어떨 때는 이 인증서때문에 static file 들을 불러오지 못해 Web UI 가 안뜨는 경우도 있다.
- 그래서 이 CA 를 신뢰해 보자. 일단 이렇게 CA 인증서를 복사해 온다.

```bash
scp root@${IP 주소}:/etc/pve/local/pve-ssl.pem ~/Downloads
```

- 그 다음에 이 인증서를 어떻게 신뢰하는지는 운영체제마다 다르다. 인터넷 검색하면 나오니까 이하 생략