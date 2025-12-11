---
tags:
  - shellscript
  - bash-rg
date: 2025-12-11
aliases:
  - rg
---
> [!info]- `rg` 링크
> - [GitHub](https://github.com/BurntSushi/ripgrep)

> [!info]- 설치
> - Ubuntu
> ```bash
> sudo apt-get install -y ripgrep
> ```

## TL;DR

- `rg` 는 `ripgrep` 의 약자로, 기존의 [[grep - 기본 사용법|grep]] 보다 야무지게 빠르고 더 편하다고 한다.
	- 가령 `.gitignore` 은 걸러서 검색을 하는 등
- 사용할때는 그냥 키워드만 넣으면 된다.

```bash
rg ${키워드}
```

- 그럼 현재 디렉토리 (`.`) 기준으로 recursive 하게 찾는다.
- 근데 [[index|주인장]] 같은 정vim병자 같은 경우에는, 그냥 쓰면 불편하다.
	- 검색 결과가 `path:line` 형태로 나와줘야 바로 복붙해서 vim 으로 열 수 있기 때문.
- 그래서 이 옵션을 기본적으로 사용한다.

```bash
rg --no-heading --with-filename --line-number ${키워드}
```

- 그리고, 본인이 선호하는 언어가 있다면, 파일 확장자를 이렇게 지정할 수도 있다.

```bash
rg -g '*.{c,h,cpp,hpp,cc,cxx}' ${키워드}
```

- 그래서 이런 alias 를 만들어놓으면 편하다.

```bash
alias rg="rg --no-heading --with-filename --line-number -g '*.{c,h,cpp,hpp,cc,cxx}'"
```