---
tags:
  - mdg
  - kubernetes
  - cilium
  - kube-setup
date: 2027-07-30
aliases:
  - Kube-proxy 대체하기
---
> [!info]- 참고한 것들
> - [Cilium 공식문서](https://docs.cilium.io/en/latest/network/kubernetes/kubeproxy-free)

## 개요

- Cilium 이 kube-proxy 를 대체할 수 있다는 이야기는 오래전부터 내려온 도시전설이었는데, 우리도 한번 해보자.

## 1. Kube-proxy 제거

- 우선 kube-proxy 를 제거한다.
	- 처음부터 kube-proxy 없이 클러스터를 생성하고자 한다면, [[Basic Kubernetes installation guide - 기본 설치 가이드#Cluster 생성 및 합류|이거]] 를 참고하자.

```bash
kubectl -n kube-system delete ds kube-proxy
kubectl -n kube-system delete cm kube-proxy
```

- 그리고 iptables rule 들도 싹싹김치해준다.

```bash
iptables-save | grep -v KUBE | iptables-restore
ip6tables-save | grep -v KUBE- | ip6tables-restore
```

## 2. Helm value 업데이트

- 요놈들을 추가해주면 된다.

```yaml
kubeProxyReplacement: true
k8sServiceHost: "{{Kube-apiserver 엔드포인트 (IP 혹은 도메인)}}"
k8sServicePort: 6443
```

- 그리고 helm 으로 설치:

```bash
helm -n system-cilium upgrade --install cilium cilium/cilium -f cilium.yaml
```