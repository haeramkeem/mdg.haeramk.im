---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - apis
date: 2026-07-30
aliases:
  - Gateway
---
> [!info] 작물 단계: #seed 

> [!info]- 참고한 것들
> - [Gateway API - Introduction](https://gateway-api.sigs.k8s.io/docs/introduction/)
> - [Gateway API - API Overview](https://gateway-api.sigs.k8s.io/docs/concepts/api-overview/#gateway)

## 란?

- 간단하게 말하면 L4 proxy 다.
- 즉, 하나 이상의 [[Internet Protocol, IP (L3 Network Layer)|IP]] 를 열어서 하나 이상의 port 를 listening 하도록 하는 놈이다.
	- `Gateway` 가 생성되면 자동으로 LB [[Service (Kubernetes)|Service]] 가 생성된다.
	- 그리고 `Gateway` 안에는 `listeners` 를 명시하게 되는데, 여기에 port 와 protocol 등을 명시한다.
	- 그럼 LB service 의 IP + `listeners` 에 명시된 port/protocol 로 들어오는 트래픽들을 받아 뒤로 넘겨주게 된다.
- 보통 L4 proxy 에서는 '~로 받아서 ~로 준다' 는 식으로 설정을 한다. 근데 `Gateway` 는 받는 것은 명시하지만 어디로 줄지는 명시하지 않는다.
	- 즉, 위에서 '뒤로 넘겨주게 된다' 라고 했는데 그 '뒤' 를 여기다가 적는것이 아니다.
- 그럼 어떻게 하냐. 그 '뒤' 를 담당하는 object 가 따로 있고, 그 object 에다가 `Gateway` 를 명시하는 식으로 연결되도록 설계되어있다.
- 이 '뒤' 를 Gateway API 에서는 `Route` 라고 부르고, [[HTTPRoute (gateway.networking.k8s.io)|HTTPRoute]] 같은 애들이 있다.

### 기본 템플릿

- 그냥 이거 쓰자. Fine-tunning 할거면 API 찾아서 더 추가하면 된다.
	- 여기서 `gatewayClassName` 은 [[GatewayClass (gateway.networking.k8s.io)|GatewayClass]] 를 적는 건데, 이 예시에서는 [[Gateway API 활성화하기 (Cilium)|Cilium Gateway API 가이드]] 에 따라 `cilium` 으로 했다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: {{이름}}
spec:
  gatewayClassName: cilium
  listeners:
    - name: {{Listener 이름}}
      protocol: {{프로토콜 (HTTP/HTTPS 등)}}
      port: {{포트 (80/442 등)}}
      allowedRoutes:
        namespaces:
          from: All
```