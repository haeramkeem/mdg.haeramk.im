---
tags:
  - shellscript
  - bash-date
date: 2024-07-09
---
## TL;DR

- ISO8601 포맷은 `2024-01-01T00:00:00+00:00` 형식을 가진다.
- `-I` 옵션을 주면 되고, 이것만 하면 날짜만 나온다.

```bash
date -I
```

```
2024-07-09
```

- 특정 시간 단위까지 출력하고 싶을 때에는 `-I` 뒤에 다음의 것을 붙여주면 된다
	- `-Ihours`: 시간
	- `-Iminutes`: 분
	- `-Iseconds`: 초

```bash
date -Ihours
```

```
2024-07-09T12+09:00
```

```bash
date -Iminutes
```

```
2024-07-09T12:20+09:00
```

```bash
date -Iseconds
```

```
2024-07-09T12:20:42+09:00
```