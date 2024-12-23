---
tags:
  - lldb
  - gdb
date: 2024-12-16
---
## TL;DR

### Process 시작

```sh title="(gdb,lldb)"
run
```

### 다음 breakpoint 까지 이어서 진행

```sh title="(gdb,lldb)"
continue
# 혹은
c
```

### Next: 다음줄로 진행

```sh title="(gdb,lldb)"
n
```

### Step: 함수 호출

```sh title="(gdb,lldb)"
s
```

### 함수 Call Stack 확인

```sh title="(gdb)"
backtrace
```