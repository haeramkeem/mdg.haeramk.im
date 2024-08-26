---
tags:
  - 삽질록
  - nvme
  - nvmevirt
  - storage
date: 2024-06-04
---
> [!fail] 단순한 메모글입니다.

## GC procedure

- `do_gc`
	- `foreground_gc`
		- `check_and_refill_write_credit`: `wfc->write_credits <= 0` 일때 GC
			- `conv_write`

- `gc_thres_lines`, `gc_thres_lines_high` == 2 ([conv_init_params()](https://github.com/snu-csl/nvmevirt/blob/main/conv_ftl.c#L366-L373))

![[KakaoTalk_Photo_2024-05-15-19-46-04.png]]

- ch: 8
- luns: 2/ch
- pln: 1/lun
- line: 8192
- pgs
- wfc.credits_to_refill == pgs_per_line
- write