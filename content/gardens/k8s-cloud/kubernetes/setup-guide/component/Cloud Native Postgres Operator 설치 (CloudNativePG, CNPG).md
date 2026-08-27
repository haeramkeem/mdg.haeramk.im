---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - setup-guide
  - component
date: 2026-08-18
aliases:
  - CloudNativePG
  - CNPG
---
## 개요

- Kubernetes app 들 중에 PG 를 [[Database Management System, DBMS (Database)|DBMS]] 로 사용할 수 있게 지원하는 것들이 유독 많다.
- 아마 여러 DBMS operator 중에 CNPG 가 그만큼 유명하고 영향력이 있기 때문에 다른 app 들도 이놈과의 integration 을 지원하는듯하다.
- 그래서 이거 하나 설치해두면 편하게 PG instance 를 띄우고 app 에서 요긴하게 사용할 수 있다.

## 설치

- NS 생성 (선택)

```bash
kubectl create ns {{CNPG namespace 이름}}
```

- Helm values
	- 뭐 딱히 바꿀건 없다. default 로 사용하거나 혹시 바꾸고싶은게 있으면 [chart default helm values](https://github.com/cloudnative-pg/charts/blob/main/charts/cloudnative-pg/values.yaml) 보고 바꾸면 된다.

- Helm repo

```bash
helm repo add cnpg https://cloudnative-pg.github.io/charts
helm repo update
```

- Helm install

```bash
helm -n {{CNPG namespace 이름}} upgrade --install cnpg cnpg/cloudnative-pg -f values.yaml
```

## PG Cluster 템플릿

- 이 CNPG operator 로 PG instance 를 띄울 때는 아래의 템플릿을 사용하면 된다.

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: {{PG 이름}}
  namespace: {{PG 가 설치될 namespace 이름}}
spec:
  instances: {{Instance 개수}}

  storage:
    size: {{PG 가 사용할 storage 크기}}
    storageClass: # (아마도) 비워두면 default 를 사용한다.

  bootstrap:
    initdb:
      database: {{PG 기본 database 이름}}
      owner: {{PG superuser 이름}}
```

### 생성되는 resource 들

- 그리고 이걸로 Cluster resource 를 만들게 되면 여러가지 것들이 자동생성된다.
- 우선 PG 가 돌아가는 [[Pod (Kubernetes)|Pod]] 가 생성된다.
	- 아래는 `instances: 1` 일 때의 예시이다.

```
NAME                              READY   STATUS    RESTARTS      AGE
{{PG 이름}}-1                      1/1     Running   0             ...
```

- 그리고 이놈에게 접근할 수 있게 하는 [[Service (Kubernetes)|ClusterIP]] 도 생성되는데, 접근모드에 따라 3개가 생긴다.

```
NAME             TYPE        CLUSTER-IP  EXTERNAL-IP  PORT(S)         AGE
{{PG 이름}}-r     ClusterIP   x.x.x.x     <none>       5432/TCP        ...
{{PG 이름}}-ro    ClusterIP   x.x.x.x     <none>       5432/TCP        ...
{{PG 이름}}-rw    ClusterIP   x.x.x.x     <none>       5432/TCP        ...
```

- 또한 여러 secret 들도 생기는데, 이 PG 에 접근할 수 있는 계정이 담긴 secret 은 `-app` suffix 가 달려있다.
	- 이놈을 가지고 다른 application 에 PG connection password 를 주입해주면 된다. Key 는 `.data.password` 이다.

```
NAME                     TYPE                       DATA   AGE
{{PG 이름}}-app           kubernetes.io/basic-auth   xx     ...
```