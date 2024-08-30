---
tags:
  - shellscript
  - bash-tar
date: 2024-01-30
---
## 개요

- tar 로 `.tar.gz` 압축파일을 압축 해제해 보자.

## TL;DR!

```bash
tar -xzvf {압축파일이름}.tar.gz -C ${압축 풀 경로}
```

- 옵션 설명
	- `-x`: Extract 의 x
	- `-z`: GZIP 파일을 압축 해제 ([[TAR vs GZIP - 뭔차이지?|왜?]])
	- `-v`: Verbose 의 v
	- `-f`: Input file 을 지정
	- `-C`: 압축 해제 경로 (기본값은 현재 경로이다.)