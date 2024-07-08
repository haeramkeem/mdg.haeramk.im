---
tags:
  - 쉘스크립트
  - bash-wc
date: 2024-07-02
---
## TL;DR

```sh
echo -n "good" | wc -c
```

- 결과는 `4` 이다 (만약 `echo` 에 `-n` 옵션을 빼면 `\n` 도 같이 카운트되어 `5`로 나온다.)