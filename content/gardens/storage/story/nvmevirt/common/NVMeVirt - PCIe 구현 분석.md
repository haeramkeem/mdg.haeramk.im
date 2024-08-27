---
tags:
  - storage
  - story
  - nvmevirt
date: 2024-08-27
---
## MMIO 확인

### MSIx table

- `nvmev_dev->msix_table` = `pci.c`/`__create_pci_bus()`

```c
nvmev_vdev->msix_table =
	memremap(
		pci_resource_start(nvmev_vdev->pdev, 0) + PAGE_SIZE * 2,
		NR_MAX_IO_QUEUE * PCI_MSIX_ENTRY_SIZE,
		MEMREMAP_WT
	);
```

### BAR

- `nvmev_dev->bars` = `pci.c`/`__init_nvme_ctrl_regs()`

```c
struct nvme_ctrl_regs *bar =
	memremap(
		pci_resource_start(dev, 0),
		PAGE_SIZE * 2,
		MEMREMAP_WT
	);
```

### Doorbell

- `nvmev_dev->dbs` = `pci.c`/`__init_nvme_ctrl_regs()`

```c
nvmev_vdev->dbs = ((void *)bar) + PAGE_SIZE;
```

### Admin SQ, CQ

- `nvmev_dev->nvmev_admin_queue->nvmev_sq` = `pci.c`/`nvmev_proc_bars()`
	- `nvme_sq` 는 2차원 배열이고 여기를 `kcalloc()` 으로 공간을 할당해둔 뒤,
	- BAR 의 ASQ (Admin SQ Base Address) 필드의 값을 4Ki 단위로 바꿔서 PFN 으로 바꿔주고
	- 그것을 `pfn_to_page()` 를 이용해 `struct page` 로 바꿔준 뒤
		- `struct page` 는 physical page 를 대변하는 linux 의 자료구조이다.
	- 그것을 `page_address()` 를 이용해 virtual address 에 매핑해준다.

![[Pasted image 20240827211421.png]]
> NVMe base spec section 3.1.

```c
queue->nvme_sq =
	kcalloc(num_pages, sizeof(struct nvme_command *), GFP_KERNEL);
for (i = 0; i < num_pages; i++) {
	queue->nvme_sq[i] =
		page_address(pfn_to_page(nvmev_vdev->bar->u_asq >> PAGE_SHIFT) + i);
}
```

- `nvmev_dev->nvmev_admin_queue->nvmev_cq` = `pci.c`/`nvmev_proc_bars()`
	- `nvmev_cq` 와 마찬가지의 과정으로 BAR 의 ACQ 를 virtual addr 에 매핑해서 사용한다.

```c
queue->nvme_cq =
	kcalloc(num_pages, sizeof(struct nvme_completion *), GFP_KERNEL);
for (i = 0; i < num_pages; i++) {
	queue->nvme_cq[i] =
		page_address(pfn_to_page(nvmev_vdev->bar->u_acq >> PAGE_SHIFT) + i);
}
```

### IO SQ, CQ

- `nvmev_dev->nvmev_submission_queue->sq` = `admin.c`/`__nvmev_admin_create_sq()`
	- 초기화시에 create admin SQ command 가 반복적으로 들어오는 방식으로 생성됨
		- 일단 core 마다 한개씩 command 를 보내나 본데
		- Admin SQ, CQ 가 이미 생성된 상황이라 admin command 를 보내는 것이 가능해 [[Physical Region Page, PRP (NVMe)|PRP]] 에다가 SQ, CQ 위치를 넣어 보내는 듯
	- Admin SQ, CQ 에서처럼 `memremap` 이 아니라 `kzalloc` 으로 공간할당받은 다음 전달받은 PRP 를 virtual addr 에 매핑해 사용함

```c
sq->sq = kzalloc(sizeof(struct nvme_command *) * num_pages, GFP_KERNEL);
for (i = 0; i < num_pages; i++) {
	sq->sq[i] = prp_address_offset(cmd->prp1, i);
}
```

```c
#define prp_address_offset(prp, offset) \
	(page_address(pfn_to_page(prp >> PAGE_SHIFT) + offset) + (prp & ~PAGE_MASK))
```

- `nvmev_dev->nvmev_submission_queue->cq` = `admin.c`/`__nvmev_admin_create_cq()`
	- 위에랑 마찬가지

```c
cq->cq = kzalloc(sizeof(struct nvme_completion *) * num_pages, GFP_KERNEL);
for (i = 0; i < num_pages; i++) {
	cq->cq[i] = prp_address_offset(cmd->prp1, i);
}
```