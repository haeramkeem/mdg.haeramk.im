---
tags:
  - os
  - os-fs
  - terms
aliases:
  - inode
  - Inode
date: 2024-09-29
---
> [!info]- 참고한 것들
> - [[08. Filesystem Overview|서울대 김진수 교수님 고급운영체제 강의 (Spring 2024)]]

## inode

- 파일의 metadata 는 *inode* 에 저장된다.
- 이런애들이 저장된다고 한다

| NAME        | DESCRIPTION     |
| ----------- | --------------- |
| 파일 사이즈      |                 |
| Block 들의 위치 | 아마 LBA 주소일 듯하다. |
| 소유자         | `user`, `group` |
| 권한          | `rwx`           |
| Timestamp   | 갖가지 시간 정보들     |

### Structure

- 사실 inode 에서 중요한 것은 구조이다.

> [!fail]- ... 는 조만간 정리할 예정 ( #draft )
> - [ ] 내용 정리