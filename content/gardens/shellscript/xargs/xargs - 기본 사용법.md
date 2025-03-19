---
tags:
  - bash-xargs
date: 2025-03-17
aliases:
  - xargs
---
## TL;DR

- 기본적인 사용법은 다음과 같다:

```bash
${STDOUT} | xargs -n1 ${COMMAND}
```

- 예를 들면, 아래처럼 쓸 수 있고

```bash
echo "file1 file2 file3" | xargs -n1 touch
```

- 이것은 다음과 같다:

```bash
for f in $(echo "file1 file2 file3"); do
	touch $f
done
```

- 그리고 이것은 결과적으로 다음처럼 작동한다:

```bash
touch file1
touch file2
touch file3
```