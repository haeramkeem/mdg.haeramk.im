---
tags:
  - kubernetes
  - kube-install
date: 2024-08-30
---
> [!info]- 참고한 것들
> - [Cilium 공식 문서](https://docs.cilium.io/en/stable/installation/k8s-install-helm/)

## TL;DR

- NS 생성 (선택)

```bash
kubectl create ns system-cilium
```

- Helm values:

```yaml title="cilium.yaml"
ipam:
  mode: "cluster-pool"
  operator:
    clusterPoolIPv4PodCIDRList:
      - "10.128.0.0/16"
```

- Helm repo add:

```bash
helm repo add cilium https://helm.cilium.io/
```

- Helm install:

```bash
helm -n system-cilium install cilium cilium/cilium -f cilium.yaml
```