---
tags:
  - kubernetes
  - nfs-subdir-external-provisioner
  - kube-setup
date: 2024-08-30
---
> [!info]- 참고한 것들
> - [공식 문서](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

## TL;DR

- 우선 [[NFS - Server, Client 설치하기|NFS]] 가 설정되어 있어야 한다.
- NS 생성 (선택)

```bash
kubectl create ns system-nfs
```

- 그리고 Helm 으로 설치해준다.
- Helm values: ([Full values ref](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner/blob/master/charts/nfs-subdir-external-provisioner/values.yaml))

```yaml title="nfs.yaml"
nfs:
  server: {{ NFS 서버 엔드포인트}}
  path: {{ NFS 서버의 export path }}
storageClass:
  name: default
  onDelete: retain
  pathPattern: ${.PVC.namespace}/${.PVC.name}
  defaultClass: true
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: app
              operator: In
              values:
                - default
        topologyKey: kubernetes.io/hostname
```

- Helm repo add

```bash
helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner
```

- Helm install

```bash
helm -n system-nfs upgrade --install nfs nfs-subdir-external-provisioner/nfs-subdir-external-provisioner -f nfs.yaml
```