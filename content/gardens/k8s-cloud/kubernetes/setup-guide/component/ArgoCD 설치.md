---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - setup-guide
  - component
date: 2026-09-10
aliases:
  - ArgoCD
---
## 설치

- NS 생성 (선택)

```bash
kubectl create ns {{ArgoCD namespace 이름}}
```

- OIDC secret 만들기
	- 우선 [[Authentik 설치|Authentik]] 보고 Client ID 와 Client secret 을 만들어준다.
	- 그리고 이래 하면 secret 이 생성된다.

```bash
kubectl -n {{ArgoCD namespace 이름}} create secret generic {{ArgoCD OIDC secret 이름}} --from-literal=clientID="{{Client ID}}" --from-literal=clientSecret="{{Client secret}}"
```

- Helm values
	- ArgoCD 관련 내용들
		- `global.domain`: ArgoCD UI 도메인
		- `crd`: Default 값이라 굳이 안넣어도 되긴 하는데, 그래도 [[CustomResourceDefinitions (Kubernetes)|CRD]] 는 민감하기 때문에 넣어둔다.
			- `install`: CRD를 설치할건지
			- `keep`: ArgoCD uninstall 해도 CRD는 지우지 않음 (manual delete 하기 위해)
		- `configs.cm.application.resourceTrackingMethod`:
			- ArgoCD 가 관리하는 application 인지 아닌지를 트래킹하기 위해 어떤 방법을 사용할지 정하는 설정
			- Default 로는 `app.kubernetes.io/instance` label 을 사용한다. 근데 이 label 은 ArgoCD 만 쓰는게 아니기 때문에 충돌 위험이 있다.
			- 그래서 default 인 label tracking 이 아니라 annotation tracking 을 해주기 위해 이 필드 값을 `annotation` 으로 바꿔주는거다.
		- `configs.params.server.insecure`:
			- 어차피 Gateway API 뒤에서 돌기 때문에 `insecure: true` 로 해준다.
	- [[Gateway API (Kubernetes)|Gateway API]] 관련 내용들
		- `server.httproute` 안에 아래처럼 넣어주면 된다.
	- [[Authentik 설치|Authentik]] 내용들
		- `server.volumes` / `server.volumeMounts` / `server.env`
			- Authentik 의 CA 인 self-signed CA 를 신뢰하도록 하기 위해, [[Trust Manager 설치 (trust-manager)|trust-manager]] 가 복사해준 CA 들을 컨테이너 안에 낑가넣어야 된다.
		- `dex.enabled`
			- Authentik을 쓸거니까 DEX 는 비활성화한다.
		- `configs.cm.oidc.config`
			- 뭐 아래 나온대로 하면 된다.
				- 가령 Authentik URL 이 `auth.example.com` 이고 App 만들 때 slug 를 `argo-cd` 로 했다면, `issuer` 는 `https://auth.example.com/application/o/argo-cd/` 이다.
				- 그리고 `clientID` 와 `clientSecret` 에서 `$` 은 secret 이름이라는 뜻이다.
					- 가령 위에서 secret 이름을 `argocd-oidc` 로 했다면, `$argocd-oidc:clientID` (그리고 `$argocd-oidc:clientSecret`) 로 적으면 된다.
		- `configs.rbac.policy.csv`:
			- Authentik 에서 admin group 을 생성해주면, 그 admin group 에 포함된 유저는 ArgoCD 에서도 `role:admin` 을 부여한다는 내용이다.
			- Authentik 에서 app 을 만들 때 admin group 이름을 만약 `argo-admin-group` 으로 했다면, 여기에 `g, argo-admin-group, role:admin` 이라고 적으면 된다.
	- [[Forgejo 설치|Forgejo]] 내용들
		- `configs.repositories`: 대부분의 프로젝트와 달리 Forgejo 는 OCI 로 Helm chart 를 배포한다. 그래서 이런애들에 대해서는 이 필드에 선언해줘야 한다.

```yaml
global:
  domain: {{ArgoCD UI 도메인}}

crds:
  install: true
  keep: true

configs:
  cm:
    application.resourceTrackingMethod: annotation
    oidc.config: |
      name: Authentik
      issuer: https://{{Authentik URL}}/application/o/{{ArgoCD app slug}}/
      clientID: ${{ArgoCD OIDC secret 이름}}:clientID
      clientSecret: ${{ArgoCD OIDC secret 이름}}:clientSecret
      requestedScopes:
        - openid
        - profile
        - email

  rbac:
    policy.csv: |
      g, {{Authentik admin group 이름}}, role:admin

  params:
    server.insecure: true

  repositories:
    forgejo-helm:
      name: forgejo-helm
      url: code.forgejo.org/forgejo-helm
      type: helm
      enableOCI: "true"

dex:
  enabled: false

server:
  volumes:
    - name: ca-bundle
      configMap:
        name: {{Trust-manager Bundle 이름}}
  volumeMounts:
    - name: ca-bundle
      mountPath: {{Container 내 경로 (임의로)}}
      readOnly: true
  env:
    - name: SSL_CERT_FILE
      value: {{Container 내 경로 (임의로)}}/ca-certificates.crt

  httproute:
    enabled: true
	hostnames:
	  - {{ArgoCD UI 도메인}}
	parentRefs:
	  - name: {{Gateway 이름}}
	    namespace: {{Gateway 가 있는 namespace 이름}}
		sectionName: {{Gateway listener 이름}}
```

- Helm repo

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
```

- Helm install

```bash
helm -n {{ArgoCD namespace 이름}} upgrade --install argocd argo/argocd -f values.yaml
```