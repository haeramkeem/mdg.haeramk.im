---
tags:
  - arch
  - arch-cuda
date: 2024-11-04
aliases:
  - CUDA
---
> [!info]- 참고한 것들
> - [[14. CUDA|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## CUDA

- Compute Unified Device Architecture 의 약자인데, 뭐 이름으로는 이게 뭔지 잘 감이 안올거고
- General-purpose GPU (GPGPU) 를 사용할 수 있게 해주는 API 를 제공하는 NVIDIA 독자적인 platform 이다.

## Common Heterogeneous Computing

- Heterogeneous computing 을 할때는 보통 다음과 같은 패턴을 따른다:
- 일단 controlplane 이 있다. 보통 host 에서 이것을 담당한다.
- Host 은 device 에 실행할 코드를 던져서 그것을 실행하도록 한다.
	- 이때 이 코드는 "함수" 의 형태를 따르고 있고, 이것을 *Kernel* 이라고 한다.
- 그리고 메모리 공간은 host 와 분리된 device 만의 공간을 사용한다.
	- 이 메모리 공간을 할당, 해제하는 것, 그리고 여기에 데이터를 복사해 넣는 일 모두 host 가 담당한다.
- 따라서 대강 다음과 같은 순서로 실행된다.
	1. Host 은 device 에서 사용할 메모리 공간을 할당한다.
	2. 그리고 여기에 데이터를 복사한다 (Host-to-device memcpy).
	3. Host 는 실행할 kernel 을 compile 한 후, device 에게 이것을 실행하라고 명령한다.
	4. Device 는 kernel 을 실행한다. 당연히 device 가 사용하는 메모리 공간은 host 의 것이 아니고 (1) 에서 생성한 공간이다.
	5. 실행이 완료되면, host 는 device 에서 데이터를 복사해 온다 (Device-to-host memcpy).
	6. Host 는 할당한 device 메모리 공간을 해제한다.

## Heterogeneous Computing with CUDA API

- 이제 이 heterogeneous computing 을 CUDA API 로는 어떻게 하나 알아보자.
- 일단 메모리 공간 관리는 다음의 함수로 해주면 된다.
	- `cudaMalloc()`: Device memory 를 할당한다.
	- `cudaMemcpy()`: Host-to-device, Device-to-host memcpy 를 하는 함수이다.
	- `cudaFree()`: Device memory 를 해제한다.
- Kernel 은 일반적인 C 함수에 `__global__` annotation 을 달아주기만 하면 된다.
	- CUDA 코드를 compile 하는 것은 `nvcc` 로, 기본적으로 `gcc` 가 내장되어 있어 kernel 코드 이외에 일반 C 코드도 compile 할 수 있다.
	- `__global__` 이 달려있으면 자동으로 host 에서 호출하고 device 에서 실행되는 kernel 이구나 라고 `nvcc` 에서 인식하게 된다.
	- 따라서 `nvcc` 는 이 annotation 으로 host code 와 kernel 을 구분지어 각각 compile 하고, host 가 kernel call 을 할 수 있도록 해준다.
- Host 에서의 kernel call 은 `FUNC_NAME<<<params>>>(args)` 의 형태로 수행된다.
	- 저 `params` 에 들어가는 것들은 block dim, grid dim 등인데 이건 뒤에서 다뤄보자.
	- `args` 는 kernel 의인자 이다 (함수 인자라고 생각하면 된다).

## CUDA Execution Model with API

- [[CUDA Execution Model (NVIDIA CUDA)|CUDA Execution Model]] 는 CUDA API 로는 어떻게 쓸 수 있는지 알아보자.
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