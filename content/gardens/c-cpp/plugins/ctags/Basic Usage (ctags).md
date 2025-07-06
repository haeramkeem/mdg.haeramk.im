---
tags:
  - cpp
  - ctags
date: 2024-11-02
aliases:
  - ctags
---
> [!info]- 참고한 것들
> - [스댕 - universal-ctags 설치](https://askubuntu.com/a/1179548)

> [!info]- 설치
> - `apt`
>
> ```bash
> sudo apt-get install -y universal-ctags
> ```

## 개요

- C, C++ 소스코드를 `ctags` 로 tagging 하는 방법
- 맨날 까먹어서 정리해 둔다.

### Tagging

- C

```bash
ctags -R
```

- C++

```bash
ctags --c++-kinds=+p --fields=+iaS --extras=+q --language-force=C++ -R
```

### `vim` 사용법

- Definition 으로 움직이기

```
ctrl + ]
```

- 원위치

```
ctrl + t
```