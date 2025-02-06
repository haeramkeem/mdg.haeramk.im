---
tags:
  - proxmox
  - 스토리
---
## 개요

- 전직 클라우드 엔지니어로써, 그리고 설정 섞이는 것을 매우 불쾌해하는 성격때문에 데스크탑에 HCI 를 설치해 사용하기로.
- 근데 이제 어떤 놈을 사용할 것이냐... 에 대한 비교 & 선택의 이유를 여기에 로깅해보자.

## 비교분석

- [Harvester](https://harvesterhci.io/): PoC 후 사용하지 않기로 했다. 그 이유는:
	- 다소 무거워 보임. (Minimum CPU: `8C`, Minimum MEM: `32G`, Minimum Storage: `250G` - [출처](https://docs.harvesterhci.io/v1.3/install/requirements/))
		- 물론 이 사양이 안된다고 해서 설치가 안되진 않는다. 설치시에 경고문구 출력하고 설치가 되긴 한다.
	- VIP 를 할당해줄 수 있는 환경이 아님.
		- 물론 iptime 같은데에서 switch 를 하나 사서 private ip 대역 구성해주면 VIP 맘대로 할당할 수 있지만, 사기 귀찮아서 안했다.
		- 그래서 loopback (`127.0.0.1`) 로 VIP 주고 설치하니 되긴 한다.
	- Harvester 를 고려한 제일 큰 이유는 vm 을 cloud image (qcow2 등) 로 띄우기 위함이었는데, 생각해보니 cloud init 설정을 해줘야 로그인이 된다.
		- 물론 해줄 순 있지만 그정도까지 공수를 들이긴 싫었다.
	- OS 가 익숙하지 않다.
		- Harvester 는 SUSE linux 를 사용하는데 사용해본적이 없다.
		- PCI passthrough 등등 사용하려면 OS 와도 친숙하면 좋을텐데 RHEL 이면 몰라도 SUSE 와는 친분이 없다.
- [oVirt](https://www.ovirt.org/): 설치해보지는 않음 (PoC 시간 부족)
- [Proxmox](https://www.proxmox.com/en/): 이것으로 하기로 결정. 그 이유는:
	- 이미 Proxmox 에 시간 투자를 꽤 한 상황이었고
	- Harvester 보다는 가벼워 보였고
	- 버전이 8.x 여서 충분히 안정적이었기 때문.
- Kubernetes + KubeVirt
	- 쿠버네티스를 2년간 사용해온 입장으로서 이거 진짜 고민 많이 했다.
	- 그럼에도 불구하고 사용하지 않은 이유는:
		1. 너무 귀찮다.
			- Kubernetes + CNI + CSI + KubeVirt 등등 다 설정하면 인생끝날것 같았다.
		2. VM Web UI 가 애매하다.
			- [Kubevirt Manager](https://kubevirt-manager.io/) 나
			- [Openshift console](https://github.com/openshift/console#native-kubernetes) 등의 선택지가 있지만
			- 별로 안끌릴 뿐더러 이거 또 배포하려면 한세월이다.