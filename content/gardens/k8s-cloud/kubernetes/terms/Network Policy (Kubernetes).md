---
tags:
  - kubernetes
  - terms
date: 2023-02-02
aliases:
  - Network Policy
---
> [!info]- 참고한 것들
> [공홈 - Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
> - [티스토리 블로그](https://ikcoo.tistory.com/99)

## 란?

- Kubernetes [[Pod (Kubernetes)|Pod]] 들에 대한 방화벽 같은거다.
- 외부에서 내부로 들어오는 트래픽을 규제하는 것을 *Inbound traffic* 혹은 *Ingress* 라고 부르고
- 내부에서 외부로 나가는 트래픽을 규제하는 것은 *Outbound traffic* 혹은 *Egress* 라고 부른다.

### Network Policies

- 트래픽을 규제하는 방법들은 크게 다음의 네 가지가 있다.
	- *ipBlock*: 특정 IP 를 막는 것
	- *podSelector*: Pod 의 [[Label (Kubernetes)|Label]] 을 가지고 pod 들을 골라서 규제하는 것.
	- *namespaceSelector*: 특정 [[Namespace (Kubernetes)|Namespace]] 모든 pod 를 규제하는 것.
	- *protocol & port*: 네트워크 프로토콜 혹은 port 를 규제하는 것.
- 이 네가지 중에 ingress 는 네가지 모두 사용할 수 있고, egress 는 *ipBlock* 하고 *protocol & port* 를 사용할 수 있다.

### Container Network Interface (CNI) and Network Policy

- 근데 이 network policy 를 실제로 구현하는 것은 [[Container Network Interface, CNI (Kubernetes)|CNI]] 의 역할이다.
- 즉, CNI 에서 지원하지 않으면 이 기능을 사용하지 못한다는 것.
- 아래는 지원 여부에 대한 표이다: 대부분은 지원하는듯

![[Pasted image 20250303114935.png]]

> 출처: [itnext.io](https://itnext.io/benchmark-results-of-kubernetes-network-plugins-cni-over-10gbit-s-network-36475925a560)