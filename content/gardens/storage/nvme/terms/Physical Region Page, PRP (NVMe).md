---
tags:
  - storage
  - nvme
  - terms
date: 2024-08-26
---
> [!info]- 참고한 것들
> - [티스토리](https://kkikyul.tistory.com/28)
> - [NVMe Base Spec 1.4](https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4-2019.06.10-Ratified.pdf)

## 데이터의 위치

- [[nvme-cli - 데이터 기본 입출력하기|NVMe CLI 입출력 실습]] 을 보면 데이터를 표준입력으로 넣고, 표준출력으로 받아보는 것을 알 수 있다.
	- (위 예시에서는 없지만) 혹은 `nvme-cli` 에는 파일을 지정하는 옵션도 있다.
- 근데 device 는 어떻게 데이터의 위치를 알 수 있을까? NVMe command 는 64byte 고정인데, 여기에 데이터를 넣기에는 너무 작지 않나?
- 에 대한 해답이 *Physical Region Page*, *PRP* 이다.
- 일단 이 항목에는 메모리 주소를 넣게 되는데,
	- Write command 의 경우에는 write 할 데이터의 host 에서의 메모리 주소를 가리키게 되고
	- Read command 의 경우에는 device 가 데이터를 read 해와 host 의 어느 메모리 주소에 적재할 것인지를 명시하는 용도이다.
- NVMe command 에서는 다음의 위치에 명시된다.

| DWORD | BYTE RANGE | ENTRY       |
| ----- | ---------- | ----------- |
| 6~7   | 24~31      | PRP Entry 1 |
| 8~9   | 32~39      | PRP Entry 2 |

![[Pasted image 20240826212055.png]]
> [출처: NVMe base spec 1.4](https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4-2019.06.10-Ratified.pdf)

- 이놈이 가장 기본적인 데이터 위치 명시법이고, 이후에 더 확장성 좋은 [[Scatter-Gather List, SGL (NVMe)|SGL]] 이 나왔다고 한다.