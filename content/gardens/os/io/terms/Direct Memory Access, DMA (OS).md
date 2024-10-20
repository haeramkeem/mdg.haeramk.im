---
tags:
  - os
  - os-io
date: 2024-10-20
aliases:
  - DMA
  - Direct Memory Access
  - DMA cache coherence
---
## (CPU 간섭 없이) 바로 memory 접근

![[Pasted image 20241020225824.png]]

- [[Direct Memory Access, DMA (OS)|DMA]] 는 Memory access 해주는 HW 이다.
- 뭐 IO 이후에 메모리에 올리는 것을 cpu 가 하는게 아니고 dma 가 하며 이것이 끝난 다음에 interrupt 거는 시스템
- 대충 작동 과정은 다음과 같다:
	1. 일단 CPU 가 memory 의 한 곳에 DMA command 를 적는다.
		- 여기에는 뭐 memory 의 어느 주소부터 몇 byte 를 적어라 그런게 담긴다.
	2. 그리고 DMA 에다가 적은 DMA command 의 memory 주소를 보낸다.
	3. 그럼 DMA controller 가 여기로 가 command 를 읽고, 처리한다.
	4. 처리가 완료되면 DMA controller 는 CPU 에 다 됐다고 interrupt 를 건다.

### DMA cache coherence

- 위에서 알 수 있다 시피, memory 에 적힌 내용은 DMA 가 볼 수 있다. 근데 문제는 CPU 는 memory 에 바로 적지 않을 수도 있다는 것.
- 즉, processor 가 cache 로 가져간 값이랑 dma 가 올린 값이랑 타이밍이 안맞으면 이들이 차이가 생기게 된다. 
	- 가령 cache 로 올린 다음에 memory 에 dma 한 경우
	- 이러한 문제는 memory (DMA) 와 cache 간에 sync 가 맞지 않는 경우이므로 DMA cache coherence 라고 부른다.
- 이걸 해결하는 것은
	- cache flush 를 하거나
	- caching 을 비활성화하던가 (C 에서 `volatile`)