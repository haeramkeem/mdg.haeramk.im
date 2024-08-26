---
tags:
  - terms
  - os
  - procfs
date: 2024-06-07
---
> [!info]- 참고한 것들
> - [커널](https://docs.kernel.org/filesystems/proc.html)

## procfs, The /proc Filesystem

- Filesystem interface 를 이용해서 Kernel 의 다양한 값들에 접근할 수 있게 해주는 기능이다.
	- 즉, `cat` 명령어로 파일을 읽는 것과 동일하게 `cat /proc/...` 로 값을 읽어오거나
	- `tee` 명령어로 파일에 쓰는 것과 동일하게 `tee /proc/...` 로 Kernel 의 설정을 변경할 수 있다.
- 파일 경로의 형태를 띄고 있긴 하지만 실제로 존재하는 파일은 아니다.
	- 이때문에 *Pseudo-filesystem* 라고 한다.