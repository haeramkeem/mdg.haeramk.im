---
tags:
  - 쉘스크립트
  - bash-column
date: 2024-07-02
---
> [!info]- 참고한 것들
> - [긱](https://www.geeksforgeeks.org/column-command-in-linux-with-examples/)

## TL;DR

```sh
cat << EOF | column -t -s '|'
No|Dish|Y/N
01|Idli|Y
02|Samosa|Y
EOF
```

- 실행하면 아래처럼 깔끔하게 나온다:

```
No  Dish    Y/N
01  Idli    Y
02  Samosa  Y
```