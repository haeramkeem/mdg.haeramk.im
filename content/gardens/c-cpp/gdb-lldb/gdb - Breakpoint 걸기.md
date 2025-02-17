---
tags:
  - lldb
  - gdb
date: 2024-07-02
---
> [!tip]- `llvm` 명령어
> - Breakpoint 설정
>
> ```sh title="(lldb)"
> breakpoint set --file ${경로} --line ${줄 번호}
> ```
>
> - Breakpoint 리스트
>
> ```sh title="(lldb)"
> breakpoint list
> ```
>
> - Breakpoint 삭제
>
> ```sh title="(lldb)"
> breakpoint delete ${아이디}
> ```

## TL;DR

### Breakpoint 걸기

- `${줄 번호}` 로 거는게 더 편하자나 그치?
- `${경로}` 는 `CMakeLists.txt` 파일이 있는 경로 (보통 최상위 경로) 를 기준으로 해주니 잘 된다.

```bash
b ${경로}:${줄 번호}
```

### Breakpoint 조회

```bash
info break
```

### Breakpoint 삭제

```bash
del ${아이디}
```

### Breakpoint 대상 확인

- 인식된 파일 목록 확인하기:

```bash
info sources
```

- 인식된 함수 목록 확인하기:

```bash
info functions
```