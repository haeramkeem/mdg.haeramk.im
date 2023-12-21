---
tags:
  - 쉘스크립트
---
> [!info] [출처](https://www.howtouselinux.com/post/tcpdump-ports)
## 개요

- `tcpdump` 를 사용할 때, 포트를 지정하지 않으면 모든 포트에 대한 패킷을 캡쳐한다.
- 근데 문제는 이 양이 너무 많아서 보기 힘들다는 것.
- 그래서 이렇게 하면 포트 번호로 필터링이 가능하다:

## TL;DR!

```bash
tcpdump port ${PORT_NUM}
```

- 뭐 예를 들어 DNS 쿼리를 캡쳐하고 싶다면,

```bash
tcpdump port 53
```

- 이렇게 하면 되것지?