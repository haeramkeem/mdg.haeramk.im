---
tags:
  - 쉘스크립트
  - bash-find
date: 2024-07-09
---
## TL;DR

- `find` 는 기본적으로 모든 파일이 다 나오는데
- 타입 필터링을 하고 싶으면 이래하면 된다.
- 우선 일반 파일

```bash
find /path/to/find -type f
```

- 디렉토리

```bash
find /path/to/find -type d
```