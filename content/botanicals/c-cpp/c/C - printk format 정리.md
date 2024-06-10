---
tags:
  - c
  - linux-kernel
date: 2024-06-04
---
> [!info]- 참고한 것들
> - [커널닷오알지](https://www.kernel.org/doc/Documentation/printk-formats.txt)

## 개요

- `printk()` 함수에서 사용할 수 있는 formatting 정리해보기
- 인데, `printf()` 에서도 사용할 수 있는 (POSIX 표준?) 애들은 제외한다.

## Symbols/Function Pointers

- 얘네들은 pointer 를 받아 원래의 symbol (변수명, 함수명 등) 으로 formatting 해주는 것이다.

| FORMAT SPECIFIERS | FORMAT                              | DESC                       |
| ----------------- | ----------------------------------- | -------------------------- |
| `%pF`             | versatile_init+0x0/0x110            | `%p` 랑 똑같이 나온다. 걍 포인터인듯    |
| `%pf`             | versatile_init                      | ?? 이런건 없다는데?               |
| `%pS`             | versatile_init+0x0/0x110            | 함수 이름 + 뭐 같이 나오는데 뭔지는 모르겠음 |
| `%pSR`            | versatile_init+0x9/0x110            | `%pSR` 과 똑같이 나온다.          |
| `%ps`             | versatile_init                      | 함수 이름만 간단하게                |
| `%pB`             | prev_fn_of_versatile_init+0x88/0x88 | 이전 콜스택의 함수이름?              |

- 함 해보자
- `main.c`:

```c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>

static int __init fn_init(void) {
	void* ptr = (void*)fn_init;

	printk(KERN_INFO "%p\n", ptr);
	printk(KERN_INFO "%pF\n", ptr);
	printk(KERN_INFO "%pf\n", ptr);
	printk(KERN_INFO "%pS\n", ptr);
	printk(KERN_INFO "%pSR\n", ptr);
	printk(KERN_INFO "%ps\n", ptr);
	printk(KERN_INFO "%pB\n", ptr);

	return 0;
}

static void __exit fn_exit(void) {
	printk("exited.");
}

MODULE_LICENSE("GPL");
module_init(fn_init);
module_exit(fn_exit);
```

- `Makefile`

```Makefile
KERNELDIR	:= /lib/modules/$(shell uname -r)/build
PWD		:= $(shell pwd)

obj-m		:= practice.o
practice-objs	:= main.o

default:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) modules
clean:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) clean
```

- 빌드 & 적재

```bash
make && sudo insmod ./practice.ko
```

- 확인

```bash
sudo journalctl -k
```

![[Pasted image 20240604103911.png]]