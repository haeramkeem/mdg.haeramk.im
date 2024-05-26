---
tags:
  - c
  - linux-kernel
date: 2024-05-16
---
## TL;DR

- `main.c`

```c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>

void print_hello(void) {
  printk(KERN_INFO "Hello, kernel!\n");
}

void print_goodbye(void) {
  printk(KERN_INFO "Goodbye, kernel!\n");
}

static int __init hello_init(void) {
  print_hello();
  return 0;
}

static void __exit hello_exit(void) {
  print_goodbye();
}

MODULE_LICENSE("GPL");
module_init(hello_init);
module_exit(hello_exit);
```

- `Makefile`

```Makefile
KERNELDIR   := /lib/modules/$(shell uname -r)/build
PWD         := $(shell pwd)

obj-m       := hello.o
hello-objs  := main.o

default:
                $(MAKE) -C $(KERNELDIR) M=$(PWD) modules
clean:
                $(MAKE) -C $(KERNELDIR) M=$(PWD) clean
```

- 빌드

```bash
make
```

- 적재

```bash
sudo insmod ./hello.ko
```

- 확인

```bash
sudo journalctl -kn1
```

![[Pasted image 20240515200736.png]]