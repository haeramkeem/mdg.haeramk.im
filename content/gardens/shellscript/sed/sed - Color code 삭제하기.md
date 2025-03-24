---
tags:
  - bash-sed
  - shellscript
date: 2025-03-24
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/18000433)

## TL;DR

- 터미널에서 종종 색깔이 들어간 글자들을 볼 수 있다.
	- 대표적으로 `git diff` 를 생각하면 된다.
	- 참고: [[ls - Color code 비활성화하기]], [[less - Color code 보여주기]]
- 이것은 사실 color code 가 삽입되어서 화면에 뿌릴 때 이 색깔을 추가하는 것이다.
- 따라서 이런 텍스트를 redirect 등으로 파일로 저장하거나 하면 이 color code 가 다 저장되어서 읽기 힘든 상태가 되기도 한다.
- 이때 다음과 같이 sed 로 이 color code 를 지워줄 수 있다:

```bash
sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]//g"
```