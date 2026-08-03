---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - setup-guide
  - component
date: 2026-07-30
aliases:
  - cert-manager
---
## 설치

- NS 생성 (선택)

```bash
kubectl create ns {{Cert manager namespace 이름}}
```

- Helm values
	- `.crds.keep` 은 이놈을 삭제해도 [[CustomResourceDefinitions (Kubernetes)|CRD]] 는 삭제하지 못하게 하는거다.
	- `.config` 에는 `ControllerConfiguration` 의 manifest 를 그냥 통째로 넣도록 하는 필드다.
		- 여기에 `.config.gatewayAPI.enabled` 를 하면 [[Gateway (gateway.networking.k8s.io)|Gateway]] 에 대한 cert 를 자동으로 관리할 수 있게 해준다 ([참고](https://cert-manager.io/docs/usage/gateway/)).
		- 지금은 안쓰지만, 일단은 체크.

```yaml
crds:
  enabled: true
  keep: true

config:
  apiVersion: controller.config.cert-manager.io/v1alpha1
  kind: ControllerConfiguration
  gatewayAPI:
    enabled: true
```

- Helm repo

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

- Helm install

```bash
helm -n {{Cert manager namespace 이름}} upgrade --install cert-manager jetstack/cert-manager -f values.yaml
```

## Self-signed 템플릿

- 물론 cert-manager 를 사용하면 ACME 를 이용해 public cert 를 받을 수 있다.
- 근데 난 싫어. [[index|주인장]] 이 거느리고 있는 cluster 는 private 에서만 접근할 수 있기 때문에 root [[Certificate Authority, CA (PKIX)|CA]] 도 직접 관리할거다.
- 대충 이런식으로 구성된다.
	- Cert-manager 에는 [[Certificate (PKIX)|인증서]] 에 대한 resource 인 `Certificate` 가 있고, 그놈을 발급해주는 `ClusterIssuer` resource 가 있다.
	- 그렇다면, 일단 root CA 인증서에 대한 `Certificate` 과 `ClusterIssuer` 가 있겠지. 그리고 이 인증서를 이용해 leaf 인증서를 발급하고자 하면, 이놈에 대한 `Certificate` 과 `ClusterIssuer` 도 있을거다.
	- 그래서 총 4개를 만들면 된다.
- 우선 root CA 부터 해보자.
	- 뭐 보면 딱히 이해 안될부분은 없다.
	- Mustache (`{{}}`) 부분은 맘대로 해도 되는데, 몇가지 짚으면
		- `Certificate.spec.commonName` 은 [[Distinguished Name, DN (PKIX)|CN]] 이다.
		- `Certificate.spec.secretName` 은 이 `Certificate` 가 생성되면 cert-manager 가 자동으로 인증서를 발급하고 그것을 [[Secret (Kubernetes)|Secret]] 으로 저장한다. 이때의 이놈 이름을 말한다.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: {{Root CA issuer 이름}}
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: {{Root CA cert 이름}}
spec:
  isCA: true
  commonName: {{Root CA cert 의 CN}}
  secretName: {{Root CA cert 가 담길 secret 이름}}
  duration: 87600h # 10 years
  renewBefore: 8760h # 1 year
  privateKey:
    algorithm: RSA
    size: 4096
    encoding: PKCS1
  issuerRef:
    name: {{Root CA issuer 이름}}
    kind: ClusterIssuer
    group: cert-manager.io
```

- 마찬가지의 방법으로 leaf 인증서도 만들어보자.
- 여기도 뭐 어려울건 없다.
	- `ClusterIssuer.spec.ca.secretName` 이 issuer 가 인증서를 서명할 때 뭘가지고 서명할 것이냐 라는 것이다. 당연히 root CA 겠죠?
	- `Certificate.spec.dnsNames` 은 [[Subject Alternative Name, SAN (PKIX)|SAN]] 이다.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: {{Leaf issuer 이름}}
spec:
  ca:
    secretName: {{Root CA cert secret 이름}}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: {{Leaf cert 이름}}
spec:
  commonName: {{Leaf cert 의 CN}}
  secretName: {{Leaf cert 가 담길 secret 이름}}
  dnsNames:
    - {{Leaf cert 의 SAN}}
  duration: 2160h # 90 days
  renewBefore: 720h # 30 days
  privateKey:
    algorithm: RSA
    size: 2048
    rotationPolicy: Always
  usages:
    - server auth
  issuerRef:
    name: {{Leaf issuer 이름}}
    kind: ClusterIssuer
    group: cert-manager.io
```

- 만들었으면 CA 인증서를 싹싹김치해서 내 컴퓨터에 심어야겠지? 아래의 방법으로 로컬에 저장한다.
	- 저장했으면 알아서 신뢰하도록 하면 된다. 이건 운영체제마다 다르니까 알아서 검색하시길.

```bash
kubectl -n {{Cert manager namespace 이름}} get secret {{Root CA cert secret 이름}} -o jsonpath='{.data.ca\.crt}' | base64 -d > /path/to/cert.crt
```

### Gateway 템플릿

> [!info] 보충설명 필요
> - 위에서 말한것 처럼, cert-manager 가 `Gateway` 를 자동사냥하게 할 수도 있는데, self-signed 라서 그게 되는지 안되는지 잘 모름띠.
> - 일단 이렇게 해놓고 자동사냥 방법 알게되면 업데이트하리라.

- 이 self-signed 를 [[Gateway (gateway.networking.k8s.io)|Gateway]] 에다가 낑가넣어보자.
- 우선 `Gateway` resource 가 생성될 namespace 는 [[기본 설치 (Cilium)|Cilium]] 으로 할거다. 그래서 인증서가 있는 namespace 와 다르기 때문에 아래와 같이 `ReferenceGrant` 를 만들어 준다.
	- 뭐 namespace 를 같게 할거면 필요없다.

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: {{이름}}
  namespace: {{Cert manager namespace 이름}}
spec:
  from:
    - group: gateway.networking.k8s.io
      kind: Gateway
      namespace: {{Gateway namespace 이름}}
  to:
    - group: ""
      kind: Secret
      name: {{Leaf cert secret 이름}}
```

- 그리고 HTTP/HTTPS 를 여는 `Gateway` 와 HTTP 를 HTTPS 로 redirect 하는 [[HTTPRoute (gateway.networking.k8s.io)|HTTPRoute]] 는 이렇게 하면 된다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: {{Gateway 이름}}
  namespace: {{Gateway namespace 이름}}
spec:
  gatewayClassName: cilium
  listeners:
    - name: {{HTTP listener 이름}}
      protocol: HTTP
      port: 80
      allowedRoutes:
        namespaces:
          from: All
    - name: {{HTTPS listener 이름}}
      protocol: HTTPS
      port: 443
      hostname: {{Leaf cert 의 CN 혹은 SAN}}
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            group: ""
            name: {{Leaf cert secret 이름}}
            namespace: {{Cert manager namespace 이름}}
      allowedRoutes:
        namespaces:
          from: All
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: {{Redirect HTTPRoute 이름}}
  namespace: {{Gateway namespace 이름}}
spec:
  parentRefs:
    - name: {{Gateway 이름}}
      sectionName: {{HTTP listener 이름}}
  rules:
    - filters:
        - type: RequestRedirect
          requestRedirect:
            scheme: https
            statusCode: 301
```