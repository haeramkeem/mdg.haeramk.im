---
tags:
  - cpp
date: 2024-05-08
---
> [!info]- 참고한 것들
> - [스댕오버플로](https://stackoverflow.com/a/17201751)

## TL;DR!

```cpp
char c = 'a';
string s1{c};
// 혹은
string s2;
s2 = string{c};
```