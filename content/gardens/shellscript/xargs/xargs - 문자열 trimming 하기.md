---
tags:
  - bash-xargs
date: 2025-03-17
---
> [!info]- 참고한 것들
> - [어떤 블로그](https://linuxhint.com/trim_string_bash/)

## TL;DR

- [[xargs - 기본 사용법|xargs]] 는 문자열을 trimming 하는데 사용할 수 있다.
- 가령 다음의 명령어를 실행하면

```bash
echo "    TRIM ME    " | xargs
```

- 결과는 다음과 같이 나온다:

![[Pasted image 20250317085716.png]]