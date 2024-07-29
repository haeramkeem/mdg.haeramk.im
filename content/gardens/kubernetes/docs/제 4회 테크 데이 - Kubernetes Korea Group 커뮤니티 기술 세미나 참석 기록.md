---
tags:
  - Kubernetes
  - Conference
date: 2024-01-04
---
> [!warning] 세미나에 참석하며 적은 내용들이라 다소 글이 어수선합니다.

> [!info] [DevOcean 행사 소개](https://devocean.sk.com/events/view.do?id=160)

## 개요...

![[Pasted image 20240104141400.png]]

- 2023년 4월 6일에 을지로 SKT 타워 4층 SUPEX 홀에서 열린 "제4회 테크 데이 - Kubernetes Korea Group 커뮤니티 기술 세미나" 에 참석한 뒤 내용을 정리해 보았다.

## Session 1) Everything in Kubernetes - 모든 것을 쿠버네티스 위에 올릴 수 있다

- 참고) CNCF 가 후원하는 Kubernets Community Days Korea 가 7월에 한다고 한다.
	- 일시: 2023-07-03 ~ 04
	- 코엑스 그랜드볼룸

### IaC

- Cloud resource: 이것도 terraform 을 안쓰고 operator 로 가능하더라.
- OSS: [Crossplane - The cloud-native control plane framework](https://www.crossplane.io/)
- reconcile 을 통해 self healing 도 된다 (지우면 재생성)

### Multi tenency K8s

- Cluster API: cluster in cluster 가 가능하다.
- OSS: [vcluster - Virtual Kubernetes Clusters](https://www.vcluster.com/)
	- Linux Capability 와 Privilege 가 가장 관건이 될듯.
	- Case study: [Adobe - Kubecon 2022 Detroit: How Adobe Planned For Scale With Argo CD, Cluster API, And VCluster - Joseph Sandoval & Dan Garfield](https://youtu.be/p8BluR5WT5w)
- Tinkerbell: Nutanix, OpenStack 이랑 비슷한 것 같은데.. 잘 모르겠다. ([Tinkerbell.org](https://tinkerbell.org/))

### Virtual Machine

- K8s 위에 VM 띄우기
- OSS: [KubeVirt](https://kubevirt.io/)
	- Case study: [NVIDIA: KubeVirt Deep Dive: Virtualized GPU Workloads on KubeVirt - David Vossel & Vishesh Tanksale](https://youtu.be/Qejlyny0G58)
- VM 은 아니지만 이런것도 있음: [ContainerSSH: Launch containers on demand](https://containerssh.io/)

### Serverless

- OSS: [Knative](https://knative.dev/docs/)
	- Case study: [KubeCon Europe 2022: Overview and State of Knative - Mauricio Salatino, VMware & Carlos Santana, IBM](https://www.youtube.com/watch?v=e5CbFDq-Jos)

### CICD

- CI OSS: [Tekton](https://tekton.dev/)
- CD OSS: [Argo CD](https://argoproj.github.io/cd/)

### Workflow

- Argo workflow, Kubeflow: airflow 비슷

### DBaaS

- DB 를 쿠버네티스 위에 올려서 사용하는 사례가 점점 더 많아지고 있다.
	- 하지만 장애발생시 K8s 가 원인인지 아닌지 확인할 수 있게 쿠버네티스 전문가가 필요하다.
- MySQL operator OSS: [Vitess](https://vitess.io/)
	- Case Study: Slack, Youtube, GitHub

### Kyverno vs OPA

- Kyverno 보다는 OPA (Gatekeeper) 가 요즘 더 뜬다고 한다.

### ISP 가 제공하는 5G 통신망을 OSS 로 구축하는놈이 있다?

- Open5GS
- UERANSIM
- 5G on Kubernetes
- Private 5G, 5GaaS

## Sess 2 - 개발부터 배포까지 전반의 과정

- 이미지는 RO 레이어지만, 컨테니어가 실행되면 그때 RW 되는 레이어가 하나 추가된다더라
- pause 컨테이너: 컨테이너 하나가 무조건 떠야지 linux namespace 가 생성되기 때문에 Pod 가 생성될 때 무조건 생성되는 컨테이너.

## Sess 3 - 클러스터 API

- 참고) Kubeadm 같은 설치툴을 Bootstrap provider 라고 한다	
- OSS: [Cluster API](https://cluster-api.sigs.k8s.io/)
	- 메인 클러스터에 operator 를 설치하여 다른 클러스터를 provisioning 하는 프로젝트
	- v1.4.1 이 최신버전 (세미나 시점에서는...)
	- eksctl, 혹은 terraform 으로 iac 가 가능하지만 operator 의 reconcile 이 cluster-api 가 갖는 차별점
- Metal 3 → bare metal cluster api 프로바이더? ([Metal³ - Metal Kubed](https://metal3.io/))