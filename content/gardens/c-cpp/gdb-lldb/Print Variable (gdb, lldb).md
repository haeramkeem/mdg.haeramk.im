---
tags:
  - lldb
date: 2024-07-02
---
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

### Stop 시에 변수값 자동 출력

```sh title="(lldb)"
target stop-hook add -o "p ${변수명}"
```