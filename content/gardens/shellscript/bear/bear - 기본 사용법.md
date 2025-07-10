---
tags:
  - shellscript
  - bash-bear
date: 2025-07-10
aliases:
  - bear
  - clangd
  - compile_flags.txt
  - compile_commands.json
---
> [!info]- 참고한 것들
> - [어떤 사람의 Gist](https://gist.github.com/gtors/effe8eef7dbe7052b22a009f3c7fc434)
> - [공식 GitHub](https://github.com/rizsotto/Bear)

## TL;DR

> [!tip]- 설치
> - Ubuntu
> ```bash
> sudo apt-get install -y bear
> ```

```bash
bear -- ${컴파일 명령어}
```

## 배경지식...

- 우선 `clangd` 는 LLVM 프로젝트의 C, C++ language server 이다.
	- Language server 는 간단하게 생각하면 코드 에디터에서 문법 관련 기능들 (가령 code completion) 을 query 하는 서버라고 생각하면 된다.
	- 이때의 통신 프로토콜은 Language Server Protocol (LSP) 라고 부른다.
- 그리고 `clangd` 에게 각 파일들에 대한 compile 정보를 알려주는 파일이 `compile_flags.txt`, `compile_commands.json` 이다.
	- 이 파일들을 Compile Database 라고 부르는듯
- 근데 이 파일들을 직접 작성하는것은 너무 귀찮다. 그래서 Build EAR (BEAR) 라는 툴을 이용하면 `Makefile` 를 사용하는 프로젝트에서 이 파일을 간편하게 뽑아낼 수 있다.