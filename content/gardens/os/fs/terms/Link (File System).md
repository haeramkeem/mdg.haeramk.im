---
tags:
  - os
  - os-fs
  - terms
date: 2024-09-25
aliases:
  - Symlink
  - Hardlink
  - Softlink
  - Link
---
> [!info]- 참고한 것들
> - [레드햇](https://www.redhat.com/sysadmin/linking-linux-explained)
> - [[08. Filesystem Overview|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]

## 파일을 연결하기

- Link 는 말 그대로 [[File System (OS)|File]] 을 연결하는 것인데, 이것이 중요한게 아니고 두 가지의 link 방식이 중허다.
	- Hard Link 와 Soft Link (Symlink)

## Hard Link

- *Hard link* 는 [[Inode (File System)|Inode]] 와 파일 이름을 연결하는 것을 말한다.
- 근데 생각해 보면 이걸 수행해주는 놈은 [[Directory (File System)|Directory]] 이기에, *Hard link* 는 간단하게 말해서는 directory 에 파일을 추가하는 것, 구체적으로 말하면 directory 에다가 inode 와 file name 을 명시해 주는 작업이라고 할 수 있다.
- 따라서 흔히 생각하는 "파일을 생성" 하게 되면, 무조건 *Hard link* 가 하나는 생기게 되는 것이다.
- 이런 관점에서 본다면, 여러개의 directory 에다가 동일한 inode 를 hard link 할 수도 있지 않을까? 하는 생각이 든다.
	- 당연히 가능하다. 이렇게 해서 동일한 파일을 마치 두 directory 내에 존재하는 것처럼 보이게 할 수 있다.

### POSIX `unlink` API

- 앞서서 하나의 inode 를 여러 directory 에 명시해 *Hard link* 할 수 있다고 말했는데,
- 그럼 이때 파일을 "지운다" 는 것은 어떻게 처리될까?
- POSIX 의 File API 에는 "지우는" API 는 없다; 다만 이 *Hard link* 를 끊어내는 `unlink` API 만이 존재한다.
- 파일이 *Hard link* 되면 link count 가 올라가고, `unlink` 하면 이 count 가 내려간다. 그리고 이것이 0 이 되면, 자동으로 파일이 지워지게 된다.
	- 따라서 파일을 지우기 위해서는 모든 *Hard link* 를 다 끊어줘야 된다.
	- 심지어 이 link count 는 process 가 파일을 `open` 해도 올라가게 된다; 그래서 이런 상황도 가능하다.
		- Process A 가 파일을 열고 사용하고 있는 중에
		- Process B 가 파일을 directory 에서 `unlink` 해버렸다고 하자.
		- 하지만 이때 A 는 파일을 open 해놓았기 때문에 당장 파일이 삭제되지는 않고, A 가 `close` 를 하면 그때 지워진다.
		- 그렇다고 해서 `unlink` 한 시점 이후 다른놈 (가령 process C) 가 해당 파일을 `open` 해서 사용할 수는 없다.
		- 당연히 해당 파일은 directory 에서 `unlink` 된 상태이기 때문에 어떠한 경로로도 해당 파일을 찾을 수 없기 때문.

### Num. of Hard Links

- Directory 의 경우에는 이 link count 가 어떻게 될까?
- 디렉토리는 link 가 최소 2개 생성된다.
	- 상위 디렉토리에서 바라보는 파일로서 하나
	- 현재 디렉토리 내에서 `.` 로 하나
- 그럼 하위에 2개의 sub-directory 가 있으면 4개의 link 가 됨 (`..`)
	- `A/B/C,D` 의 구조에서 directory `B` 를 예로 들어보자.
	- 일단 `A` 에 entry 로 `B` 가 들어있을 것이다 (+1)
	- 그리고 `B` 의 entry 로 `.` 가 들어있을 것이고 (+1)
	- `C` 의 entry 로 `..` 가 들어있을 것이며 (+1)
	- `D` 의 entry 로 `..` 가 들어있을 것이다. (+1) -> 총합 4개!

## Soft Link (Symlink)

- Hard link 가 directory 에만 적혀있는 유령회사같은 놈이었다면
- *Soft link* 는 "진짜" 파일이다.
- 다만, file type 이 `s` 이고 여기에 적힌 내용은 원본의 경로일 뿐인 놈인 것.
- Bash 에서 이것을 생성하고 삭제하는 건 여기 ([[ln - Symlink 생성하기|생성]], [[ln - Symlink 삭제하기|삭제]]) 를 참고하자.