---
tags:
  - proxmox
date: 2026-03-18
---
> [!info]- 참고한 것들
> - [PVE 위키 - Win10 설치 가이드](https://pve.proxmox.com/wiki/Windows_10_guest_best_practices)
> - [PVE 위키 - VirtIO 가이드](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers)

## 주의할 점

- 아마 이 글을 보는 사람들 중에 English 버전(`Win10_22H2_English`)을 사용하는 사람은 없겠지만, 지금 해당 버전은 에러가 난다.
	- VirtIO 드라이버 설정에서 `No New devices drivers were found. Make sure the installation media contains the correct drivers, and click OK` 에러가 발생한다.
	- [참고](https://forum.proxmox.com/threads/windows-10-doesnt-accept-virtio-scsi-driver.152850/)
- 우린 한국인이니까 세종대왕 버전 (`Win10_22H2_Korean`) 쓰자.

## TL;DR

- [PVE 위키 - Win10 설치 가이드](https://pve.proxmox.com/wiki/Windows_10_guest_best_practices) 에 설명이 잘 되어 있어서, 이걸 따라가면 된다.
	- 만약 Win11 을 설치한다면, [PVE 위키 - Win11 설치 가이드](https://pve.proxmox.com/wiki/Windows_11_guest_best_practices) 를 보면 된다.

### VM 생성

1. OS 설정: iso 설정하고, `Type` 과 `Version` 을 설정한다.

![[Pasted image 20260318100541.png]]

2. System 설정: `SCSI Controller` 랑 `Qemu Agent` 를 아래와 같이 설정해 주자.

![[Pasted image 20260318100617.png]]

3. Disks 설정: `Bus/Device` 를 `SCSI` 로 해주고, 디스크 사이즈도 설정해주자.
	- `Cache`, `Discard` 설정은 해줘도 되고 안해도 된다; 해주면 속도가 좀 더 빨라지고 디스크 사용량이 줄어든댄다.

![[Pasted image 20260318100729.png]]

4. CPU/Memory 설정: 여기는 뭐 원하는 자원 할당해주면 된다.
	- 최소사양은 [이걸](https://support.microsoft.com/en-us/windows/windows-10-system-requirements-6d4e9a79-66bf-7950-467c-795cf0386715) 참고하면 된다.

![[Pasted image 20260318100753.png]]

![[Pasted image 20260318100816.png]]

5. Network 설정: `Model` 이 `VirtIO (paravirtualized)` 가 되게 하자.

![[Pasted image 20260318100842.png]]

6. 이렇게 하면 VM 생성은 끝이 난다.

### VM 생성 후 VirtIO drive 추가

1. 이후, VM 의 hardware 탭에 들어가서 virtio drive 를 추가해야 된다.
	- 우선 [여기](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/) 에서 최신 버전의 virtio iso 를 다운로드 한 다음
	- Hardware 에서 `Add` > `CD/DVD Drive` 를 선택해서 아래 그림처럼 추가해 준다.
	- 주의할 점은 `ide0` 이어야 된다고 한다.

![[Pasted image 20260318100930.png]]

2. 이제 VM 을 켜서 Win10 을 설치하자.

### Win10 설치

1. Win10 을 설치하다 보면 `사용자 지정` 을 선택할 수 있는 tab 이 있는데, 거기로 들어가면 이렇게 뜬다.
2. 여기서 `드라이버 로드` 를 선택하자.

![[Pasted image 20260318101445.png]]

3. 그럼 이런 문구가 뜨는데, 무시하고 `확인` 선택

![[Pasted image 20260318101512.png]]

4. 그럼 이렇게 [[#VM 생성 후 VirtIO drive 추가|이것]] 덕분에 VirtIO driver 들이 뜬다. `D:₩amd64₩w10₩vioscsi.inf` 를 선택하자.

![[Pasted image 20260318101545.png]]

5. 조금 기다리면 이렇게 VirtIO drive 에 의해 이렇게 설치 디스크가 잡힌다. 여기에 설치해 주면 된다.

![[Pasted image 20260318101624.png]]

### 설치 후 드라이버 설치

1. Win10 설치를 다 완료하고 나면, 아마 네트워크가 안잡혀있을거다. 네트워크랑 기타 드라이브 들을 다 설치하려면, VirtIO 내의 `virtio-win-gt-x64` 라는 설치마법사를 사용하면 된다.

![[Pasted image 20260318103502.png]]