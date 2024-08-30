---
tags:
  - shellscript
  - bash-find
date: 2024-07-09
---
## TL;DR

```bash
find /path/to/find -exec ls -al "{}" \;
```

- 아마 `"{}"` 가 파일 이름으로 대체될 것이고
- `\;` 는 script 종료를 말하는 기호일 것이다.