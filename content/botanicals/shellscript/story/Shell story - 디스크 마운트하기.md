---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://superuser.com/a/445656)

## 개요

- 제곧내 - 디스크를 마운트 해보자

## 어떻게?

### 1. 일단 [[fdisk - 디스크 확인하기|fdisk]] 로 디스크가 어디에 인식되었는지 확인한다.

```bash
sudo fdisk -l
```

- 그럼 다음처럼 디스크가 인식되었는지, 어느 경로에 있는지 확인이 가능하다:

```
Disk /dev/sdb: 3.49 TiB, 3840755982336 bytes, 7501476528 sectors
Disk model: INTEL SSDXXXXXX
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
```

### 2. 그다음 마운트...

```bash
sudo mount /dev/sdb /path/to/mount
```

- 물론 `/dev/sdb` 는 예시이고, [[Shell story - 디스크 마운트하기#1. 일단 fdisk - 디스크 확인하기 fdisk 로 디스크가 어디에 인식되었는지 확인한다.|위]] 에서 확인한 경로를 사용하면 된다.

#### 2.1. 마운트시 에러난다면?

- 마운트 했을 때 아래와 같은 에러가 날 수도 있다:

```
mount: /path/to/mount: wrong fs type, bad option, bad superblock on /dev/sdb, missing codepage or helper program, or other error.
```

- 그럼 디스크의 파일시스템이 없거나 잘못되었다는 얘기이다. 리눅스에서는 ext4 을 사용하므로 다음의 명령어로 파일시스템을 생성해준다:

```bash
sudo mkfs.ext4 /dev/sdb
```

### 3. 잘 됐나?

- [[df - 마운트 현황 출력하기]] 를 통해 잘 마운트 됐나 확인한다.

```bash
df -hT /dev/sdb
```

- 다음처럼 나오면 성공:

```
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/sdb       ext4  3.5T   20G  3.3T   1% /path/to/mount
```