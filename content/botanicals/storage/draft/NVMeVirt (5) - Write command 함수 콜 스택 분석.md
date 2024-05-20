
![[KakaoTalk_Photo_2024-05-15-19-46-04.png]]

- `nvme id-ns`

```
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
NVMeVirt:     +enter{func: 'nvmev_proc_admin_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_admin_cq [nvmev]'}
```

- `nvme write`

```
<-- nvme id-ns
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

NVMeVirt:     +enter{func: 'nvmev_proc_admin_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_admin_cq [nvmev]'}
-->
<-- nvme write
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
NVMeVirt:         +enter{func: 'advance_write_pointer [nvmev]'}
NVMeVirt:          +enter{func: '__get_wp [nvmev]'}
NVMeVirt:          -exit{func: '__get_wp [nvmev]'}
NVMeVirt:         -exit{func: 'advance_write_pointer [nvmev]'}
NVMeVirt:        -exit{func: 'conv_write [nvmev]'}
NVMeVirt:       -exit{func: 'conv_proc_nvme_io_cmd [nvmev]'}
NVMeVirt:       +enter{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        -exit{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        +enter{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__insert_req_sorted [nvmev]'}
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
NVMeVirt:      +enter{func: 'nvmev_proc_io_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_io_cq [nvmev]'}
-->
```

- `ppa`: Physical Page Addr
- `ipc`: Invalid page count (int)
- `vpc`: Valid page count (int)

- pq 정체? line 별로 gc?