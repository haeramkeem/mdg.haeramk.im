---
tags:
  - os
  - os-io
  - draft
aliases:
  - Advice
  - fadvice
  - posix_fadvice
---
> [!info]- 참고한 것들
> - [Linux manpage](https://man7.org/linux/man-pages/man2/posix_fadvise.2.html)

> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

## File Access Advice

- File 을 접근하는 pattern 을 미리 알려줘서 그에 최적화된 IO 를 수행할 수 있게 해주는 [[System Call (Process)|syscall]] 이다.