---
tags:
  - 쉘스크립트
  - bash-openssl
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/q/8343894)

## TL;DR

```bash
#!/bin/bash

key128="1234567890123456"
iv="1234567890123456"

echo "good" \
  | openssl enc -aes-128-cbc -K $key128 -iv $iv \
  | openssl enc -aes-128-cbc -d -K $key128 -iv $iv
```