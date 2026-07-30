---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - story
  - setup-guide
  - component
date: 2026-07-27
aliases:
  - Kube-vip
---
> [!info]- 참고한 것들
> - [공식문서](https://kube-vip.io/docs/installation/static/)

## TL;DR

- NS 생성 (선택)

```bash
kubectl create ns system-kube-vip
```


- Helm chart:

```bash
helm repo add kube-vip https://kube-vip.github.io/helm-charts
helm repo update
```

### Kube-vip

- Helm values:

```yaml
image:
  repository: ghcr.io/kube-vip/kube-vip
  pullPolicy: IfNotPresent
  tag: "v1.2.1"

config:
  address: "{{VIP 주소}}"

env:
  vip_interface: "{{VIP NIC}}"
  cp_enable: "true"
  vip_arp: "true"
  vip_leaderelection: "true"

affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: node-role.kubernetes.io/control-plane
          operator: Exists
```

- Helm install:

```
helm -n system-kube-vip upgrade --install kube-vip kube-vip/kube-vip -f kube-vip.yaml
```

### Kube-vip-cloud-provider

> [!warning] Deprecated
> - [[index|주인장]] 은 이제 더 이상 Kube-vip 의 LB 기능을 사용하지 않는다 ([[LB IPAM 사용하기 (Cilium)|관련 기록]]).
> - 아래는 그냥 기록용.

- Kube-vip helm value 수정:
	- 이놈을 사용하려면 아래처럼 kube-vip 의 helm value 를 수정해야 한다.

```yaml
env:
  svc_enable: "true" # <-- 이놈
```

- Helm value:
	- `cm.data` 에 할당할 IP 범위를 지정할 수 있다.
		- 우선 key 는 `{{cidr/range}}-{{namespace}}` 형식이다.
			- `cidr-*` 의 경우에는 value 를 [[Classless Inter-Domain Routing, CIDR (IP)|CIDR]] 형식으로 적는다.
			- `range-*` 의 경우에는 value 를 IP 범위 (`{{시작 IP}}-{{끝 IP}}`) 로 적는다.
			- `{{namespace}}` 에는 이 규칙이 적용될 [[Namespace (Kubernetes)|Namespace]] 를 적으면 되는데, `global` 이면 모든 namespace 에 적용된다.
		- 아래의 예시를 참고하자.

```yaml
cm:
  data:
	cidr-example: 192.168.0.10/32
    range-global: 192.168.0.11-192.168.0.19
```

- Helm install:

```bash
helm -n system-kube-vip upgrade --install kube-vip-cloud kube-vip/kube-vip-cloud-provider -f kube-vip-cloud.yaml
```