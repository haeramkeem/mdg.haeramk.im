---
tags:
  - 삽질록
  - storage
  - nvme
  - nvmevirt
date: 2024-06-04
---
> [!info]- 참고한 것들
> - [논문 (FAST '23)](https://www.usenix.org/conference/fast23/presentation/kim-sang-hoon)
> - [GItHub](https://github.com/snu-csl/nvmevirt)
> - [유투브 저자직강](https://youtu.be/eV7vQyg46zc?si=USiYITI09Sdz01YZ)

> [!tip] [[NVMeVirt (4) - FDP 디버깅 기록|이전 글]]

> [!warning] 이걸 어떻게 정리해야 할지 몰라 끄적이는 메모글입니다.

> [!tip]- Code ref
> - [깃허브](https://github.com/aos24s-cse-snu-ac-kr/nvmevirt/pull/1)

## 메모,,

- NVMeVirt 전체 구조

![[KakaoTalk_Photo_2024-05-15-19-46-04.png]]

---
- `nvme write` function call stack

```
<-- nvme admin submission queue
NVMeVirt:     +enter{func: 'nvmev_proc_admin_sq [nvmev]'}
NVMeVirt:      +enter{func: '__nvmev_proc_admin_req [nvmev]'}
NVMeVirt:       +enter{func: '__nvmev_admin_identify [nvmev]'}
NVMeVirt:        +enter{func: '__nvmev_admin_identify_namespace [nvmev]'}
NVMeVirt:         +enter{func: '__make_cq_entry [nvmev]'}
NVMeVirt:          +enter{func: '__make_cq_entry_results [nvmev]'}
NVMeVirt:          -exit{func: '__make_cq_entry_results [nvmev]'}
NVMeVirt:         -exit{func: '__make_cq_entry [nvmev]'}
NVMeVirt:        -exit{func: '__nvmev_admin_identify_namespace [nvmev]'}
NVMeVirt:       -exit{func: '__nvmev_admin_identify [nvmev]'}
NVMeVirt:      -exit{func: '__nvmev_proc_admin_req [nvmev]'}
NVMeVirt:      +enter{func: 'nvmev_signal_irq [nvmev]'}
NVMeVirt:       +enter{func: '__process_msi_irq [nvmev]'}
NVMeVirt:        +enter{func: '__signal_irq [nvmev]'}
NVMeVirt:        -exit{func: '__signal_irq [nvmev]'}
NVMeVirt:       -exit{func: '__process_msi_irq [nvmev]'}
NVMeVirt:      -exit{func: 'nvmev_signal_irq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_admin_sq [nvmev]'}
-->

<-- nvme admin completion queue
NVMeVirt:     +enter{func: 'nvmev_proc_admin_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_admin_cq [nvmev]'}
-->

<-- nvme write submission queue
NVMeVirt:     +enter{func: 'nvmev_proc_io_sq [nvmev]'}
NVMeVirt:      +enter{func: '__nvmev_proc_io [nvmev]'}
  <-- Command 처리
NVMeVirt:       +enter{func: 'conv_proc_nvme_io_cmd [nvmev]'}
NVMeVirt:        +enter{func: 'conv_write [nvmev]'}
NVMeVirt:         +enter{func: 'buffer_allocate [nvmev]'}
NVMeVirt:         -exit{func: 'buffer_allocate [nvmev]'}
NVMeVirt:         +enter{func: 'ssd_advance_write_buffer [nvmev]'}
NVMeVirt:          +enter{func: 'ssd_advance_pcie [nvmev]'}
NVMeVirt:           +enter{func: 'chmodel_request [nvmev]'}
NVMeVirt:           -exit{func: 'chmodel_request [nvmev]'}
NVMeVirt:          -exit{func: 'ssd_advance_pcie [nvmev]'}
NVMeVirt:         -exit{func: 'ssd_advance_write_buffer [nvmev]'}
NVMeVirt:         +enter{func: 'mark_page_invalid [nvmev]'}
NVMeVirt:         -exit{func: 'mark_page_invalid [nvmev]'}
NVMeVirt:         +enter{func: 'ppa2pgidx [nvmev]'}
NVMeVirt:         -exit{func: 'ppa2pgidx [nvmev]'}
NVMeVirt:         +enter{func: 'get_new_page [nvmev]'}
NVMeVirt:          +enter{func: '__get_wp [nvmev]'}
NVMeVirt:          -exit{func: '__get_wp [nvmev]'}
NVMeVirt:         -exit{func: 'get_new_page [nvmev]'}
NVMeVirt:         +enter{func: 'ppa2pgidx [nvmev]'}
NVMeVirt:         -exit{func: 'ppa2pgidx [nvmev]'}
NVMeVirt:         +enter{func: 'mark_page_valid [nvmev]'}
NVMeVirt:         -exit{func: 'mark_page_valid [nvmev]'}
NVMeVirt:         +enter{func: 'advance_write_pointer [nvmev]'}
NVMeVirt:          +enter{func: '__get_wp [nvmev]'}
NVMeVirt:          -exit{func: '__get_wp [nvmev]'}
NVMeVirt:         -exit{func: 'advance_write_pointer [nvmev]'}
NVMeVirt:        -exit{func: 'conv_write [nvmev]'}
NVMeVirt:       -exit{func: 'conv_proc_nvme_io_cmd [nvmev]'}
  -->
  <-- Worker thread 에 request 보냄
NVMeVirt:       +enter{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        -exit{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        +enter{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__insert_req_sorted [nvmev]'}
  -->
  <-- Worker thread 에서 받음
NVMeVirt:         +enter{func: '__do_perform_io [nvmev]'}
NVMeVirt:        -exit{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:        -exit{func: '__do_perform_io [nvmev]'}
NVMeVirt:        -exit{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:        +enter{func: '__fill_cq_result [nvmev]'}
NVMeVirt:       -exit{func: '__nvmev_proc_io [nvmev]'}
NVMeVirt:       -exit{func: '__fill_cq_result [nvmev]'}
NVMeVirt:      -exit{func: 'nvmev_proc_io_sq [nvmev]'}
NVMeVirt:      +enter{func: '__process_msi_irq [nvmev]'}
NVMeVirt:      +enter{func: '__signal_irq [nvmev]'}
NVMeVirt:      -exit{func: '__signal_irq [nvmev]'}
NVMeVirt:     -exit{func: '__process_msi_irq [nvmev]'}
  -->
-->

<-- nvme write completion queue
NVMeVirt:     +enter{func: 'nvmev_proc_io_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_io_cq [nvmev]'}
-->
```

- 위의 func callstack 에서 알아낸 내용
	- `main.c` 의 `nvme_proc_dbs()` 에서 모든 doorbell 들을 돌며 변화가 있는지 체크
---
- 몇가지 별다줄들
	- `ppa`: Physical Page Addr
	- `ipc`: Invalid page count (int)
	- `vpc`: Valid page count (int)
	- `rmap`: Reverse mapping table
	- `nr_parts`: namespace partitions -> partition 당 ftl instance 가 하나씩 생기나.. 뭔지 알 수 없어서 1로 변경
---
- Write command 시 `nvmev_rw_command` 구조체에 담기는 내용

```bash
echo helpme | sudo nvme write /dev/nvme1n1 -z2048 -s128 -T2 -S3
```

```
NVMeVirt: __u8    opcode;       01
NVMeVirt: __u8    flags;        00
NVMeVirt: __u16   command_id;   4140
NVMeVirt: __le32  nsid;         00000001
NVMeVirt: __u64   rsvd2;        0000000000000000
NVMeVirt: __le64  metadata;     0000000000000000
NVMeVirt: __le64  prp1;         0000000203ab6000
NVMeVirt: __le64  prp2;         0000000000000000
NVMeVirt: __le64  slba;         0000000000000080
NVMeVirt: __le16  length;       0003
NVMeVirt: __le16  control;      0020
NVMeVirt: __le32  dsmgmt;       00030000
NVMeVirt: __le32  reftag;       00000000
NVMeVirt: __le16  apptag;       0000
NVMeVirt: __le16  appmask;      0000
```

- libnvme 에서 추가적인 설명들을 찾았다:
	- [각 필드 설명](https://github.com/linux-nvme/libnvme/blob/master/src/nvme/api-types.h#L569-L631)
	- [opcode enum 설명](https://github.com/linux-nvme/libnvme/blob/master/src/nvme/types.h#L8249-L8291)
- FDP 관련 값은 이래 뽑아내면 된다
	- `(cmd->rw.control >> 4) & 0xFF` == DTYPE (FDP)
	- `(cmd->rw.dsmgmt >> 16) & 0xFFFF` == DSPEC (RUH ID)
---
- `__do_perform_io` 는 건들 필요 없음
	- `ns.mapped` 는 mmap (reserve 된 공간) 의 시작주소 (...물론 1MB 뒤)
	- offset 은 `slba << 9` 로 초기화되어 `io_size` 만큼 늘어남
	- 아래 그림을 보시라

![[Pasted image 20240523203013.png]]

---
- 몇가지 상수값들
	- Page: 4Ki (4096byte)
	- LBA: 512byte
	- `BLKS_PRE_PLN` == Line 개수 == `8192`
---
- `__get_wp` 를 바꾸면 될 것 같아 이놈을 바꿨을 때 영향받을 놈들을 역추적

```
+ __get_wp
	+ prepare_write_pointer
		+ conv_init_ftl
			+ conv_init_namespace ($)
	+ advance_write_pointer
		+ gc_write_page (*)
			+ clean_one_block: 이 함수는 어디서도 호출되지 않는다
			+ clean_one_flashpg
				+ do_gc
					+ foreground_gc
						+ check_and_refill_write_credit
							+ conv_write (#)
		+ conv_write (#)
			+ conv_proc_nvme_io_cmd
	+ get_new_page
		+ gc_write_page (*)
		+ conv_write (#)
```

- 보면 다음 정도로 정리해볼 수 있을듯
	- `($)`: NVMeVirt init 시에 호출됨
	- `(*)`: GC 시에 호출됨
	- `(#)`: Write 시에 호출됨
- 추가적으로, 각 line 들을 초기화하는 것은 `init_lines` 에서 담당한다.
	- ...는 `conv_init_ftl` 에서 호출됨