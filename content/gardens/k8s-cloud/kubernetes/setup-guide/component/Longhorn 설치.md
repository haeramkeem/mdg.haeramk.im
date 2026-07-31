---
tags:
  - mdg
  - k8s-cloud
  - kubernetes
  - setup-guide
  - component
date: 2026-07-31
aliases:
  - Longhorn
---
## 개요

> [!info] Longhorn 버전
> - `v2` 가 더 좋기는 하겠다만, 아직 experimental 이라는 이야기도 있고 IOMMU 로 격리된 NVMe 가 필요하다는 등등의 이야기가 많아서 `v1` 로 진행한다.

- 사실 간단하게 사용하려면 NFS 로도 충분하고, Proxmox 에서는 ZFS 를 쓸 수 있기 때문에 [Democratic CSI](https://github.com/democratic-csi/democratic-csi) 를 사용할 수도 있다.
- 근데 언제까지 그렇게 살래 이 화상아. Kubernetes 에서 많이 사용되는 렁혼? 한번 써보자 이거야.

## 1. Prerequisites

- Longhorn 이 돌아가는 모든 worker node 에 해주면 된다.

### 1-1. Module 및 Package

> [!info] 참고한 것들
> - [Longhorn - Install NFSv4 Client](https://longhorn.io/docs/1.12.0/deploy/install/#install-nfsv4-client)
> - [Longhorn - Install Open iSCSI](https://longhorn.io/docs/1.12.0/deploy/install/#install-open-iscsi)

- 이거 두개 깔면 된다.

```bash
sudo apt-get update
sudo apt-get install -y open-iscsi nfs-common
```

- Open iSCSI 는 모듈이어서 이놈도 활성화시켜주자.

```bash
sudo modprobe iscsi_tcp
echo iscsi_tcp | sudo tee /etc/modules-load.d/iscsi_tcp.conf
sudo systemctl enable --now iscsid
```

### 1-2. Multipathd 비활성화

> [!info] 참고한 것들
> - [Longhorn - Node Conditions](https://longhorn.io/docs/1.12.0/nodes-and-volumes/nodes/node-conditions/)

- Multipathd 가 비활성화되어있어야 한다고 한다.
- 우선 Multipathd 에 뭔가 있는지 확인
	- 아무것도 안나오면 정상이다.

```bash
sudo multipath -ll
```

- 그리고 비활성화
	- 뭐 `multipathd.sock` 이 살아있다고 warning 이 뜰 수는 있는데 괘안타.

```bash
sudo systemctl disable --now multipathd
sudo systemctl mask multipathd
```

### 1-3. Dedicated Disk

> [!info] 참고한 것들
> - [Longhorn - Use a Dedicated Disk](https://longhorn.io/docs/1.12.0/best-practices/#use-a-dedicated-disk)
> - [Longhorn - Configuring Default Disks Before and After Installation](https://longhorn.io/docs/1.12.0/best-practices/#configuring-default-disks-before-and-after-installation)

- Longhorn 에서는 root 에 설치하지 말고 Longhorn 용 디스크를 별도로 사용하라고 한다. 물론 필수는 아니고 추천이다.
- 그래서 한놈을 잡아왔다고 해보자. 우선 이놈 이름을 확인한다.

```bash
lsblk
```

- 그리고 이놈을 `ext4` 로 포맷해준다.
	- Longhorn v1 은 `ext4` 아니면 `xfs` 를 지원한다고 한다.
	- 그리고 여기서 중요한건 저 `-L longhorn` 이다. `lsblk` 으로 확인한 디스크 이름은 재부팅할 때 바뀔수도 있기 때문에, 저렇게 label 을 붙여주면 디스크 이름이 바뀌어도 문제가 없다.

```bash
sudo mkfs.ext4 -L longhorn /dev/sdb
```

- Longhorn 은 기본적으로 `/var/lib/longhorn` 경로를 사용한다. 물론 설정으로 바꿀 수도 있는데 굳이?
- 그래서 이 경로에 디렉토리를 만들어준다.

```bash
sudo mkdir -p /var/lib/longhorn
```

- 그리고 위에서 만든 `ext4` 를 이 경로에 마운트해준다.

```bash
echo 'LABEL=longhorn  /var/lib/longhorn  ext4  defaults,nofail  0  2' \
| sudo tee -a /etc/fstab
sudo systemctl daemon-reload
sudo mount -a
```

### 1-4. 확인

1. Package 설치 확인

```bash
dpkg -l nfs-common open-iscsi
```

2. Open iSCSI module/service 확인

```bash
systemctl is-active iscsid
lsmod | grep iscsi_tcp
```

3. Multipathd 비활성화 확인

```bash
systemctl is-active multipathd
```

4. 디스크 확인

```bash
findmnt -n /var/lib/longhorn
```

## 2. Helm 으로 배포

### 2-1. Helm values

- Namespace 부터 만들어주자. `longhorn-system` 이 default 이다.
	- 물론 바꿔도 되긴 하는데 약간 이게 convention 이어서 이걸로 하는게 맘편할듯.

```bash
kubectl create namespace longhorn-system
```

- Helm value 는 이래해주면 된다.
	- `persistence`
		- `defaultClass`: 이미 다른 default CSI provider 가 있으면 `false` 로 해주면 된다. 잘 모르겠으면 `true` 로 하면 된다. 다른 CSI provider 를 설치했다면 모를리가 없기 때문.
		- `defaultFsType`: 위에서 FS 를 `ext4` 로 했으니까 여기에 `ext4` 라고 적으면 된다.
		- `defaultClassReplicaCount`: 이 replica 는 [[Deployment (Kubernetes)|Deployment]] 의 replica 가 아니라 storage 복제를 말하는거다. 특별한 이유가 없다면 `2` 로 하는게 적당하다.
	- `defaultSettings`
		- `defaultDataPath`: 위에서 사용한 `/var/lib/longhorn` 쓰면 된다.
		- `upgradeChecker`: `true` 라면 주기적으로 버전체크를 해서 새 버전이 있으면 UI 에 띄워준다. 뭐 필요하면 enable 하면 된다.
		- `v1DataEngine`: `v1` 사용할건지. 할거다.
		- `v2DataEngine`: `v2` 사용할건지. 안할거다.
	- UI 설정: [[Ingress (Kubernetes)|Ingress]] 대신 [[HTTPRoute (gateway.networking.k8s.io)|HTTPRoute]] 사용할거다.
		- 그래서 `ingress.enabled: false`, `httproute.enable: true`.
		- 그리고 그 아래는 HTTPRoute 의 정보들을 넣어주면 된다.

```yaml
persistence:
  defaultClass: true
  defaultFsType: ext4
  defaultClassReplicaCount: 2
  
defaultSettings:
  defaultDataPath: /var/lib/longhorn
  upgradeChecker: false
  v1DataEngine: true
  v2DataEngine: false

ingress:
  enabled: false

httproute:
  enabled: true
  parentRefs:
    - name: {{Gateway 이름}}
      namespace: {{Gateway 가 있는 namespace 이름}}
      sectionName: {{Gateway listener 이름}}
  hostnames:
    - {{UI 도메인}}
  path: /
  pathType: PathPrefix
```

### 2-2 Helm install

- Repo 추가

```bash
helm repo add longhorn https://charts.longhorn.io
helm repo update longhorn
```

- 배포

```bash
helm upgrade --install longhorn longhorn/longhorn -n longhorn-system -f values.yaml
```

## 마무리

- Pod 들이 다 정상이고, UI 에 접속해 봤을 때 이렇게 뜨면 된다:

![[Pasted image 20260731152619.png]]