---
tags:
  - shellscript
  - nvme
  - zns
  - nvme-cli
date: 2024-04-23
---
> [!info]- 참고한 것들
> - [Zoned Storage 공식 문서](https://zonedstorage.io/docs/tools/zns)

## [[Zoned Storage Model (Storage)#State Machine|Zone 상태]] 변경하는 법

### Zone Open

```bash
sudo nvme zns open-zone /dev/nvme1n1
```

> [!example]- 결과 확인
>
> ```bash
> sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
> ```
>
> ![[Pasted image 20240423191841.png]]
>
> - Explicit Open (`EXP_OPENED`) 상태인 것을 확인할 수 있다.

### Zone Close

```bash
sudo nvme zns close-zone /dev/nvme1n1
```

> [!example]- 결과 확인
>
> ```bash
> sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
> ```
>
> ![[Pasted image 20240423192027.png]]
>
> - `CLOSE` 상태로 바뀐 것을 알 수 있다.

### Zone Finish

```bash
sudo nvme zns finish-zone /dev/nvme1n1
```

> [!example]- 결과 확인
>
> ```bash
> sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
> ```
>
> ![[Pasted image 20240423192216.png]]
>
> - Zone 이 `FULL` 상태로 바뀌고 `WP` 가 끝까지 밀려있는 것을 확인할 수 있다.

### Zone Reset

```bash
sudo nvme zns reset-zone /dev/nvme1n1 -s 0x0
```

- 옵션 정리
	- `-s`, `--start-lba` 로 reset 할 zone 의 SLBA 를 지정해 주거나
	- `-a`, `--select-all` 로 모든 zone 을 reset 할 수 있다.

> [!example]- 결과 확인
>
> ```bash
> sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
> ```
>
> ![[Pasted image 20240423192555.png]]
>
> - 다시 `EMPTY` 상태로 돌아온 것을 볼 수 있다.