---
tags:
  - kubernetes
---
## TL;DR

- 우선 [[NFS - 설치하기|NFS]] 가 설정되어 있어야 한다.

```yaml
nfs:
  server: {{ NFS 서버 엔드포인트}}
  path: {{ NFS 서버의 export path }}
replicaCount: 3
resources:
  requests:
    cpu: 50m
    memory: 64Mi
  limits:
    cpu: 100m
    memory: 128Mi
serviceAccount:
  name: default-sc-sa
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