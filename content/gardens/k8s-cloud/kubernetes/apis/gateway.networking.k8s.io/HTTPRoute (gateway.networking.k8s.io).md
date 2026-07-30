---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - apis
date: 2026-07-30
aliases:
  - HTTPRoute
---
> [!info] 작물 단계: #seed 

> [!info]- 참고한 것들
> - [Gateway API - Introduction](https://gateway-api.sigs.k8s.io/docs/introduction/)
> - [Gateway API - API Overview](https://gateway-api.sigs.k8s.io/docs/concepts/api-overview/#httproute)

## 란?

- L7 proxy 다. 사실상 [[Ingress (Kubernetes)|Ingress]] 와 거의 같다고 생각하면 된다.
	- 같은데 Gateway API 왜씀? 이라고 한다면, Ingress 에는 L4-L7 이 유비빔되어있어서 유지보수가 힘들었다.
	- 그래서 깔@롱하게 새로 설계한 것이 Gateway API 인것.

### 기본 템플릿

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: {{이름}}
spec:
  parentRefs:
  - name: {{Gateway 이름}}
    sectionName: {{Listener 이름}}
  hostnames:
  - {{도메인}}
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: {{Service 이름}}
      port: {{Service 포트}}
```

### HTTP Redirect

- HTTP -> HTTPS redirect 는 하도 많이 쓰니까 예시 겸 생활꿀팁 겸 적어둔다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-to-https
spec:
  parentRefs:
    - name: {{Gateway 이름}}
      sectionName: {{Listener 이름}}
  rules:
    - filters:
        - type: RequestRedirect
          requestRedirect:
            scheme: https
            statusCode: 301
```