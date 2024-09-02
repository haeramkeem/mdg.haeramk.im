---
tags:
  - shellscript
  - bash-list
date: 2024-04-23
---
## 개요

- Bash list 기본 문법

## STL;DRE

```bash
LIST=(
	"value1"
	"value2"
	"value3"
)

# Print first
echo "${LIST[0]}"

# Print all
echo "${LIST[@]}"
```