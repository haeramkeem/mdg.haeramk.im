---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - story
  - setup-guide
  - component
  - cilium
date: 2027-07-30
aliases:
  - CiliumL2AnnouncementPolicy
  - CiliumLoadBalancerIPPool
  - LB IPAM 사용하기
---
> [!info]- 참고한 것들
> - [Cilium 공식문서 - LB IPAM](https://docs.cilium.io/en/stable/network/lb-ipam/)
> - [Cilium 공식문서 - L2 Announcements](https://docs.cilium.io/en/stable/network/l2-announcements)

## 개요

> [!warning] Beta feature
> - 지금보니까 이것도 작성일자 기준 beta 다.
> - 뭐 그래도 Cilium 은 믿을만 하고 내 클러스터는 production 이 아닌 장난감이니까 한번 써보자.

- 이전까지는 [[Kube-vip 설치 (kube-vip)#Kube-vip-cloud-provider|kube-vip-cloud-provider]] 를 사용해서 LB 기능을 사용 했었다.
- 근데 이놈이 아직 stable 이 아니기도 하고, 믿음직스러운 Cilium 이 LB IPAM (IP Address Management) 기능을 제공한다기에 이놈으로 갈아타버리기.

## 1. Prerequisites

- [[Kube-proxy 대체하기 (Cilium)]] 가 되어있어야 한다고 한다.

## 2. Helm value 업데이트

- 요놈들을 추가해주면 된다.
	- 여기서 `k8sClientRateLimit` 은 VIP 생성을 위한 leader election 이 지속적으로 API traffic 을 발생시키기 때문에 바꿔주는 것이라고 한다.
		- 기본 설정값인 `qps: 5, burst: 10` 로는 이 leader election traffic 때문에 금방 차버린다. 그래서 이놈을 더 늘려주는 것.
		- 간단한 테스트용으로는 아래처럼 하고, 더 fine-tunning 을 하고싶다면 [공식 가이드](https://docs.cilium.io/en/stable/network/l2-announcements/#sizing-client-rate-limit) 를 참고하자.

```yaml
l2announcements:
  enabled: true
  
k8sClientRateLimit:
  qps: 50
  burst: 100
```

- 그리고 helm 으로 설치:

```bash
helm -n system-cilium upgrade --install cilium cilium/cilium -f cilium.yaml
```

## 3. Policy, IP Pool 생성

- 아래 두 놈을 만들어주면 완성이다.

### CiliumL2AnnouncementPolicy

- `CiliumL2AnnouncementPolicy` 는 어떤 service 를, 어떤 IP 에 대해, 어느 NIC 으로 announce 할지 설정하는 놈이다.
- 대충 아래처럼 하면 된다.
	- 기본적으로는
		- `interfaces`: NIC 이름을 regex 형태로 적어두면 된다.
		- `externalIPs`: [[Service (Kubernetes)|Service]] 의 `.spec.externalIPs` 필드를 announce 할지 선택하는 것
		- `loadBalancerIPs`: [[Service (Kubernetes)|Service]] 의 `.status.loadbalancer.ingress` 필드를 announce 할지 선택하는 것
	- 이거 말고도
		- `serviceSelector` 나 `nodeSelector` 로 service/node 를 선택할 수도 있다.

```yaml
apiVersion: cilium.io/v2alpha1
kind: CiliumL2AnnouncementPolicy
metadata:
  name: default
spec:
  interfaces:
    - {{NIC 이름 regex}} # 예: ^eth0$
  externalIPs: true
  loadBalancerIPs: true
```

### CiliumLoadBalancerIPPool

- `CiliumLoadBalancerIPPool` 은 LB IPAM pool 을 설정하는 것이다.
- 문법은 아래 참고하자. 별로 어려울건 없다.

```yaml
apiVersion: cilium.io/v2
kind: CiliumLoadBalancerIPPool
metadata:
  name: default
spec:
  blocks:
    - cidr: "{{CIDR 형식}}"
    - start: "{{시작 IP}}"
      stop: "{{끝 IP}}"
```