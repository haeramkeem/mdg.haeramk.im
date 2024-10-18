---
tags:
  - arch
  - terms
aliases:
  - Flow dependence
  - True dependence
  - RAW dependence
  - Anti dependence
  - False dependence
  - WAR dependence
  - Output dependence
  - Input dependence
  - Data dependence
  - Memory dependence
date: 2024-10-18
---
> [!info]- 참고한 것들
> - [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 5강 (Fall 2024)]]
> - [[06. Loop-carried Dependences and Parallelism|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 6강 (Fall 2024)]]

## Data dependence

- 어떤 레지스터 혹은 메모리 공간에 대해 [[Dependence (Arch)|Dependence]] 가 있는 것을 *Data dependence* (혹은 *Memory dependence*) 라고 한다.
- 여기에는 다음의 네 종류가 있다:

### Flow dependence

```
P: A = ...
...
Q: ... = A
```

```mermaid
flowchart LR
	P -- dt --> Q
```

- Flow dependence ($\delta^{t}$) 란 동일한 메모리 공간에 연산결과를 (1) 저장하고 (2) 읽어가는 두 연산을 말한다.
	- [[#True, False dependence|True dependence]] 에 속한다.
- 즉, Read-after-write (RAW) 관계인 것.

### Anti dependence

```
P: ... = A
...
Q: A = ...
```

```mermaid
flowchart LR
	P -- da --> Q
```

- Anti dependence ($\delta^{a}$) 란 동일한 메모리 공간에 연산결과를 (1) 읽어가고 (2) 저장하는 두 연산을 말한다.
	- [[#True, False dependence|False dependence]] 에 속한다.
- 즉, Write-after-read (WAR) 인 것.

### Output dependence

```
P: A = ...
...
Q: A = ...
```

```mermaid
flowchart LR
	P -- da --> Q
```

- Output dependence ($\delta^{o}$)
	- 얘도 False dependence 에 속한다.
- 동일한 공간에 두 연산이 모두 저장하는 경우
- 당연히 두 연산의 순서를 바꾸면 문제가 생길 수 있다

### Input dependence

```
P: ... = A
...
Q: ... = A
```

- Input dependence
- 동일한 공간을 두 연산이 모두 읽어가는 경우
	- 이 경우에는 순서를 바꿔도 문제가 생기지 않기 때문에 엄밀하게는 dependence 는 아니지만
	- cache 때문에 이런 개념을 정의했다고 함
		- 뒤이은 연산은 cache 에 있는 놈을 가져가기 때문에 이러한 관계를 분석하기 위해 만든 것.

### True, False dependence

- Flow dependence 와 같은 경우에는 좀 더 "순서" 와 관련있는 개념이다.
	- 즉, (1) 값이 준비된 다음 (2) 읽어야 하기 때문.
	- 이런 dependence 를 *True dependence* 라고 부르는 것.
- 하지만 anti dependence 와 output dependence 는 "순서" 와는 느낌이 좀 다르다.
	- 이놈은 사용한 공간을 "재활용" 하는 것이기 때문.
	- 물론 그렇다고 해서 순서를 바꿔도 된다는 것은 아님; 개념적으로 "순서" 와 좀 거리가 있다라는 의미다.
	- 따라서 이런 놈들을 *False dependence* 라고 부르고, 다른 공간을 사용하게 하는 것으로 해결 가능하다.
- 가령 다음 예시를 보면

![[Pasted image 20241018134530.png]]

- 왼쪽에는 이런 depenedence 가 있다:
	- Flow dependence: $S_{1} - \delta^{t} \rightarrow S_{2}$, $S_{3} - \delta^{t} \rightarrow S_{4}$
	- Anti dependence: $S_{2} - \delta^{t} \rightarrow S_{3}$
- 이때 $S_{1}$, $S_{2}$ 에서 사용하는 공간은 $t_{1}$ 로 바꿔주고 $S_{3}$, $S_{4}$ 에서 사용하는 공간은 $t_{2}$ 로 바꿔주면 anti dependence 는 해결되고 flow dependence 만 남게 된다.