---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://askubuntu.com/a/44124)

## 개요

- 물론 `apt upgrade` 를 하면 버전업이 되지만, 모든 패키지 버전이 업그레이드 되니까 이걸 치기에는 손발이 후달린다.
- 이럴때 패키지 하나만 버전업하는 방법.

## TL;DR

```bash
sudo apt-get install --only-upgrade ${패키지명}=${패키지버전}
```