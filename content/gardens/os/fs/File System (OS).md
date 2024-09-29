---
tags:
  - terms
  - os
  - os-fs
date: 2024-09-25
aliases:
  - File System
  - FS
  - File
---
> [!info]- 참고한 것들
> - [[08. Filesystem Overview|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]

## File

- 일단 *File* 이 뭘까?
- 누가 길가다가 물어보면 ==(1) Persistent storage 에 저장된 (2) 이름을 가지고 있는 (3) 연관된 byte 들의 모음== 라고 말하면 된다.

## Filesystem

- 그럼 Filesystem 는 ==사용자가 생성한 file 에 대한 metadata 를 관리하는 시스템== 이라고 정의할 수 있다.
	- 즉, 각 file 자체에 대해서는 별로 신경쓰지 않는다.