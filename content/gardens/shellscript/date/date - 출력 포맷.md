---
tags:
  - 쉘스크립트
  - bash-date
date: 2024-07-09
---
> [!info]- 참고한 것들
> - [date manpage](https://man7.org/linux/man-pages/man1/date.1.html)

## TL;DR

- `+` 뒤에 포맷을 붙이면 된다.

```bash
date +%Y%m%d
```

- 대표적인 포맷은:

```
%Y     year
%m     month (01..12)
%d     day of month (e.g., 01)
%H     hour (00..23)
%M     minute (00..59)
%S     second (00..60)
```

- 다른 포맷들은 [공식문서](https://man7.org/linux/man-pages/man1/date.1.html) 를 참고하자.