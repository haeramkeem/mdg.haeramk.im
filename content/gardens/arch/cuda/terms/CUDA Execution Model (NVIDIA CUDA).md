---
tags:
  - arch
  - arch-cuda
date: 2024-11-04
aliases:
  - Thread
  - Warp
  - Warp scheduler
  - Thread block
  - Thread block scheduler
  - Grid
---
> [!info]- 참고한 것들
> - [[14. CUDA|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]
> - [어떤 Velog](https://velog.io/@aram_father/CUDA-Thread-Hierarchy)

## CUDA Execution Model

- CUDA 에서 데이터를 처리하기 위한 model (라고 읽고 terminology, concept 등으로 받아들이면 된다) 을 알아보자.

### Thread

- CUDA 에서 thread 는 "Sequential execution unit" 이라고 할 수 있다.
	- 주의할 점은 thread 는 데이터 단위가 아닌 실행의 단위라는 것이다.
	- Thread 하나가 여러 데이터를 손보는 것도 얼마든지 가능하다는 소리.
- 연산을 해주는 HW 단위가 ALU 인 것을 생각하면, 하나의 thread 는 하나의 ALU 에서 실행된다고 생각할 수 있다.
	- 이 ALU 를 Streaming Processor (SP) 라고 부르기도 한다.

### Warp

- 32 개의 thread 를 *Warp* 라고 부르고, 이것은 "Parallel execution unit" 이라고 할 수 있다.
	- 그래서 thread 가 아닌 warp 가 진정한 의미의 실행 단위라고 생각하는 사람들도 있는 것 같은데,
	- 주인장 의견으로는 warp 나 thread 나 모두 실행 단위가 맞다. "순차" 실행이나 "병렬" 실행이냐의 차이이다.
- 이 32개는 fixed 된 값으로 32 개의 thread 가 동시에 실행되어 동시에 종료된다.
	- 여기서 "동시에 종료된다" 는 것은 synchronize 된다는 것이다. 즉, 먼저 끝난 thread 가 있으면 warp 의 다른 thread 가 종료될 때까지 기다린다.
- 하나의 [[Streaming Multiprocessor, SM (Arch)|SM]] 에서는 이 warp 단위로 실행되고, context switch 된다.

### Thread Block

- 말 그대로 thread 의 묶음이다.
- 라고 하면 이게 warp 랑 뭐가 다르지? 라고 생각할 수 있다. 가장 큰 차이점은 이놈은 "실행의 단위" 가 아니라는 것이다.
	- 구체적으로 말하면, 이 단위로 SM 에 scheduling 되지만, SM 내에서는 이놈을 warp 단위로 실행한다.
	- 즉, SM 에 thread block 이 scheduling 된 다음에는 SM 의 *Warp scheduler* 는 이 thread block 을 warp 단위로 scheduling 하고 실행한다는 의미이다.
- 따라서 thread block 은 warp size 인 32 보다 커도 된다. 사실, 큰게 성능면에서 좋다.
	- 만약에 thread block 이 warp size 보다 작다면 warp 내부에 놀고 있는 thread 가 생기기 때문.
	- 그렇다고 무한정 크게 잡을 수 있는 것은 아니다. HW 적으로 최대 warp 개수가 정해져 있고, 이것을 넘어가게 되면 당연히 에러가 난다.

### Grid

- 이것은 thread block 의 묶음이다.
- 이것이 가장 큰 단위이고, 이 grid 에 속한 thread block 들은 *Thread block scheduler* 에 의해 SM 으로 scheduling 된다.

### Top-down view

- 여기까지의 내용을 top-down 으로 정리해 보자.
- 일단 가장 큰 단위인 grid 는 GPU 에 전달되면 thread block 단위로 쪼개진다.
- 이 thread block 들은 thread block scheduler 에 의해 GPU 의 여러 SM 들에게 RR 로 분배된다.
- SM 이 thread block 을 받게 되면, 이것은 warp 단위로 쪼개진다.
- Warp 는 warp scheduler 에 의해 thread 단위로 SP 들에게 전달되고, SP 가 열심히 연산을 하게 되는 것이다.

## CUDA API

- 그럼 이 execution model 을 CUDA API 로는 어떻게 사용하는지 알아보자.
- 우선 grid 는 몇개의 thread block 으로 이루어져 있는지, 그리고 각 thread block 은 몇개의 thread 로 이루어져 있는지는 configurable 한 값들이다.
	- `dim gridDim(X, Y, Z);` 로 grid 내의 thread block 개수를 지정한다.
		- 인자가 세개인 것은 3차원 (X축, Y축, Z축) 으로 지정할 수 있게 하기 위함이다.
		- 즉, 이상황에서 총 thread block 의 개수는 `X * Y * Z` 인 것.
	- `dim blockDim(X, Y, Z);` 로 thread block 내의 thread 개수를 지정한다.
		- 이때도 마찬가지로 3차원으로 지정할 수 있게 한다.
	- 이 두 configure 이 kernel call 의 `<<<>>>` 에 들어간다.
		- `<<<gridDim, blockDim>>>` 으로 해주면 된다.
- Kernel code 는 하나의 thread 에서 작동하게 된다. 그럼 내가 grid, thread block 구조 안에서 어디에 있는지는 알아야 할 것 아닌가.
	- 이를 위해 다음의 두 변수가 추가적으로 제공된다.
	- `blockIdx`: 이놈은 현재 thread 가 속한 grid 내에서의 thread block index 를 알려준다.
		- 즉, grid 내에서 몇번째 thread block 인가? 를 담고 있는 것.
		- `gridDim` 이 3차원으로 정의되는 것처럼, 이 index 도 3차원으로 값을 받아올 수 있다.
		- X축, Y축, Z축 각각 `blockIdx.x`, `blockIdx.y`, `blockIdx.z` 로 index 를 받아올 수 있다.
	- `threadIdx`: 이놈은 현재 thread 가 속한 thread block 내에서의 thread index 를 알려준다.
		- 마찬가지로 이놈도 `threadIdx.x`, `threadIdx.y`, `threadIdx.z` 로 3차원적으로 접근할 수 있다.
- OpenCL 에서와 다르게, global id 같은건 없다. 직접 계산해 줘야 한다.
	- 이렇게 계산해 주면 된다: `blockIdx.{x,y,z} * blockDim.{x,y,z} + threadIdx.{x,y,z}`