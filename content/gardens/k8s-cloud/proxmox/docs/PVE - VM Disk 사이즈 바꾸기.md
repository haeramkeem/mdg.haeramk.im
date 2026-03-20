---
tags:
  - proxmox
date: 2026-03-19
---
## TL;DR

- 우선 `hardware` 에서 원하는 disk 를 골라주고, `Disk Action` 안의 `Resize` 에서 바꿔주면 된다:

![[Pasted image 20260319195033.png]]


- 그 뒤에는 VM 안으로 들어가서 설정을 해줘야 한다.
1. 일단 `lsblk` 로 device 확인
	- `/dev/sda{숫자}` 형태인데, 높은확률로 `/dev/sda3` 일 테니까 이 경로를 아래 예시에서 사용하겠음
2. 그리고 물리 볼륨을 확장한다.
	- `growpart` 에서 띄어쓰기 조심하자: `/dev/sda(띄어쓰기)3` 이다.

```sh
sudo growpart /dev/sda 3
```

```sh
sudo pvresize /dev/sda3
```

3. 다음으로 논리 볼륨을 확장해야 하는데, 우선 `df` 로 경로부터 확인한다.
	- 높은 확률로 `/dev/mapper/ubuntu--vg-ubuntu--lv` 일테니까, 이 경로를 아래 예시에서 사용하겠음

```sh
df -h /
```

4. 논리 볼륨을 확장한다.

```sh
sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
```

5. 마지막으로 fs 에도 이것을 적용해준다.
	- 아래는 `ext4` 기준이다. 어떤 바보가 `xfs` 쓰겠어 그치?

```sh
sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```