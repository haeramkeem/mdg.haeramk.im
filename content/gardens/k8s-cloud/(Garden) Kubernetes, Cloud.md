---
date: 2024-07-29
---
> [!warning] 저도 압니다. 커리어에 비해 여기에 작물이 별로 없다는 것. 지금 열심히 마이그레이션 하는 중이니깐은 좀만 기달려 주시요.

## 개요

- [쿠버네티스](https://kubernetes.io/) 정보 저장고
- 2022년 3월부터 쿠버네티스를 재배해온 농사꾼으로써,
	- 쿠버네티스 / 컨테이너 (도커) 관련 개념들
	- 사내 온프레미스 GPU 클러스터를 운영하며 겪었던 것들
	- 폐쇄망 환경에서의 온프레미스 GPU 클러스터를 운영하며 겪었던 것들
	- 쿠버네티스 /  Cloud native 생태계의 다양한 OSS 들
	- 이외 다양한 것들
- 이 저장되어 있습니다.

## 작물들

### Kubernetes

- 오리지널 시리즈
	- [[쿠버네티스 딥다이브 (Learning Spoons, H1 2023)]]
	- [[쿠버네티스 교육자료 (SI Analytics, Jan. 2023)]]
	- [[제 4회 테크 데이 - Kubernetes Korea Group 커뮤니티 기술 세미나 참석 기록]]
- 용어집
	- [[Finalizer (Kubernetes)|Finalizer]]
- 스토리
	- [[Kubeconfig 파일로 Kube apiserver 에 직접 cURL 찔러보기]]
	- [[Kubernetes Control Plane TLS explained - 컨트롤 플레인 인증서 톺아보기|컨트롤 플레인 인증서 톺아보기]]
	- [[Security model in etcd - etcd 에서 사용되는 인증서들|etcd 에서 사용되는 인증서들]]
- 설정 가이드
	- [[Basic Kubernetes installation guide - 기본 설치 가이드|기본 설치 가이드]]
	- [[How to make 200y Kubeadm-generated certificates - 인증서가 만료되지 않는 불멸의 이순신 클러스터 구축기|인증서가 만료되지 않는 불멸의 이순신 클러스터 구축기]]
	- [[PodNodeSelector admission controller - NS 당 node selector 강제하기|NS 당 node selector 강제하기]]
	- 컴포넌트
		- [[CNI 설치 (Cilium)|Cilium]]
		- [[Dashboard 설치 (kubernetes-dashboard)|kubernetes-dashboard]]
		- [[Ingress Controller 설치 (ingress-nginx)|ingress-nginx]]
		- [[NFS PV Provisioner 설치 (nfs-subdir-external-provisioner)|nfs-subdir-external-provisioner]]
		- [[WireGuard 설치 (wg-easy)|WireGuard]]
- 병든놈 고치기
	- [[Ingress NGINX - "upstream sent too large http2 frame 4740180" 에러 해결기]]
	- [[RabbitMQ on Kubernetes - Troubleshooting error "Command df timed out"|RabbitMQ on Kubernetes - "Command timed out: 'df -kP ...'" 에러 해결기]]

### Proxmox VE

> [!info] 넋두리
> - 종종 구글링하다 보면 대학원생이 쓴 것 같은 설정기들이 종종 보이는데
> - 옛날에는 사람들이 이런걸 왜 적나 했다: 현업 엔지니어도 아닌 사람이 끄적여 놓은 글 볼바에는 공식 문서나 적어도 회사 테크블로그를 (개인적으로는 더 신뢰하기 때문에) 보기 때문.
> - 하지만 막상 주인장도 대학원생이 되니 이런 글 적고 있다. 그냥 [[FDP on NVMeVirt (SNU CSE AOS24s Project)]] 를 위해서, 그리고 연구실 내 놀고 있는 데스크탑을 활용하기 위해서 수행했던 Proxmox 작업을 기록한 것이니 usecase 정도로만 생각하고 신뢰하지는 말자.

> [!info] 오해 방지
> - 추가적으로, 주인장은 더이상 클라우드 + 인프라 엔지니어가 아니기에, 설정과정중에 발생하는 에러는 깊게 파고들지 않고 그냥 포기했다.
> - 왜냐면 이 설정에 투자하는 시간이 너무 아깝기 때문.

- 스토리
	- [[HCI Comparison - PVE, Harvester, oVirt...]]
- 설정 가이드
	- [[PVE - CA 신뢰하기|CA 신뢰하기]]
	- [[PVE - Multi-node SDN 설정하기|Multi-node SDN 설정하기]]
	- [[PVE - NAT + Clustering 삽질|NAT + Clustering 삽질]]
	- [[PVE - NVMe Emulation (ZNS, FDP)|NVMe Emulation (ZNS, FDP)]]
	- [[PVE - NVMe Emulation for VM|NVMe Emulation for VM]]
	- [[PVE - Simple SDN 설정하기|Simple SDN 설정하기]]
	- [[PVE - VM 생성|VM 생성]]
	- [[PVE - WireGuard 설정하기|WireGuard 설정하기]]
	- [[PVE - 추가적인 디스크 마운트하기|추가적인 디스크 마운트하기]]