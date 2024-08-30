---
tags:
  - kubernetes
  - kube-install
date: 2024-08-14
---
> [!info]- 참고한 것들
> - [공식 문서](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#prerequisite-ipv4-forwarding-optional)

## Prerequisites

- [[docker - 설치하기|Docker 설치]]
- `/etc/hosts` 설정
- 선택
	- [[HAProxy - 설치하기|HAProxy]]

## Kube* Binary 설치

- Repo 추가

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
```

- 설치

```bash
sudo apt-get install -y kubeadm kubectl kubelet
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable kubelet
```

## System 설정

### Swap off

- 설정

```bash
sudo swapoff -av
sudo sed -i.bak -r 's|(.+\s+swap\s+.+)|#\1|g' /etc/fstab
```

- 확인

```bash
free -ht
```

![[Pasted image 20240830112357.png]]

### Module 설정

- 설정

```bash
sudo modprobe overlay br_netfilter
cat << EOF | sudo tee /etc/modules-load.d/kubernetes.conf
overlay
br_netfilter
EOF
```

- 확인

```bash
sudo lsmod | grep -iE 'overlay|br_netfilter'
```

![[Pasted image 20240830112626.png]]

### `iptables` 설정

- 설정

```bash
cat << EOF | sudo tee /etc/sysctl.d/k8s.conf​
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

- 확인

```bash
sudo sysctl net.ipv4.ip_forward net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables
```

![[Pasted image 20240830112851.png]]

### Containerd 설정

- 설정

```bash
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i.bak 's|SystemdCgroup = false|SystemdCgroup = true|g' /etc/containerd/config.toml
sudo systemctl restart containerd
```

## Cluster 생성 및 합류

- Init configuration:

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: "v1.30.4"
clusterName: "{{ 클러스터 이름 }}"
controlPlaneEndpoint: "{{ 클러스터 엔드포인트 IP }}:{{ 클러스터 엔드포인트 Port (기본: 6443) }}"
networking:
  podSubnet: "10.240.0.0/16"
  serviceSubnet: "10.96.0.0/12"
  dnsDomain: "{{ 클러스터 이름 }}.local"
apiServer:
  extraArgs:
    enable-admission-plugins: "PodNodeSelector"
    audit-log-path: /etc/kubernetes/audit/audit.log
  extraVolumes:
    - name: "audit"
      hostPath: "/etc/kubernetes/audit"
      mountPath: "/etc/kubernetes/audit"
      readOnly: false
      pathType: DirectoryOrCreate
```

- 생성:

```bash
sudo kubeadm init --v=5 --config=/path/to/config.yaml
```

- 생성 후 다음의 명령어로 `kubectl` 을 위한 kubeconfig 를 설정해준다.

```bash
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

- 클러스터 합류는 "생성" 단계의 결과에서 출력된 것을 참고하자.