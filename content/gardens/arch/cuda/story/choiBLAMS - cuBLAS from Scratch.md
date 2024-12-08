---
tags:
  - arch
  - arch-cuda
  - story
date: 2024-12-06
---
> [!info]- 참고한 것들
> - [어떤 대단한 사람의 블로그](https://siboehm.com/articles/22/CUDA-MMM)

> [!info] 원본
> - 본 글은 [시봄씨 블로그](https://siboehm.com/articles/22/CUDA-MMM) 를 나름대로 reproduce 한 글입니다.

> [!info] 실험 환경
> - 실험 환경은 GCP 에서 Compute Engine [n1-standard-4](https://cloud.google.com/compute/docs/general-purpose-machines#n1_machines) (4C 15GiB) 에 GPU 는 [nvidia-tesla-t4](https://cloud.google.com/compute/docs/gpus#t4-gpus) 이다.
> - 그리고 NVIDIA CUDA 버전은 `12.2`, matrix size 는 $M=16384$, $N=4096$, $K=4096$ 이다.

## 개요

![[Pasted image 20241206225941.png]]

- [[(SNU CSE) Scalable High-Performance Computing|이재진 교수님 강의]] 때문에 matrix multiplication 최적화를 하게 됐는데, 기왕 해보는거 좀 잘해보자 싶어서 시작해본 도전기.
- NVIDIA [[CUDA (NVIDIA CUDA)|CUDA]] 의 matrix multiplication library 인 [cuBLAS](https://docs.nvidia.com/cuda/cublas/) 정도의 성능을 내는 *choiBLAMS* ([최불암스](https://namu.wiki/w/%EC%B5%9C%EB%B6%88%EC%95%94%20%EC%8B%9C%EB%A6%AC%EC%A6%88)) 를 구현해 보자.
- cuBLAS 로 돌렸을 때의 성능은 다음과 같다.

![[Pasted image 20241208175336.png]]

## Kernel 1. Naive

![[Pasted image 20241206225243.png]]

- Naive 버전은 간단하다. 그냥 전체 matrix 를 32x32 [[CUDA Execution Model (NVIDIA CUDA)|Thread block]] 들로 나누고, [[CUDA Execution Model (NVIDIA CUDA)|Thread]] 하나가 cell 하나를 계산하는 방식이다.
	- 위 그림에서 빨간색 물결표가 thread 이고, 빨간색 사각형이 이 thread 가 담당하는 영역이라고 생각하면 된다.
- 그래서 kernel 코드는 다음처럼 된다.

> [!tip] 이 코드가 이해가 안된다면?
> - [[CUDA Execution Model (NVIDIA CUDA)|CUDA Execution Model]] 하고 [[CUDA (NVIDIA CUDA)|CUDA]] 에서 API 들을 보자.
> - 여기서 `*_d` 로 이름붙은 애들은 device memory 이다.

```c
__global__ void
matmul_kernel(float *A, float *B, float *C, int M, int N, int K)
{
	const int m = blockDim.x * blockIdx.x + threadIdx.x;
	const int n = blockDim.y * blockIdx.y + threadIdx.y;
	
	if (m >= M || n >= N)
		return;
	
	float acc = 0.0f;
	for (int k = 0; k < K; k++)
		acc += A[m * K + k] * B[k * N + n];
	C[m * N + n] = acc;
}
```

- 그리고 grid, block 선언과 kernel call 코드는 다음처럼 될 것이다.

```c
#define SGEMM_TS 32

dim3 blockDim(SGEMM_TS, SGEMM_TS, 1);
dim3 gridDim(M/SGEMM_TS, N/SGEMM_TS, 1);
matmul_kernel<<<gridDim, blockDim>>>(a_d, b_d, c_d, M, N, K);
```

- 간단하죠?
- 결과는 60.8 GFLOPS 가 나왔다.

![[Pasted image 20241208153519.png]]

## Kernel 2. Global Memory Coalescing

- 우선 다음의 두 사실을 생각해 보자.
	- [[CUDA Execution Model (NVIDIA CUDA)|Warp]] 에 속해서 한번에 실행되는 thread 는 연속된 `threadIdx.x` 값을 가진다.
	- [[CUDA Memory Model (NVIDIA CUDA)|Global Memory Coalescing]] 에 의해, warp 가 연속된 [[CUDA Memory Model (NVIDIA CUDA)|GMEM]] 주소에 접근하면 이것은 하나의 접근으로 coalescing 된다.
- 근데 위의 코드는 이 관점에서 보면 개판이라고 할 수 있다.
	- 일단 `A`, `B`, `C` 가 모두 GMEM 인데
	- `threadIdx.x` 가 `int m` 에 물려있기 때문에 `threadIdx.x` 이 1씩 커지는 것을 상상해보면 `A` 와 `C` 의 access pattern 이 다음과 같이 된다는 것을 알 수 있다.
		- `B` 는 같은 warp 라면 `threadIdx.y` 가 바뀌지 않기 때문에 `n` 도 바뀌지 않아 별 영향이 없다.

![[Pasted image 20241206235521.png]]

- 그럼 이것을 어떻게 해결하냐; `threadIdx.x` 를 `int n` 에 물려버리면 된다.
	- 사실 이 부분이 좀 헷갈릴 수도 있다. 왜냐면 `x` 축은 `M` 방향으로 움직이는데 이렇게 `x`, `y` 축을 뒤집어버려도 괜찮나?
	- 근데 괜찮다. 왜냐면 `threadIdx.x` 와 `threadIdx.y` 는 block 내부에서만 움직이기 때문에, 만약에 block 이 정사각형이라면 여기서는 축이 바뀌어도 동치이다.
- 그래서 위의 kernel code 에서 `int m` 과 `int n` 조금 수정해주면 된다.

```c {4,5}
__global__ void
matmul_kernel(float *A, float *B, float *C, int M, int N, int K)
{
	const int m = blockDim.x * blockIdx.x + threadIdx.y;
	const int n = blockDim.y * blockIdx.y + threadIdx.x;
	
	if (m >= M || n >= N)
		return;
	
	float acc = 0.0f;
	for (int k = 0; k < K; k++)
		acc += A[m * K + k] * B[k * N + n];
	C[m * N + n] = acc;
}
```

- Grid, kernel call code 는 그대로 사용해도 된다.
- 이렇게만 해줘도 성능이 크게 뛴다; 이번에는 평균 499.3 GFLOPS 가 나왔다.

![[Pasted image 20241208153751.png]]

## Kernel 3. Shared Memory Caching

- [[CUDA Memory Model (NVIDIA CUDA)|SMEM]] 은 GPU 의 L1 cache 로, 여기는 하나의 [[CUDA Execution Model (NVIDIA CUDA)|Thread block]] 이 공유하는 공간이다.
- 즉, GMEM 에 비해서 훨씬 빠른 저장소이므로, 여기에 필요한 데이터를 우선 올린 다음에 연산을 수행하자는 것이 아이디어이다.
- 우선 코드 먼저 보자.

```c {15-29}
#define SGEMM_TS 32

__global__ void
matmul_kernel(float *A, float *B, float *C, int M, int N, int K)
{
	const int _m = threadIdx.y;
	const int _n = threadIdx.x;

	const int m = blockDim.x * blockIdx.x + _m;
	const int n = blockDim.y * blockIdx.y + _n;

	if (m >= M || n >= N)
		return;

	__shared__ float _A[SGEMM_TS * SGEMM_TS];
	__shared__ float _B[SGEMM_TS * SGEMM_TS];

	float acc = 0.0f;
	for (int t = 0; t < K/SGEMM_TS; t++) {
		_A[_m * SGEMM_TS + _n] = A[m * K + (t * SGEMM_TS + _n)];
		_B[_m * SGEMM_TS + _n] = B[(t * SGEMM_TS + _m) * N + n];
		__syncthreads();

		for (int k = 0; k < SGEMM_TS; k++)
			acc += _A[_m * SGEMM_TS + k] * _B[k * SGEMM_TS + _n];
		__syncthreads();
	}

	C[m * N + n] = acc;
}
```

- `0-13` 번째 줄은 사실상 바뀐게 없다.
- 나머지 부분은 크게 두 부분으로 나뉠 수 있다.
	1) SMEM 으로 올리는 부분 (`20-22` 번째 줄)
	2) 연산 이후, C (GMEM) 에 저장하는 부분 (나머지)

![[Pasted image 20241209020900.png]]

![[Pasted image 20241209020909.png]]

- SMEM 으로 올리는 부분을 그림으로 그려보면 다음과 같다.
	- 사실 위 그림이랑 같이 보면 크게 어려울게 없다: `t` 는 `K` 를 `SGEMM_TS`(`32`) 단위로 iterate 하는 것이기에, `K` 방향의 offset 이 `t * SGEMM_TS` 이 된다는 것만 이해하면 나머지는 직관적으로 알 수 있다.
- 다만 여기서 주목할 것은 모든 thread 가 합심하여 SMEM 으로 올리고 있기 때문에 `__syncthreads()` 가 필요하다는 것이다.
	- 만약 여기서 sync 를 하지 않는다면, 아직 SMEM 에 덜 올라온 상태에서 연산이 시작되어 잘못된 값으로 연산을 하기 때문.

![[Pasted image 20241209020916.png]]

- 그리고 연산하여 C 에 저장하는 것은 그림으로 그리면 위와 같다.
	- 여기도 크게 어려울 것이 없다: `_A` 와 `_B` 에서 `K` 방향으로 iterate 하는 `k` 가 움직임에 따라 곱셈연산을 수행하며 그의 결과가 `acc` 에 담기고, 그 결과가 `C` 에 저장된다.
- 이때의 결과는 750.0 GFLOPS 가 나왔다.

![[Pasted image 20241208154019.png]]

## Kernel 3. 1D Blocktiling

```c
#define SGEMM_TS 32
#define SGEMM_LS 4

__global__ void
matmul_kernel(float *A, float *B, float *C, int M, int N, int K)
{
	int _m = threadIdx.y;
	int _n = threadIdx.x;

	int m = blockDim.x * blockIdx.x + _m;
	int n = SGEMM_LS * (blockDim.y * blockIdx.y + _n);

	__shared__ float _A[SGEMM_TS * SGEMM_TS];
	__shared__ float _B[SGEMM_TS * (SGEMM_TS * SGEMM_LS)];

	if (m >= M || n >= N)
		return;

	float acc[SGEMM_LS] = {0.0f};

	for (int t = 0; t < K/SGEMM_TS; t++) {
		int t_n = SGEMM_TS * t + _n;
		_A[_m * SGEMM_TS + _n] = A[m * K + t_n];

		int t_m = SGEMM_TS * t + _m;
		for (int l = 0; l < SGEMM_LS; l++)
			_B[_m * (SGEMM_TS * SGEMM_LS) + (_n * SGEMM_LS + l)] = B[t_m * N + n + l];

		__syncthreads();
		for (int k = 0; k < SGEMM_TS; k++) {
			float _a = _A[_m * SGEMM_TS + k];
			for (int l = 0; l < SGEMM_LS; l++)
				acc[l] += _a * _B[k * (SGEMM_TS * SGEMM_LS) + (_n * SGEMM_LS + l)];
		}
		__syncthreads();
	}

	for (int l = 0; l < SGEMM_LS; l++)
		C[m * N + (n + l)] = acc[l];
}
```

![[Pasted image 20241208154135.png]]

## Kernel 4. 2D Blocktiling

```c
__global__ void
matmul_kernel(float *A, float *B, float *C, int M, int N, int K)
{
	int _m = threadIdx.y;
	int _n = threadIdx.x;

	int m = SGEMM_LS * (blockDim.x * blockIdx.x + _m);
	int n = SGEMM_LS * (blockDim.y * blockIdx.y + _n);

	__shared__ float _A[(SGEMM_TS * SGEMM_LS) * SGEMM_TS];
	__shared__ float _B[SGEMM_TS * (SGEMM_TS * SGEMM_LS)];

	if (m >= M || n >= N)
		return;

	float acc[SGEMM_LS * SGEMM_LS] = {0.0f};

	for (int t = 0; t < K/SGEMM_TS; t++) {
		int t_n = SGEMM_TS * t + _n;
		for (int l_m = 0; l_m < SGEMM_LS; l_m++)
			_A[(_m * SGEMM_LS + l_m) * SGEMM_TS + _n] = A[(m + l_m) * K + t_n];

		int t_m = SGEMM_TS * t + _m;
		for (int l_n = 0; l_n < SGEMM_LS; l_n++)
			_B[_m * (SGEMM_TS * SGEMM_LS) + (_n * SGEMM_LS + l_n)] = B[t_m * N + (n + l_n)];

		__syncthreads();
		for (int k = 0; k < SGEMM_TS; k++) {
			for (int l_m = 0; l_m < SGEMM_LS; l_m++) {
				float _a = _A[(_m * SGEMM_LS + l_m) * SGEMM_TS + k];
				for (int l_n = 0; l_n < SGEMM_LS; l_n++)
					acc[l_m * SGEMM_LS + l_n] += _a * _B[k * (SGEMM_TS * SGEMM_LS) + (_n * SGEMM_LS + l_n)];
			}
		}
		__syncthreads();
	}

	for (int l_m = 0; l_m < SGEMM_LS; l_m++)
		for (int l_n = 0; l_n < SGEMM_LS; l_n++)
			C[(m + l_m) * N + (n + l_n)] = acc[l_m * SGEMM_LS + l_n];
}
```

![[Pasted image 20241208171219.png]]

## Kernel 5. Vectorization

```c
__global__ void
matmul_kernel(float *A, float *B, float *C, int M, int N, int K)
{
	int _m = threadIdx.y;
	int _n = threadIdx.x;

	int m = SGEMM_LS * (blockDim.x * blockIdx.x + _m);
	int n = SGEMM_LS * (blockDim.y * blockIdx.y + _n);

	__shared__ float _A[(SGEMM_TS * SGEMM_LS) * SGEMM_TS];
	__shared__ float _B[SGEMM_TS * (SGEMM_TS * SGEMM_LS)];

	if (m >= M || n >= N)
		return;

	float4 acc[SGEMM_LS] = {0.0f};

	for (int t = 0; t < K/SGEMM_TS; t++) {
		int t_n = (_n % (SGEMM_TS/SGEMM_LS)) * SGEMM_LS;
		int t_m = _n / (SGEMM_TS/SGEMM_LS);
		reinterpret_cast<float4 *>(&_A[(_m * SGEMM_LS + t_m) * SGEMM_TS + t_n])[0]
		= reinterpret_cast<float4 *>(&A[(m + t_m) * K + t * SGEMM_TS + t_n])[0];

		reinterpret_cast<float4 *>(&_B[_m * (SGEMM_TS * SGEMM_LS) + (_n * SGEMM_LS)])[0]
		= reinterpret_cast<float4 *>(&B[(SGEMM_TS * t + _m) * N + (n)])[0];
		__syncthreads();

#pragma unroll
		for (int k = 0; k < SGEMM_TS; k++) {
#pragma unroll
			for (int l_m = 0; l_m < SGEMM_LS; l_m++) {
				float _a = _A[(_m * SGEMM_LS + l_m) * SGEMM_TS + k];
				float4 _b = reinterpret_cast<float4 *>(&_B[k * (SGEMM_TS * SGEMM_LS) + (_n * SGEMM_LS + 0)])[0];
				acc[l_m].x += _a * _b.x;
				acc[l_m].y += _a * _b.y;
				acc[l_m].z += _a * _b.z;
				acc[l_m].w += _a * _b.w;
			}
		}
		__syncthreads();
	}

#pragma unroll
	for (int l_m = 0; l_m < SGEMM_LS; l_m++)
		reinterpret_cast<float4 *>(&C[(m + l_m) * N + (n + 0)])[0] = acc[l_m];
}
```

![[Pasted image 20241208235202.png]]