---
tags:
  - kubernetes
  - kube-setup
date: 2024-08-31
---
> [!info]- 참고한 것들
> - [Kubernetes 공식문서](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
> - [스댕](https://stackoverflow.com/a/52487334)

## `PodNodeSelector`

- 로 NS 에다가 pod 의 nodeSelector 를 강제할 수 있다.
- 이 기능을 사용하려면 [[Basic Kubernetes installation guide - 기본 설치 가이드|여기]] 에서 말한것처럼 다음의 설정을 추가해 줘야 한다.
	- 물론 cluster 를 생성한 다음에 할 수도 있다. 그건 알아서 찾아보시라

```yaml
apiServer:
  extraArgs:
    enable-admission-plugins: "PodNodeSelector"
```

- 그리고 NS 의 `annotations` 에다가 node label 의 `key=value` 를 다음과 같이 적어주면 된다.

```yaml
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/node-selector: {{ 노드 라벨 key }}={{ 노드 라벨 value }}
```

### Controlplane taint 풀기

- 추가적으로, Controlplane node 에는 기본적으로 `NoSchedule` taint 가 걸려있다. 이건 다음과 같이 풀 수 있고:

```bash
kubectl taint node hk-cse302319-01 node-role.kubernetes.io/control-plane:NoSchedule-
```

- 이때는 다음과 같은 annotation 으로 controlplane node 에 pod 가 scheduling 되도록 할 수 있다:

```yaml
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/node-selector: node-role.kubernetes.io/control-plane=
```