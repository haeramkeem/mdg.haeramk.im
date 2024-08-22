---
tags:
  - 쉘스크립트
  - bash-find
date: 2024-08-22
---
## TL;DR

- 파일 이름에 공백이 있는 경우 `for` 이나 `xargs` 로 loop 돌기가 힘들다.
	- 이 공백을 delimiter 로 처리하기 때문.
	- `xargs` 의 경우에는 delimiter 옵션이 있지만, Mac (BSD) 버전에는 없다. ([참고](https://stackoverflow.com/a/19773922))
- 따라서 갓절수 없이 [[tr - 문자 대체하기|tr]] 로 공백을 바꿔치기 해야한다.
- 아래처럼 사용하면 된다.

```bash
for f in $(find . -type f | tr ' ' ':'); do
F=$(echo "$f" | tr ':' ' ')
# Do something...
done
```