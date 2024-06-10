---
tags:
  - 용어집
  - OS
  - Memory
date: 2024-06-07
---
> [!info]- 참고한 것들
> - [커널](https://docs.kernel.org/filesystems/proc.html#process-specific-subdirectories)

## `/proc/${PID}/maps`

- 이놈은 해당 `${PID}` 의 [[Virtual Memory (Memory)|virtual memory]] mapping 상태를 보여준다.
- `${PID}` 대신 `self` 라는 symlink 를 사용하면, 이 `self` 값이 현재의 프로세스의 PID 로 치환되어 mapping 이 보여진다.
	- 이게 뭔소린지 예를 들어보자.
	- 만약 주인장이 shell 에서 `cat /proc/self/maps` 를 실행하면, 일단 shell 은 process 를 하나 fork 하고 `cat` 을 exec 하는 식으로 프로세스를 실행시킬 것이야.
	- 만약에 이 생성된 프로세스의 PID 가 `500` 라면, `/proc/self/maps` 는 `/proc/500/maps` 로 바뀐다.
	- 그리고 이 `PID:500 (cat)` 프로세스에 대한 virtual memory mapping 상태를 보여주게 된다.
- 직접 확인해 보자.

```bash
cat /proc/self/maps
```

![[Pasted image 20240607131509.png]]

- 보면 얼추 기존에 알고 있던 것과 유사하다.
	- 맨 위에 Code 영역이 있고
	- Stack 은 아래서부터 자라고
	- Heap 은 위에서부터 내려오는
- 각 column 들 설명:
	1. Virtual address (`start-end`)
	2. Permission:
		- `r`: Read
		- `w`: Write
		- `x`: Executable
		- `s`: Shared
		- `p`: Private
	3. Offset: (File-backed 의 경우) 해당 virtual addr 이 file 의 어디에 (offset) 매핑되어있는지 나온다.
		- 위 예시에서 위에서 두개의 row 를 살펴보자.
		- 첫번째는 offset 이 `00000000` 이고, 두번째는 `000dc000` 인 것을 볼 수 있는데
		- 왼쪽의 virtual addr 의 시작주소 차이가 딱 `0xdc000` 만큼 나는 것을 볼 수 있다.
	4. Device: (File-backed 의 경우) 해당 파일이 존재하는 파일시스템의 device (storage) number 를 보여준다.
		- Anonymous 의 경우에는 `00:00` 으로 출력된다.
	5. Inode:
		- File-backed 라면 해당 파일의 inode,
		- Anonymous 라면 `0` 으로 출력된다.
	6. Pathname:
		- File-backed 라면 해당 파일의 경로,
		- Anonymous 라면 `[]` 로 출력된다.