---
tags:
  - terms
  - nvme
date: 2024-08-26
aliases:
  - SQ
  - CQ
---
> [!info]- 참고한 것들
> - [티스토리](https://kkikyul.tistory.com/28)
> - [NVMe Base Spec 1.4](https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4-2019.06.10-Ratified.pdf)

## NVMe working queue

- [[Non-Volatile Memory Express, NVMe (NVMe)|NVMe]] driver 와 device 간의 통신에 있어서,
	- Driver 가 device 에게 던지는 명령어는 *Submission Queue* 에 담기고
	- Device 가 driver 에게 처리 완료 (혹은 실패) 했다고 알려주는 메세지는 *Completion Queue* 에 담긴다.
	- 그리고 queue 에 메세지를 담은 이후에는, 각 queue 의 [[Doorbell (NVMe)|doorbell]] 을 바꿔서 queue 에 새로운 메세지가 있다는 것을 상대방에게 알린다.

### Circular queue, head/tail index

![[Pasted image 20240826202539.png]]
> [출처: 티스토리](https://kkikyul.tistory.com/28)

- 일단 생김새는 위와 같다.
	- 구조는 *Circular Queue* 구조로, index out of range 없이 뱅글뱅글 돌도록 되어 있다. (그림 오른쪽)
	- 당연히 물리적으로는 연속된 메모리 공간에 위치한다. (그림 왼쪽)
- 그리고 pointer 가 두개 있는데,
	- *Tail Pointer* 는 submitter 가 다음에 채워 넣을 entry 를 가리키고 있다.
		- 따라서 당연히 비어있다.
	- *Head Pointer* 는 consumer 가 다음에 가져갈 entry 를 가리키고 있다.

![[Pasted image 20240826204248.png]]
> [출처: NVMe base spec 1.4](https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4-2019.06.10-Ratified.pdf)

![[Pasted image 20240826204304.png]]
> [출처: NVMe base spec 1.4](https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4-2019.06.10-Ratified.pdf)

- 이에 따라 *Tail* 과 *Head* 가 일치하면 empty queue 의 상태, *Head* 가 *Tail* 의 바로 이전에 있으면 full queue 의 상태가 된다.

### 종류 (Admin/IO), 위치

![[Pasted image 20240826204517.png]]
> [출처: NVMe blog](https://nvmexpress.org/base-nvm-express-part-one/)

- SQ/CQ 는 core 마다 한개 이상씩 존재하도록 하여 core 간 lock 을 잡지 않아도 되게 한다.
- 또한 Admin queue 가 별도로 있어 [[nvme-cli - 디바이스 조회하기|디바이스 조회]] 와 같은 management command 를 별도로 처리한다.
- 이들은 모두 Host memory 공간에 위치하며, [[Direct Memory Access, DMA (OS)|DMA 매핑]] 이 되어 있어 device 에서도 host CPU 를 거치지 않고 접근할 수 있다.
- Host driver 가 CQ -> SQ 순서로 생성 후 그 정보를 device 에게 알려주는 식으로 초기화되며, 삭제할 때는 반대로 SQ -> CQ 순서로 삭제한다.

### 처리 flow

![[Pasted image 20240826204926.png]]
> [출처: SNIA](https://www.snia.org/sites/default/orig/SDC2012/presentations/Solid_State/PaulLuse_NVM_Express.pdf)

- 어떤 command 를 명령하는 것은 다음과 같은 과정을 거친다.
	1. Host 는 명령어를 SQ 의 tail index 위치에 넣고 tail index 를 증가시킨다.
		- 즉, 여기서 host 가 submitter 이기에 tail index 를 건드는 것.
	2. 그리고 host 가 device 의 completion doorbell 을 증가시킨다.
	3. Device 에서는 그것을 감지하고 command 를 가져온 뒤 head index 를 증가시킨다.
		- 즉, 여기서 device 가 consumer 이기에 head index 를 건드는 것.
- 그리고 device 가 명령어를 처리한 뒤 다음과 같이 그 결과를 알린다.
	4. Device 는 처리 결과를 CQ 의 tail index 위치에 넣고 tail index 를 증가시킨다.
		- Device 가 submitter 이기에 이놈이 tail index 를 건드는 것.
	5. 그리고 device 는 host 에게 interrupt 를 걸어 CQ 의 업데이트를 알린다.
		- Interrupt 를 거는 것 말고도 host 가 CQ 를 계속 감시하는 polling mode 도 가능하다.
	6. Host 는 그 결과를 받아들고 head index 를 증가시킨다.
		- 마찬가지로, 이때에는 host 가 consumer 이기에 host 가 head index 를 건드는 것.
	7. 마지막으로 host 가 head index 가 업데이트되었음을 (즉, 결과를 가지고 갔다고) SQ doorbell 을 업데이트하여 device 에게 알린다.