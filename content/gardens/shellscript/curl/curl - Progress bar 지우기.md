---
tags:
  - 쉘스크립트
  - bash-curl
date: 2024-01-30
---
> [!info] [출처](https://stackoverflow.com/a/7373922)

## 개요

- [[curl - 기본 사용법|curl]] 을 그냥 사용하면 상관없는데,
- 파일로 리다이렉트 시키거나 [[watch - 김해람의 꿀조합|watch]] 같은 걸로 돌리면 Progress bar 가 나오곤 한다.
	- 뭐 이런식으로

![[Pasted image 20240130083733.png]]

- 근데 이게 거슬리다면, 요렇게 하면 된다.

## TL;DR!

```bash
curl -s ${URL}
```

- 만약 위의 방법이 안먹히면, Progress bar 는 표준에러로 출력되므로 이걸 죽여주면 된다.

```bash
curl ${URL} 2> /dev/null
```