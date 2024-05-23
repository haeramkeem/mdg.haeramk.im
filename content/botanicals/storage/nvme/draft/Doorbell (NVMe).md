---
tags:
  - 용어집
  - NVMe
---
> [!fail]- 이 문서는 #draft 상태입니당.
> - [ ] 내용 정리

## 초인종

- 말 그대로 "초인종" 역할을 하며 여기서는 Host [[Non-Volatile Memory Express, NVMe (NVMe)|NVMe]] driver 와 NVMe device 서로에게 알림을 보내는 기능을 한다.
	- Driver 는 device 에게 처리해야 하는 새로운 명령어가 있다고 알려주고
	- Device 는 driver 에게 명령어가 처리되었다고 알려주는 것

## 구체적인 작동 원리

- 일단 driver 와 device 간의 소통을 위한 공간이기 때문에 공유 메모리 공간에 존재한다.
	- 이 공유 메모리 공간의 doorbell 을 driver 와 device 가 모두 바라보며 주기적으로 값이 변경되었는지 확인하게 되는 것
- 그리고 값이 변경되게 되면, 이 변경된 값을 이용해 queue 의 특정 지점을 찾아가게 된다.
	- 라고만 말하면 뭔소리여 라고 할텐데
	- Driver 가 어떤 요청을 보내는 것은 다음과 같이 이루어 진다.
		- Driver 는 요청을 [[Submission Queue (NVMe)|submission queue]] 에 집어넣고 여기에 접근할 수 있는 값을 doorbell 에 넣는다.
			- 다만 이 값은 포인터는 아니다. 
		- 그럼 device 는 이 doorbell 을 계속 감시하고 있으므로 여기의 값이 변경된 것을 확인하여 


- 메모리에 생성된 후 driver 가 device 에게 메모리의 어디에 doorbell 이 있는지 알려준다.
- 자료구조는 배열이며 각각은 flag 로써 기능한다
- Host 에서 NVMe command 를 날릴 때 이 배열의 값을 변경해 주면 (flag) NVMe device 에서 이것을 감지하여 해당 배열 index 와 연관된 [[Submission Queue (NVMe)|submission queue]] 로 가서 접수된 명령어를 가져와 처리한다.