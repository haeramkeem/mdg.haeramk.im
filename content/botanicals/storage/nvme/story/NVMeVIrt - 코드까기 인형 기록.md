---
tags:
  - 삽질록
  - NVMe
  - NVMeVirt
  - Storage
date: 2024-04-24
---

- 모든 debugging 로그 출력
	- `nvmev.h` L31 ~ L32

```c
#define CONFIG_NVMEV_DEBUG
#define CONFIG_NVMEV_DEBUG_VERBOSE
```

- 한번 Write 시 journal

```bash
echo 'bhc vs kfc' \
	| sudo nvme write /dev/nvme1n1 -s 0 -z 512 \
	&& sudo nvme read /dev/nvme1n1 -s 0 -z 512
```

```
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: __nvmev_proc_admin_req: 7 0x6 0x301d
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: irq: msi 39, vector 36
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: [W] 0 + 0, prp 23214d000 0
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: nvmev_io_worker_0/302[1], sq 2 cq 2, entry 206, 13207252616726 + 623
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: __reclaim_completed_reqs: 301 -- 301, 1
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: nvmev_io_worker_0: copied 302, 2 2 206
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: nvmev_io_worker_0: completed 302, 2 2 206
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: irq: msi 41, vector 39
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: __nvmev_proc_admin_req: 8 0x6 0x401c
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: irq: msi 39, vector 36
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: [R] 0 + 0, prp 20aee4000 0
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: nvmev_io_worker_0/303[2], sq 2 cq 2, entry 207, 13207259919175 + 1254
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: __reclaim_completed_reqs: 302 -- 302, 1
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: nvmev_io_worker_0: copied 303, 2 2 207
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: nvmev_io_worker_0: completed 303, 2 2 207
Apr 24 11:55:37 nvmevirt kernel: NVMeVirt: irq: msi 41, vector 39
```

- DEBUG 메세지 포맷 변경

- `NVMEV_DEBUG()`, `nvmev.h` L32

- 이전

```c
#define NVMEV_DEBUG(string, args...) printk(KERN_INFO "%s: " string, NVMEV_DRV_NAME, ##args)
```

- 이후

```c
#define NVMEV_DEBUG(string, args...) printk(KERN_INFO "%s{file: '%s', line: %d, func: '%s'}: " string, NVMEV_DRV_NAME, __FILE__, __LINE__, __func__, ##args)
```

- `NVMEV_DEBUG()`, `nvmev.h` L37
- 이전

```c
#define NVMEV_DEBUG_VERBOSE(string, args...) printk(KERN_INFO "%s: " string, NVMEV_DRV_NAME, ##args)
```

- 이후

```c
#define NVMEV_DEBUG_VERBOSE(string, args...) printk(KERN_INFO "%s{file: '%s', line: %d, func: '%s'}: " string, NVMEV_DRV_NAME, __FILE__, __LINE__, __func__, ##args)
```

```
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/admin.c', line: 553, func: '__nvmev_proc_admin_req'}: __nvmev_proc_admin_req: 20 0x6 0x1008
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/pci.c', line: 43, func: '__signal_irq'}: irq: msi 39, vector 36
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/simple_ftl.c', line: 15, func: '__cmd_io_size'}: [W] 0 + 0, prp 238c2b000 0
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 294, func: '__enqueue_io_req'}: nvmev_io_worker_0/60[1], sq 2 cq 2, entry 53, 16568027511718 + 543
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 396, func: '__reclaim_completed_reqs'}: __reclaim_completed_reqs: 59 -- 59, 1
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 620, func: 'nvmev_io_worker'}: nvmev_io_worker_0: copied 60, 2 2 53
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 634, func: 'nvmev_io_worker'}: nvmev_io_worker_0: completed 60, 2 2 53
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/pci.c', line: 43, func: '__signal_irq'}: irq: msi 41, vector 39
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/admin.c', line: 553, func: '__nvmev_proc_admin_req'}: __nvmev_proc_admin_req: 21 0x6 0x4000
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/pci.c', line: 43, func: '__signal_irq'}: irq: msi 39, vector 36
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/simple_ftl.c', line: 15, func: '__cmd_io_size'}: [R] 0 + 0, prp 234de1000 0
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 294, func: '__enqueue_io_req'}: nvmev_io_worker_0/61[2], sq 1 cq 1, entry 7, 16568035882333 + 373
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 396, func: '__reclaim_completed_reqs'}: __reclaim_completed_reqs: 60 -- 60, 1
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 620, func: 'nvmev_io_worker'}: nvmev_io_worker_0: copied 61, 1 1 7
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/io.c', line: 634, func: 'nvmev_io_worker'}: nvmev_io_worker_0: completed 61, 1 1 7
Apr 24 12:51:38 nvmevirt kernel: NVMeVirt{file: '/home/toor/nvmevirt/pci.c', line: 43, func: '__signal_irq'}: irq: msi 40, vector 38
```

- kernel update 먼저 해야 함
	- nvme 설치 후 kernel update 시 정상적으로 작동하지 않을 수 있음