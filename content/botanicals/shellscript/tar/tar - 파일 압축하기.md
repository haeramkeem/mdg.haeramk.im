---
tags:
  - 쉘스크립트
---
## 개요

- tar 로 파일들을 압축해 `.tar.gz` 압축파일로 만들어 보자.

## TL;DR!

```bash
tar -czvf ${압축파일이름}.tar.gz ${파일들 혹은 디렉토리}
```

- 옵션 설명
	- `-c`: Compress 의 c
	- `-z`: GZIP 으로 압축 ([[TAR vs GZIP - 뭔차이지?|왜?]])
	- `-v`: Verbose 의 v
	- `-f`: Input file 을 지정