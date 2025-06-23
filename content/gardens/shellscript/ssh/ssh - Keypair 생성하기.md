---
tags:
  - shellscript
  - bash-ssh
date: 2025-02-05
aliases:
  - ssh keypair 생성 가이드
---
## TL;DR

```
ssh-keygen
```

- 여기에 옵션을 몇개 더 추가하자면,
	- `-t`: Key 알고리즘
		- 요즘은 기본적으로 ED25519 로 생성해주는거같은데, 혹시 RSA 같은거 사용하고 싶으면 이걸 활용하면 된다.
	- `-b`: Key bit 사이즈
		- 예를 들어 RSA 2048 를 생성하고 싶다면, `-t rsa -b 2048` 로 하면 된다.
	- `-C`: Comment
		- 기본적으로는 `username@hostname` 의 comment 가 public key 뒤에 붙는다. 이게 꼴보기 싫다면 키 생성한 뒤에 직접 바꿔도 되지만 이 옵션으로 comment 를 바꿀 수도 있다.
	- `-N`: Passphrase 를 설정하는 옵션