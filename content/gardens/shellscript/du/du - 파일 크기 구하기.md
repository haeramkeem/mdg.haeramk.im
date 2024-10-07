---
tags:
  - shellscript
  - bash-du
date: 2024-08-23
---
> [!info]- 참고한 것들
> - [스댕](https://superuser.com/a/22462)
> - [어떤 블로그](https://linuxize.com/post/how-get-size-of-file-directory-linux/)

## TL;DR

- 파일 크기:

```bash
du -h /path/to/file
```

- 디렉토리 크기:

```bash
du -sh /path/to/directory
```

- 옵션 설명:
	- `-h`: Human-readable
	- `-s`: Directory 내의 entry 들의 사이즈를 모두 고려