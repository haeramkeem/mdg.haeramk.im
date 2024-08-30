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

## TL;DR!

### Write: [[Zoned Storage Model (Storage)#Zone Append|Zone Append]]

```bash
echo 'goodbye mate' | sudo nvme zns zone-append /dev/nvme1n1 -z 512 -s 0x40000
```

- 옵션 정리
	- `-z`, `--data-size`: 입력하고자 하는 데이터의 사이즈 (실 데이터와는 무관; padding 이 들어간 chunk 사이즈라 생각하믄 된다.)
	- `-s`, `--zslba`: 입력 시작 주소. Sequential write 이기 때문에 무조건 특정 zone 의 wp 주소여야 한다.

### Read: Random Read

```bash
sudo nvme read /dev/nvme1n1 -s 0x40000 -z 512
```

- 옵션 정리
	- `-z`, `--data-size`: 읽어들이는 데이터의 길이.
	- `-s`, `--start-block`: 읽어들이는 시작 주소. zone 의 SLBA 를 이용해서 잘 계산하면 된다.

## 실습해보기

### Write

- Zone 을 지정하지 않고 write 해보자.

```bash
echo 'hello world' | sudo nvme zns zone-append /dev/nvme1n1 -z 512
```

- 이때 Zone 이 어떻게 바뀌었나 확인해 보면

> [!example]- 결과 예시
> ```bash
> sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
> ```
>
> ![[Pasted image 20240423193214.png]]

- Zone 의 상태가 Implicit open (`IMP_OPENED`) 로 바뀌었고
- Write pointer (`WP`) 는 `0x1` 로 증가한 것을 확인할 수 있다.
- 한번 더 append 해보자.

```bash
echo 'gday mate' | sudo nvme zns zone-append /dev/nvme1n1 -z 512
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

> [!example]- 결과 예시
> ![[Pasted image 20240423193510.png]]

- 역시나 write pointer (`WP`) 는 `0x2` 로 증가한 것을 확인할 수 있다.
- 다른 zone 에 append 하는 것은 아래처럼 하면 된다.

```bash
echo 'goodbye mate' | sudo nvme zns zone-append /dev/nvme1n1 -z 512 -s 0x40000
sudo nvme zns report-zones /dev/nvme1n1 -d 5 -v
```

> [!example]- 결과 예시
> ![[Pasted image 20240423194021.png]]

- 결과를 보면 `SLBA: 0` 과 `SLBA: 0x40000` 이 모두 Implicit open (`IMP_OPENED`) 로 바뀐 것을 알 수 있고
- `SLBA: 0x40000` 의 Write pointer (`WP`) 이 `0x40001` 으로 옮겨간 것을 확인할 수 있다.

### Read

- 읽는 것은 일반 `nvme read` Random read 명령어를 사용하면 되는데, 이때 Zone 별로 write 가 되어 있기 때문에 계산을 좀 해야 한다.
- 우선 처음에 넣었던 `"hello world"` 는 첫 LBA 에 있으니 그냥 읽어오면 될 것 같다 그쵸?

```bash
sudo nvme read /dev/nvme1n1 -z 512
```

> [!example]- 결과 예시
> ![[Pasted image 20240423194713.png]]

- 그 다음에 넣은 `"gday mate"` 는 그 다음 LBA 에 있을 것이고, 이것은 `-s` 옵션으로 지정한다.

```bash
sudo nvme read /dev/nvme1n1 -s 1 -z 512
```

> [!example]- 결과 예시
> ![[Pasted image 20240423195017.png]]

- 그럼 다른 zone 에 있는 data 를 읽으려 할 때는 어떻게 하냐; 해당 zone 의 SLBA 를 이용해서 잘 계산해보면 될 것이야.
	- `SLBA: 0x40000` 인 zone 의 첫 data 이기 때문에 아래처럼 하면 된다.

```bash
sudo nvme read /dev/nvme1n1 -s 0x40000 -z 512
```

> [!example]- 결과 예시
> ![[Pasted image 20240423195215.png]]

- 이제 모든 zone 을 reset 해서 실습한 것을 다 날려주자.

```bash
sudo nvme zns reset-zone /dev/nvme1n1 -a
```