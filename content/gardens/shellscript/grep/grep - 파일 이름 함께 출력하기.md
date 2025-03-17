---
tags:
  - bash-grep
date: 2025-03-17
---
> [!info]- 참고한 것들
> - [어떤 블로그](https://www.cyberciti.biz/faq/grep-from-files-and-display-the-file-name)

## TL;DR

- [[grep - 기본 사용법|grep]] 의 옵션으로는 파일 이름만 출력하거나, 아니면 matching 된 pattern 만 출력하거나 둘 중 하나이다.
- 하지만 여러개의 파일에 대해 grep 을 때릴 때, 파일 이름과 matching 결과를 출력하려면 어떻게 할까
- `grep` 은 여러개의 파일에 대해 사용하면 옵션을 주지 않아도 기본적으로 이런식으로 출력해준다.
- 여기에 추가적으로, `/dev/null` 도 추가해주면 파일이 하나여도 파일 이름을 같이 출력해줄 수 있다.

```bash
grep ${PATTERN} ${FILES} /dev/null
```