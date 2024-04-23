---
tags:
  - Storage
  - NVMe
date: 2024-04-23
---
> [!info]- 참고한 것들
> - [Zoned Storage](https://zonedstorage.io/docs/tools/zns)

## 기본적인 상태 확인

### [[Zoned Namespaces, ZNS (Storage)|ZNS]] 지원 기기 목록 출력

```bash
sudo nvme zns list
```

![[Pasted image 20240423191359.png]]

### Controller 정보 출력

- 주의할점
	- ZNS SSD 가 아니어도 오류가 출력되지는 않는다.
	- `-H` 옵션은 없다.
	- ZASL: Zone Append Size Limit

```bash
sudo nvme zns id-ctrl /dev/nvme1
```

![[Pasted image 20240423191432.png]]

### [[NVMe Namespace (Storage)|Namespace]] 정보 출력

```bash
sudo nvme zns id-ns /dev/nvme1n1 -H
```

![[Pasted image 20240423191530.png]]

### [[Zoned Storage Model (Storage)#State Machine|Zone 상태]] 확인

```bash
sudo nvme zns report-zones /dev/nvme1n1 -d 10 -v
```

- `-d`: line 수
- `-v`: verbose - 이 옵션 없이는 raw hex number (NVMe spec 의) 로 출력된다.

![[Pasted image 20240423191608.png]]

- 약어 정리
	- SLBA: Start [[Logical Block Addressing, LBA (Storage)|LBA]]
	- WP: [[Zoned Storage Model (Storage)#Write pointer|Write Pointer]]
	- Cap: [[Zoned Storage Model (Storage)#Zone Size, Zone Capacity|Zone Capacity]]

## [[Zoned Storage Model (Storage)#State Machine|Zone 상태]] 변경

### Open zone

- Zone open 하기

```bash
sudo nvme zns open-zone /dev/nvme1n1
```

- 상태 확인

```bash
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

![[Pasted image 20240423191841.png]]

- Explicit Open (`EXP_OPENED`) 상태인 것을 확인할 수 있다.

### Close zone

- Zone close 하기

```bash
sudo nvme zns close-zone /dev/nvme1n1
```

- 상태 확인

```bash
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

![[Pasted image 20240423192027.png]]

- `CLOSE` 상태로 바뀐 것을 알 수 있다.

### Finish zone

- Zone finish 하기

```bash
sudo nvme zns finish-zone /dev/nvme1n1
```

- 상태 확인

```bash
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

![[Pasted image 20240423192216.png]]

- Zone 이 `FULL` 상태로 바뀌고 `WP` 가 끝까지 밀려있는 것을 확인할 수 있다.

### Reset zone

- Zone reset 하기
	- `-s`, `--start-lba` 로 reset 할 zone 의 SLBA 를 지정해 주거나
	- `-a`, `--select-all` 로 모든 zone 을 reset 할 수 있다.

```bash
sudo nvme zns reset-zone /dev/nvme1n1 -s 0x0
```

- 상태 확인

```bash
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

![[Pasted image 20240423192555.png]]

- 다시 `EMPTY` 상태로 돌아온 것을 볼 수 있다.

## 입출력

### Write: [[Zoned Storage Model (Storage)#Zone Append|Zone Append]]

- Zone 을 지정하지 않고 write 해보자.
	- `-z`, `--data-size` 를 1 block (512byte) 로 주는 예시

```bash
echo 'hello world' | sudo nvme zns zone-append /dev/nvme1n1 -z 512
```

- 이때 Zone 이 어떻게 바뀌었나 확인:

```bash
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

![[Pasted image 20240423193214.png]]

- Zone 의 상태가 Implicit open (`IMP_OPENED`) 로 바뀌었고
- Write pointer (`WP`) 는 `0x1` 로 증가한 것을 확인할 수 있다.
- 한번 더 append 해보자.

```bash
echo 'gday mate' | sudo nvme zns zone-append /dev/nvme1n1 -z 512
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

![[Pasted image 20240423193510.png]]

- 역시나 write pointer (`WP`) 는 `0x2` 로 증가한 것을 확인할 수 있다.
- 다른 zone 에 append 하는 것은 아래처럼 하면 된다.
	- `-s`, `--zslba`: 원하는 zone 의 SLBA 를 지정

```bash
echo 'goodbye mate' | sudo nvme zns zone-append /dev/nvme1n1 -z 512 -s 0x40000
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

![[Pasted image 20240423194021.png]]

- 결과를 보면 `SLBA: 0` 과 `SLBA: 0x40000` 이 모두 Implicit open (`IMP_OPENED`) 로 바뀐 것을 알 수 있고
- `SLBA: 0x40000` 의 Write pointer (`WP`) 이 `0x40001` 으로 옮겨간 것을 확인할 수 있다.

### Read

- 읽는 것은 일반 `nvme read` Random read 명령어를 사용하면 되는데, 이때 Zone 별로 write 가 되어 있기 때문에 계산을 좀 해야 한다.
- 우선 처음에 넣었던 `"hello world"` 는 첫 LBA 에 있으니 그냥 읽어오면 될 것 같다 그쵸?
	- `-z`, `--data-size`: Read 할 data 의 양

```bash
sudo nvme read /dev/nvme1n1 -z 512
```

![[Pasted image 20240423194713.png]]

- 그 다음에 넣은 `"gday mate"` 는 그 다음 LBA 에 있을 것이고, 이것은 `-s` 옵션으로 지정한다.
	- `-s`, `--start-block`: 읽기 시작할 64bit 주소 - 다음 block 에 있으므로 `1` 을 준다.

```bash
sudo nvme read /dev/nvme1n1 -s 1 -z 512
```

![[Pasted image 20240423195017.png]]

- 그럼 다른 zone 에 있는 data 를 읽으려 할 때는 어떻게 하냐; 해당 zone 의 SLBA 를 이용해서 잘 계산해보면 될 것이야.
	- `SLBA: 0x40000` 인 zone 의 첫 data 이기 때문에 아래처럼 하면 된다.

```bash
sudo nvme read /dev/nvme1n1 -s 0x40000 -z 512
```

![[Pasted image 20240423195215.png]]

- 모든 zone 을 reset 해서 다 날리기

```bash
sudo nvme zns reset-zone /dev/nvme1n1 -a
```