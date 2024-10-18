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
> - [[05. Dependences and Pipelining|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

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

- Flow dependence (true dependence, $\delta^{t}$) 란
- 동일한 메모리 공간에 연산결과를 (1) 저장하고 (2) 읽어가는 두 연산을 말한다.
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

- Anti dependence (false dependence, $\delta^{a}$) 란
- 동일한 메모리 공간에 연산결과를 (1) 읽어가고 (2) 저장하는 두 연산을 말한다.
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