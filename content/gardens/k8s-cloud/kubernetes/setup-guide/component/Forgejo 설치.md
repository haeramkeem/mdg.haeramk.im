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
			- 물론 SQLite 말고 Postgres 를 사용할 수도 있다. 그건 [[#SQLite 대신 CNPG 사용하기|아래]] 에서 설명한다. 근데 그래도 `replicaCount` 는 1로 해주자.
		- `service.ssh.type: ClusterIP` 위에서 말한 대로 일단은 HTTP-only 로 사용할거다. 그래서 SSH [[Service (Kubernetes)|Service]] 도 노출시키지 않고 [[Service (Kubernetes)|ClusterIP]] 로.
		- `tcpRoute`: 위에서 말한 대로 지금 Cilium 의 TCPRoute 가 안된다. 그래서 비활성화.
			- 그리고 차트 버전 `17.1.3` 기준, TCPRoute API 버전이 `gateway.networking.k8s.io/v1alpha2` 다. 근데 [[Gateway API 활성화하기 (Cilium)|이 가이드]] 에서 설치한 TCPRoute API 버전은 `gateway.networking.k8s.io/v1` 이다. 그래서 어차피 이 차트에 있는 template 은 못쓴다.

```yaml
replicaCount: 1

persistence:
  enabled: true
  size: {{PVC 사이즈}}
  accessModes:
    - ReadWriteOnce

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

## SQLite 대신 CNPG 사용하기

- PG Cluster 생성 방법은 [[Cloud Native Postgres Operator 설치 (CloudNativePG, CNPG)|이거]] 참고.
- 생성했다는 가정 하에, Helm value 의 `.gitea.config` 에 다음의 설정을 추가하면 된다.
	- `{{Forgejo CNPG Cluster 이름}}`: [[Cloud Native Postgres Operator 설치 (CloudNativePG, CNPG)#PG Cluster 템플릿|이 템플릿]] 에서의 `{{PG 이름}}` 이다.
	- `{{Forgejo CNPG 기본 database 이름}}`: [[Cloud Native Postgres Operator 설치 (CloudNativePG, CNPG)#PG Cluster 템플릿|이 템플릿]] 에서의 `{{PG 기본 database 이름}}` 이다.
	- `{{Forgejo CNPG superuser 이름}}`: [[Cloud Native Postgres Operator 설치 (CloudNativePG, CNPG)#PG Cluster 템플릿|이 템플릿]] 에서의 `{{PG superuser 이름}}` 이다.

```yaml
gitea:
  config:
    # ... 다른 설정들 ...
    database:
      DB_TYPE: postgres
      HOST: {{Forgejo CNPG Cluster 이름}}-rw:5432
      NAME: {{Forgejo CNPG 기본 database 이름}}
      USER: {{Forgejo CNPG superuser 이름}}
    # ... 다른 설정들 ...
```

- 그리고 CNPG password 는 이렇게 `.deployment.env` 로 주입해주면 된다.

```yaml
deployment:
  env:
    # ... 다른 설정들 ...
    - name: FORGEJO__database__PASSWD
      valueFrom:
        secretKeyRef:
          name: {{Forgejo CNPG Cluster 이름}}-app
          key: password
    # ... 다른 설정들 ...
```

## OIDC 설정

> [!info] Background
> - [[Authentik 설치|Authentik 설치 가이드]] 가 되어있다는 전제 하에 아래 내용이 이어집니다.
> - Self-hosted Authentik 이 아닌 경우는 따로 인터넷에 검색해보시길.

### CA trust

- 상황은 다음과 같다.
	- 현재 Authentik 은 [[Cert Manager 설치 (cert-manager)#Gateway 템플릿|이 방식]] 으로 self-signed cert 를 사용하도록 설정돼있다.
	- 근데 self-signed 이므로 Forgejo 에서는 이놈을 신뢰하지 않는다.
- 이 상황을 해결하기 위해 [[Trust Manager 설치 (trust-manager)|trust-manager]] 를 설치했다. 이제 이놈이 전파한 trusted CA cert 들을 Forgejo pod 에 낑가넣어보자.
- 우선 아래와 같이 `.extraVolumes` 와 `.extraVolumeMounts` 을 Helm value 에 추가해서 [[ConfigMap (Kubernetes)|ConfigMap]] 을 pod 에 붙일 수 있도록 해주자.
	- `{{경로}}` 는 모르겠으면 `/etc/ssl/self-signed` 로 하면 된다.

```yaml
extraVolumes:
  - name: ca-bundle
    configMap:
      name: {{Bundle 이름}}
extraVolumeMounts:
  - name: ca-bundle
    mountPath: {{경로}}
    readOnly: true
```

- 그리고 `.deployment.env` 에 다음의 항목을 추가한다.
	- 여기서 `ca-certificates.crt` 는 [[Trust Manager 설치 (trust-manager)#Bundle|여기]] 에서 `.spec.target.configMap.key` 의 값이다.

```yaml
deployment:
  env:
    # ... 다른 설정들 ...
    - name: SSL_CERT_FILE
      value: {{경로}}/ca-certificates.crt
    # ... 다른 설정들 ...
```

### Authentik Application 생성하기

- [[Authentik 설치#Provider/Application 생성|이거]] 보고 하면 된다. 이때 Redirect URL 은 이거다:

```
https://{{Forgejo UI 도메인}}/user/oauth2/authentik/callback
```

- 만들 때 이거 세가지를 복사해두자.
	- Group 이름
	- `Slug`
	- `Client ID`
	- `Client Secret`

### Authentik Application 연결하기

- 우선 `Client ID`/`Client Secret` 을 담는 secret 을 하나 만들어준다.

```bash
kubectl -n {{Forgejo namespace 이름}} create secret generic {{Forgejo OIDC secret 이름}} --from-literal=key='{{Client ID}}' --from-literal=secret='{{Client Secret}}'
```

- 그리고 Helm value 에서 `.gitea` 밑에 `oauth` 를 다음과 같이 적어준다.

```yaml
gitea:
  # ... 다른 설정들 ...
  oauth:
    - name: authentik
      provider: openidConnect
      existingSecret: {{Forgejo OIDC secret 이름}}
      autoDiscoverUrl: https://{{Authentik 도메인}}/application/o/{{Slug}}/.well-known/openid-configuration
      groupClaimName: groups
      adminGroup: {{Group 이름}}
  # ... 다른 설정들 ...
```

- 또한 `.gitea.config.service` 에 Authentik 으로만 회원가입할 수 있도록 다음과 같이 제한을 둔다.

```yaml
gitea:
  config:
    service:
      # ... 다른 설정들 ...
      ALLOW_ONLY_EXTERNAL_REGISTRATION: true
      # ... 다른 설정들 ...
```

- 마지막으로 `.gitea.config.oauth2_client` 에 다음과 같은 설정을 추가한다.

```yaml
gitea:
  config:
    # ... 다른 설정들 ...
    oauth2_client:
      ENABLE_AUTO_REGISTRATION: true
      ACCOUNT_LINKING: login
      USERNAME: nickname
    # ... 다른 설정들 ...
```

