---
tags:
  - lldb
date: 2024-07-02
---
## TL;DR

### Breakpoint 걸기

```sh title="(lldb)"
breakpoint set --file ${경로} --line ${줄 번호}
```

- `${줄 번호}` 로 거는게 더 편하자나 그치?
- `${경로}` 는 `CMakeLists.txt` 파일이 있는 경로 (보통 최상위 경로) 를 기준으로 해주니 잘 된다.

### Breakpoint 조회

```sh title="(lldb)"
breakpoint list
```

### Breakpoint 삭제

```sh title="(lldb)"
breakpoint delete ${아이디}
```

### 시작

```sh title="(lldb)"
run
```

### 이어서 진행

```sh title="(lldb)"
continue
# 혹은
c
```