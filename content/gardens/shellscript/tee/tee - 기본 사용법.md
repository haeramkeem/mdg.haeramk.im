---
tags:
  - shellscript
  - bash-tee
aliases:
  - tee
date: 2025-05-26
---
## TL;DR

- `tee` 는 redirect (`>`) 와 동일하다고 생각하면 된다. 즉, 아래의 명령어는

```bash
echo "good" > myfile.txt
```

- `tee` 를 사용하면 다음과 같다.

```bash
echo "good" | tee myfile.txt
```

- 그리고 다음과 같은 append redirect (`>>`) 는

```bash
echo "good" >> myfile.txt
```

- `tee` 에서는 `-a` 옵션을 사용하면 된다.

```bash
echo "good" | tee -a myfile.txt
```

- 이것만 보면 `tee` 를 왜 쓰지? 할 수도 있는데, [[sudo - 사용자 변경하기|superuser 권한이 필요할 때]] `tee` 를 사용할 일이 있을것이다.