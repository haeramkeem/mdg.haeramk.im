---
tags:
  - terms
  - nvme
date: 2024-05-25
---
> [!info]- 참고한 것들
> - [티스토리](https://kkikyul.tistory.com/28)

## 초인종

- 말 그대로 "초인종" 역할을 하며 여기서는 Host [[Non-Volatile Memory Express, NVMe (NVMe)|NVMe]] driver 가 NVMe device 에게 알림을 보내는 기능을 한다.
	- 명령어를 접수했을 때 driver 는 device 에게 처리해야 하는 새로운 명령어가 있다고 알려주고
	- 명령어 처리가 완료되면 driver 는 device 가 보낸 "처리 완료 메세지" 를 잘 받았다고 알려주는 기능을 한다.
	- 주의할 점은 driver 가 device 에게 초인종을 누르는 거지 반대의 경우는 아니라는 것!
		- 특히 completion queue 의 경우에 device 가 driver 에게 doorbell 로 notify 하는 것이 아니라는 것 헷갈리면 안된다.

## 구체적인 작동 원리

- 일단 driver 와 device 간의 소통을 위한 공간이기 때문에 공유 메모리 공간에 존재한다.
	- 이 공유 메모리 공간의 doorbell 을 driver 는 변경하고 device 는 바라보며 주기적으로 값이 변경되었는지 확인하게 되는 것
	- 좀 더 구체적으로는, 물리적으로는 NVMe device 의 메모리 공간인데, host 에도 [[Memory-mapped IO, MMIO (OS)|memory-mapped IO]] 가 되어 있어서 host 에서도 접근할 수 있게 되어 있다.
- 그리고 이 공간을 이용해 notify 를 하는데,
	- Driver 가 어떤 요청을 보내는 것은 다음과 같이 이루어 진다.
		- Driver 는 요청을 [[Submission, Completion Queue (NVMe)|submission queue]] 에 집어넣고 SQ 의 마지막 원소 index (*Tail Index*) 을 *submission queue doorbell* 에 넣는다.
		- 그럼 device 는 이 doorbell 을 계속 감시하고 있으므로 여기의 값이 변경된 것을 확인하여 요청을 처리한다.
		- 다만 한번에 1씩 증가하리라는 법은 없다; 한번에 여러 request 가 들어오면 device 가 확인했을 때 2 이상의 값이 증가하였을 수도 있고, device 입장에서는 이전에 확인한 값과 지금 확인한 값 간의 차이가 곧 아직 처리하지 않은 request 의 개수가 되는 것.
	- 그리고 device 가 request 를 마무리한 뒤에는
		- Device 는 완료 상태를 [[Submission, Completion Queue (NVMe)|completion queue]] 에 넣고 host 에게 interrupt 를 보낸다.
		- 그럼 driver 가 completion queue 의 entry 를 가져간 다음에 *completion queue doorbell* 에 CQ 의 첫번째 원소 index (*Head Index*) 를 넣게 된다.