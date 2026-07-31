---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - setup-guide
  - component
date: 2026-07-31
aliases:
  - Forgejo
---
## 개요

- Github 써도 된다.
- 근데 (1) 좀 디테일한 정보들을 git repo 에 넣고싶고 (2) 그런 정보들을 private repo 일지라도 Github 도 못보게 하고 싶다. (3) 어차피 [Forgejo](https://forgejo.org/) 로 private git server 구성하는게 별로 어렵지도 않다.

## (주의) SSH 는 안된다.

- 물론 이건 Forgejo 때문은 아니다.
- 작성시점 Cilium 의 [[TCPRoute (gateway.networking.k8s.io)|TCPRoute]] 가 안된다 ([[Gateway API 활성화하기 (Cilium)#TCPRoute|참고]]).
- 물론 뭐 [[Service (Kubernetes)|NodePort]] 같은걸로 해도 되긴 하지만 뭔가 꼬롬해서 그냥 일단은 HTTP only 로 사용하자.

## 설치 방법

- 우선 namespace 부터 만든다 (선택).

```bash
kubectl create namespace {{Namespace 이름}}
```

- 그리고 Forgejo Helm chart 는 admin 이름/패스워드를 별도의 [[Secret (Kubernetes)|Secret]] 으로 주입하게 해준다. 그래서 아래처럼 만들어준다.
	- `password` 는 맘대로 해도 된다. 근데 어차피 admin 은 잘 안쓸거니까 아래처럼 랜덤으로 하게 했다.

```bash
kubectl -n {{Namespace 이름}} create secret generic {{Secret 이름}} \
  --from-literal=username={{Admin ID}} \
  --from-literal=password="$(openssl rand -base64 24)"
```

- 비밀번호를 확인하고싶으면 이래하면 된다:
	- 당연한거지만 ==secret 의 내용은 암호화된게 아니다. 그래서 이름이 secret 이긴 하지만 절대로 외부에 공개되어서는 안된다==.

```bash
kubectl -n {{Namespace 이름}} get secret {{Secret 이름}} -o jsonpath='{.data.password}' | base64 -d; echo
```

- Helm value 작성
	- 몇가지만 짚어보자.
		- `replicaCount` Forgejo 는 기본적으로 SQLite 를 사용한다. SQLite 는 기본적으로 single node 이기 때문에 `replicaCount` 도 1이어야 한다.
			- 물론 SQLite 말고 Postgres 를 사용할 수도 있다. 근데 굳이?
		- `service.ssh.type: ClusterIP` 위에서 말한 대로 일단은 HTTP-only 로 사용할거다. 그래서 SSH [[Service (Kubernetes)|Service]] 도 노출시키지 않고 [[Service (Kubernetes)|ClusterIP]] 로.
		- `tcpRoute`: 위에서 말한 대로 지금 Cilium 의 TCPRoute 가 안된다. 그래서 비활성화.
			- 그리고 차트 버전 `17.1.3` 기준, TCPRoute API 버전이 `gateway.networking.k8s.io/v1alpha2` 다. 근데 [[Gateway API 활성화하기 (Cilium)|이 가이드]] 에서 설치한 TCPRoute API 버전은 `gateway.networking.k8s.io/v1` 이다. 그래서 어차피 이 차트에 있는 template 은 못쓴다.

```yaml
replicaCount: 1

persistence:
  enabled: true
  size: {{PVC 사이즈}}

service:
  ssh:
    type: ClusterIP

ingress:
  enabled: false

httpRoute:
  enabled: true
  parentRefs:
    - name: {{Gateway 이름}}
      namespace: {{Gateway 가 있는 namespace 이름}}
      sectionName: {{Gateway listener 이름}}
  hostnames:
    - {{UI 도메인}}
  terminate: true

tcpRoute:
  enabled: false
  
gitea:
  admin:
    existingSecret: {{Secret 이름}}
  config:
    server:
      ROOT_URL: https://{{UI 도메인}}
      DOMAIN: {{UI 도메인}}
      DISABLE_SSH: true
    service:
      DISABLE_REGISTRATION: true
```

- 그리고 설치.

```bash
helm upgrade --install forgejo oci://code.forgejo.org/forgejo-helm/forgejo -n {{Namespace 이름}} -f values.yaml
```