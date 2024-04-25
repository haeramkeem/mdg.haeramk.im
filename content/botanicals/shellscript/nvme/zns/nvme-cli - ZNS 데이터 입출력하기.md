---
tags:
  - 쉘스크립트
  - NVMe
  - ZNS
  - nvme-cli
date: 2024-04-23
---
> [!info]- 참고한 것들
> - [Zoned Storage](https://zonedstorage.io/docs/tools/zns)

> [!tip] 여기는 명령어만 정리되어 있습니다. 실 사용 예시는 [[NVMe - ZNS 를 위한 CLI 명령어 사용해보기|ZNS 를 위한 CLI 명령어 사용해보기]] 문서를 참고해 주세용

## Write: [[Zoned Storage Model (Storage)#Zone Append|Zone Append]]

```bash
echo 'goodbye mate' | sudo nvme zns zone-append /dev/nvme1n1 -z 512 -s 0x40000
```

- 옵션 정리
	- `-z`, `--data-size`: 입력하고자 하는 데이터의 사이즈 (실 데이터와는 무관; padding 이 들어간 chunk 사이즈라 생각하믄 된다.)
	- `-s`, `--zslba`: 입력 시작 주소. Sequential write 이기 때문에 무조건 특정 zone 의 wp 주소여야 한다.

## Read: Random Read

```bash
sudo nvme read /dev/nvme1n1 -s 0x40000 -z 512
```

- 옵션 정리
	- `-z`, `--data-size`: 읽어들이는 데이터의 길이.
	- `-s`, `--start-block`: 읽어들이는 시작 주소. zone 의 SLBA 를 이용해서 잘 계산하면 된다.