---
tags:
  - Storage
  - 삽질록
  - NVMe
  - FDP
date: 2024-04-24
---
> [!info]- 참고한 것들
> - [창민형 깃허브 메모](https://github.com/salutepop/Notes/blob/master/PM9D3/enable_fdp.md)

> [!tip] [[NVMeVirt - PoC 시작|이전 글]]

## [[Flexible Data Placement, FDP (Storage)|FDP]] support check

```bash
sudo nvme id-ctrl /dev/nvme* -H | grep ctratt -A 17
```

> [!example]- QEMU FDP 결과 - `0x1`
> ![[Pasted image 20240424172116.png]]

> [!example]- NVMeVirt SSD 결과 - `0x0`
> ![[Pasted image 20240424172253.png]]

## FDP feature check

![[Pasted image 20240424173550.png]]
> NVMe TP4146

- 활성화 시도

```bash
sudo nvme set-feature /dev/nvme* -f 0x1d -c 1 -s
```

> [!example]- QEMU FDP 결과 - 에러
> ![[Pasted image 20240424173721.png]]

> [!example]- NVMeVirt SSD 결과 - 성공?
> ![[Pasted image 20240424173815.png]]

- 설정값 체크

```bash
sudo nvme get-feature /dev/nvme* -f 0x1d -H
```

> [!example]- QEMU FDP 결과 - 에러
> ![[Pasted image 20240424173906.png]]

> [!example]- NVMeVirt SSD 결과 - `Enable: No`
> ![[Pasted image 20240424174022.png]]

## FDP status check

- [[Flexible Data Placement, FDP (Storage)#Endurance Group|FDP Endurance Group (EG)]] config

```bash
sudo nvme fdp configs /dev/nvme* -e 1
```

> [!example]- QEMU FDP 결과 - 정상
> ![[Pasted image 20240424174453.png]]

> [!example]- NVMeVirt SSD 결과 - 비정상
> ![[Pasted image 20240424174529.png]]

- FDP stats

```bash
sudo nvme fdp stats /dev/nvme* -e 1
```

> [!example]- QEMU FDP 결과 - 정상
> ![[Pasted image 20240424174928.png]]

> [!example]- NVMeVirt SSD 결과 - 정상?
> ![[Pasted image 20240424175010.png]]

- FDP status

```bash
sudo nvme fdp status /dev/nvme*n*
```

> [!example]- QEMU FDP 결과 - 정상
> ![[Pasted image 20240424181101.png]]

> [!example]- NVMeVirt SSD 결과 - 결과없음
> ![[Pasted image 20240424181228.png]]