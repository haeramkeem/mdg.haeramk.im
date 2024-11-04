---
tags:
  - cpp
  - ctags
date: 2024-11-02
---
> [!info]- 참고한 것들
> - [스댕 - universal-ctags 설치](https://askubuntu.com/a/1179548)

## 개요

- C, C++ 소스코드를 `ctags` 로 tagging 하는 방법
- 맨날 까먹어서 정리해 둔다.

### 설치

```bash
sudo apt install -y universal-ctags
```

### Tagging

- C

```bash
ctags -R
```

- C++

```bash
ctags --c++-kinds=+p --fields=+iaS --extras=+q --language-force=C++ -R
```