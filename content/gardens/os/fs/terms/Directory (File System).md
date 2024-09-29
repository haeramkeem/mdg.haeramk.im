---
tags:
  - terms
  - os
  - os-fs
aliases:
  - Directory
  - directory
---
> [!info]- 참고한 것들
> - [[08. Filesystem Overview|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]

## Directory

- *Directory* 는 `[file_name, inode_id]` 의 list 를 담은 파일
- 파일 이름은 directory 를 이용해 inode number 로 변환된다.
	- 몰랐던 사실이죠? inode 가 아니라 dir 에 저장된다.
	- 여기서 path 는 directory 를 재귀적으로 참조하여 file 의 위치를 알아냄
- 이 inode number 로 inode 를 알아내는 것은 쉬움 - fs 의 inode 영역에서 index 로 접근
- 여기서 metadata 를 읽어서 권한 등을 판단하는 두둥실을 한다고 한다.