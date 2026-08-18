---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - setup-guide
  - component
date: 2026-08-16
aliases:
  - trust-manager
---
## 개요

- 이름 그대로 [[Pod (Kubernetes)|Pod]] 가 특정 [[Certificate Authority, CA (PKIX)|CA]] 를 신뢰하도록 도와주는 툴이다.
- 작동 방식은 무식하다. `Bundle` 이라는 걸로 특정 CA cert 를 지정하면, 그 CA cert 를 모든 (혹은 지정한) namespace 에 전부 [[ConfigMap (Kubernetes)|ConfigMap]] 으로 복사해서 해당 namespace 에 있는 pod 들이 사용할 수 있게 한다.

## 설치

- NS 생성 (선택)
	- [[index|주인장]] 은 그냥 [[Cert Manager 설치 (cert-manager)|cert-manager]] 와 같은 namespace 사용했다.

```bash
kubectl create ns {{Trust manager namespace 이름}}
```

- Helm values
	- 여기서 `.app.trust.namespace` 는 source CA cert 가 있는 namespace 를 말한다. 당연히 [[Cert Manager 설치 (cert-manager)|cert-manager]] 의 namespace 를 사용해야 한다.

```yaml
app:
  trust:
    namespace: {{Cert manager namespace 이름}}
```

- Helm repo

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

- Helm install

```bash
helm -n {{Trust manager namespace 이름}} upgrade --install trust-manager jetstack/trust-manager -f values.yaml
```

## Resources

### Bundle

- 위에서 말한 것 처럼, `Bundle` 이라는 것으로 pod 가 신뢰할 CA cert 들을 ConfigMap 의 형태로 namespace 들에게 복사하게 할 수 있다.
	- `useDefaultCAs` 는 앵간하면 `true` 여야 한다. 이게 없으면 지정한 CA '만' 신뢰하고 다른 기본 CA 들 (가령 Let's Encrypt 같은 애들) 은 신뢰하지 않는다.
	- `{{CA cert 이름}}` 은 신뢰하고자 지정하는 secret 의 이름이다.
		- [[Cert Manager 설치 (cert-manager)|cert-manager]] 의 `Certificate` resource 를 생성하면 동일한 이름의 secret 이 생성되므로 `Certificate` resource 의 이름이라고 생각해도 된다.
			- 가령 [[Cert Manager 설치 (cert-manager)#Self-signed 템플릿|이 템플릿]] 에서는 `{{Root CA cert 이름}}` 이다.
		- 당연히 이 secret 은 type 이 `kubernetes.io/tls` 이고, 그래서 `ca.crt` key 가 무조건 있다.

```yaml
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: {{Bundle 이름}}
spec:
  sources:
    - useDefaultCAs: true
    - secret:
        name: {{CA cert 이름}}
        key: ca.crt
  target:
    configMap:
      key: ca-certificates.crt
```