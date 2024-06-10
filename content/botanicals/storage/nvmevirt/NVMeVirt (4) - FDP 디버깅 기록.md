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

> [!tip] [[NVMeVIrt (3) - 디버깅 메세지 출력 설정 기록|이전 글]]

## [[Flexible Data Placement, FDP (Storage)|FDP]] 정보 조회

### Controller ID

```bash
sudo nvme id-ctrl /dev/nvme* -H | grep ctratt -A 17
```

> [!example]- QEMU FDP 결과 - `0x1`
> ![[Pasted image 20240424172116.png]]

> [!example]- NVMeVirt SSD 결과 - `0x0`
> ![[Pasted image 20240424172253.png]]

> [!example]- PM9D3 SSD 결과 - `0x1`
> ![[Pasted image 20240425203400.png]]

### FDP feature 확인

![[Pasted image 20240424173550.png]]
> NVMe TP4146

- 활성화 시도

```bash
sudo nvme set-feature /dev/nvme* -f 0x1d -c 1 -s
```

> [!example]- QEMU FDP 결과 - 에러
> ![[Pasted image 20240424173721.png]]

> [!example]- NVMeVirt SSD 결과 - 성공 (?)
> ![[Pasted image 20240424173815.png]]

> [!example]- PM9D3 SSD 결과 - 에러 (?)
> ![[Pasted image 20240425203525.png]]

- 설정값 체크

```bash
sudo nvme get-feature /dev/nvme* -f 0x1d -H
```

> [!example]- QEMU FDP 결과 - 에러
> ![[Pasted image 20240424173906.png]]

> [!example]- NVMeVirt SSD 결과 - `Enable: No` (?)
> ![[Pasted image 20240424174022.png]]

> [!example]- PM9D3 SSD 결과 - `Enable: No` (?)
> ![[Pasted image 20240425203913.png]]

### [[Flexible Data Placement, FDP (Storage)#Endurance Group|FDP Endurance Group (EG)]] config 확인

```bash
sudo nvme fdp configs /dev/nvme* -e 1
```

> [!example]- QEMU FDP 결과 - 정상
> ![[Pasted image 20240425203257.png]]

> [!example]- NVMeVirt SSD 결과 - 비정상
> ![[Pasted image 20240424174529.png]]

> [!example]- PM9D3 SSD 결과 - 정상
> ![[Pasted image 20240425203244.png]]

### 모니터링 정보들

- [[FDP Statistics (NVMe)|FDP stats]]

```bash
sudo nvme fdp stats /dev/nvme* -e 1
```

> [!example]- QEMU FDP 결과 - 정상
> ![[Pasted image 20240424174928.png]]

> [!example]- NVMeVirt SSD 결과 - 정상 (?)
> ![[Pasted image 20240424175010.png]]

> [!example]- PM9D3 SSD 결과 - 에러 (?)
> ![[Pasted image 20240425204523.png]]

- FDP RU status

```bash
sudo nvme fdp status /dev/nvme*n*
```

> [!example]- QEMU FDP 결과 - 정상
> ![[Pasted image 20240424181101.png]]

> [!example]- NVMeVirt SSD 결과 - 결과없음
> ![[Pasted image 20240424181228.png]]

> [!example]- PM9D3 SSD 결과 - 에러 (?)
> ![[Pasted image 20240425204550.png]]

## 입출력

- `DTYPE: 2` 이면 `DSPEC` 필드에 FDP 값이 들어간다는 소리이다.

![[Pasted image 20240425214442.png]]

![[Pasted image 20240425212241.png]]
> DTYPE - TP 4146

- 따라서 `DTYPE: 2` (FDP) 로 설정해주고, `DSPEC: 0` (RUH 0) 와 같은 식으로 RUH 를 명시해주면 된다.
- Write command 예시

```bash
echo 'bhc vs kfc' \
	| sudo nvme write $(fdp) -z 512 -T 2 -S 0
```