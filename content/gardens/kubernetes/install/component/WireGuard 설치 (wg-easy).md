---
tags:
  - kubernetes
  - kube-install
  - wg-easy
date: 2024-08-30
---
## TL;DR

- NS 생성 (선택)

```bash
kubectl create ns system-wg
```

- Helm values:

```yaml title="wg.yaml"
environmentVariables:
  WG_HOST: {{ WireGuard 엔드포인트 }}
  PASSWORD: {{ WireGuard UI 비밀번호 }}
  WG_DEFAULT_ADDRESS: 10.1.0.x
  WG_ALLOWED_IPS: 10.0.0.0/16
  UI_CHART_TYPE: 1
  UI_TRAFFIC_STATS: true

service:
  type: NodePort

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: {{ WireGuard 엔드포인트 }}
      paths:
        - path: /
          pathType: ImplementationSpecific
```

- Helm repo add:

```bash
helm repo add wg-easy https://raw.githubusercontent.com/haeramkeem/wg-easy-helm/main/helm/charts
helm repo update
```

- Helm install:

```bash
helm -n system-wg install wg-easy wg-easy/wg-easy -f wg.yaml
```

## 삽질기

- 원래는 [이 차트](https://github.com/hansehe/wg-easy-helm) 를 사용하려 했는데, NodePort 지원이 구려서 여기서 좀 바꿔서 사용했다.
	- [바꾼 차트](https://github.com/haeramkeem/wg-easy-helm)
	- [변경1](https://github.com/haeramkeem/wg-easy-helm/commit/ac18270c1ee05be2c121438412ab1c0fba2364b8)) NodePort 옵션 추가
	- [변경2](https://github.com/haeramkeem/wg-easy-helm/commit/5f608aa9b7aa8132f83a3b38602d3adb1d220fc7)) ContainerPort, ServicePort, NodePort 설정 가능하게 함
- 원래는 NodePort 로 `31820` port 를 열고, HAProxy 로 원래의 WireGuard port 인 `51820` 으로 되돌려주려 했으나, HAProxy 에서 [[User Datagram Protocol, UDP (Network)|UDP]] 를 지원하지 않아 ([참고](https://github.com/haproxy/haproxy/issues/62)) 어쩔 수 없이 `31820` 을 사용함.
	- 근데 WG-Easy 에서는 `51820` 으로 인지하고 있기 때문에, tunnel config 을 생성할 때 `51820` 으로 생성해 준다.
	- 이것을 해결하기 위해 environment variable 과 ContainerPort 를 `31820` 으로 바꿔서 사용하려 했으나 왜인지 모르겠으나 안된다.
		- WG-Easy 에서 port 변경 관련해 지원이 구리거나
		- `iptables` 설정이 꼬이거나
		- 내가 뭔가 잘못했거나 셋중 하난데 굳이 이걸 디버깅해보긴 싫어서 패스
	- 따라서 그냥 기본 설정 그대로 사용하고 tunnel config 를 생성한 뒤에 수정해서 사용하기로 함

