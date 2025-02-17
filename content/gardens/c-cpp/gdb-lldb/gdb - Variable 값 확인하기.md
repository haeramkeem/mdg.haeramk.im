---
tags:
  - gdb
date: 2024-07-02
---
> [!info]- 참고한 것들
> - [스댕 - watch](https://stackoverflow.com/a/3099725)

## TL;DR

### 변수 값 확인

- 특정 변수값 보기

```sh title="(lldb)"
print ${변수명}
# 혹은
p ${변수명}
```

- 현재 프레임의 모든 변수값 보기
	- 참고로 이 명령어 뒤에도 `${변수명}` 을 붙여 위와 동일하게 변수값을 볼 수 있다

```sh title="(lldb)"
frame variable
# 혹은
fr v
```

### 변수 값 자동 출력

- Stop 시에 변수 값을 자동으로 출력하게 하려면 이렇게 하면 된다.

```sh title="(lldb)"
target stop-hook add -o "p ${변수명}"
```

- 변수 값이 바뀔때 마다 break 하며 변수 값 추적하기:

```sh title="(gdb)"
watch ${변수명}
```