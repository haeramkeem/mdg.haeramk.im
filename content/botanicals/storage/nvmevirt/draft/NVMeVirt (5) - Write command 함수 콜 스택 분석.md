
![[KakaoTalk_Photo_2024-05-15-19-46-04.png]]

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
NVMeVirt:         +enter{func: 'advance_write_pointer [nvmev]'} <<<
NVMeVirt:          +enter{func: '__get_wp [nvmev]'}
NVMeVirt:          -exit{func: '__get_wp [nvmev]'}
NVMeVirt:         -exit{func: 'advance_write_pointer [nvmev]'}
NVMeVirt:        -exit{func: 'conv_write [nvmev]'}
NVMeVirt:       -exit{func: 'conv_proc_nvme_io_cmd [nvmev]'}

NVMeVirt:       +enter{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        -exit{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        +enter{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__insert_req_sorted [nvmev]'} ->>> send worker

NVMeVirt:         +enter{func: '__do_perform_io [nvmev]'} <<<- recv worker
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

<-- nvme write completion queue
NVMeVirt:     +enter{func: 'nvmev_proc_io_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_io_cq [nvmev]'}
-->
```

- `ppa`: Physical Page Addr
- `ipc`: Invalid page count (int)
- `vpc`: Valid page count (int)

- pq 정체? line 별로 gc?

```bash
echo wtf | sudo nvme write /dev/nvme1n1 -z2048 -s128 -T2 -S3
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

```
1111111111111111100101001100000101000101010100000000000000000000
```

- [struct nvme_io_args](https://github.com/linux-nvme/libnvme/blob/master/src/nvme/api-types.h#L569-L631)
- [enum nvme_io_opcode](https://github.com/linux-nvme/libnvme/blob/master/src/nvme/types.h#L8236-L8278)

- `main.c` 의 `nvme_proc_dbs()` 에서 모든 doorbell 들을 돌며 변화가 있는지 체크