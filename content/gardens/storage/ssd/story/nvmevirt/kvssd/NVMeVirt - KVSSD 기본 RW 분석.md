---
tags:
  - nvmevirt
  - nvme-kvssd
date: 2024-08-01
---
> [!info]- 참고한 것들
> - [NVMe 공식문서](https://nvmexpress.org/wp-content/uploads/NVM-Express-Key-Value-Command-Set-Specification-1.0d-2024.01.03-Ratified.pdf)

## 일반 NVMe write command 보내보기

- 일반 NVMe write command 실행시 call stack 을 보면 [[NVMeVirt (5) - Write command 함수 콜 스택 분석|고급운영체제 프로젝트]] 에서와 유사하게 나온다.

```
# NVMe admin submission queue
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

# NVMe admin completion queue
NVMeVirt:     +enter{func: 'nvmev_proc_admin_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_admin_cq [nvmev]'}

# NVMe write submission queue
NVMeVirt:     +enter{func: 'nvmev_proc_io_sq [nvmev]'}
NVMeVirt:      +enter{func: '__nvmev_proc_io [nvmev]'}
## KVSSD process cmd
NVMeVirt:       +enter{func: 'kv_proc_nvme_io_cmd [nvmev]'}
NVMeVirt:        +enter{func: '__cmd_io_size [nvmev]'}
NVMeVirt:        -exit{func: '__cmd_io_size [nvmev]'}
NVMeVirt:        +enter{func: '__schedule_io_units [nvmev]'}
NVMeVirt:        -exit{func: '__schedule_io_units [nvmev]'}
NVMeVirt:       -exit{func: 'kv_proc_nvme_io_cmd [nvmev]'}
## Enqueue to worker
NVMeVirt:       +enter{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        -exit{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        +enter{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:       -exit{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:       +enter{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:       -exit{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:      -exit{func: '__nvmev_proc_io [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_io_sq [nvmev]'}

# Worker thread execution
NVMeVirt:     +enter{func: 'kv_identify_nvme_io_cmd [nvmev]'}
NVMeVirt:     -exit{func: 'kv_identify_nvme_io_cmd [nvmev]'}
NVMeVirt:     +enter{func: '__do_perform_io [nvmev]'}
NVMeVirt:     -exit{func: '__do_perform_io [nvmev]'}
NVMeVirt:     +enter{func: '__fill_cq_result [nvmev]'}
NVMeVirt:     -exit{func: '__fill_cq_result [nvmev]'}
(Note that the func `nvmev_signal_irq_muted()` is muted)
NVMeVirt:     +enter{func: '__process_msi_irq [nvmev]'}
NVMeVirt:      +enter{func: '__signal_irq [nvmev]'}
NVMeVirt:      -exit{func: '__signal_irq [nvmev]'}
NVMeVirt:     -exit{func: '__process_msi_irq [nvmev]'}

# NVMe write completion queue
NVMeVirt:      +enter{func: 'nvmev_proc_io_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_io_cq [nvmev]'}
```

## KVSSD `store`, `retrieve` command 보내기 + 콜스택 확인

### Script

- 아래의 스크립트는 KVSSD 에 KV 를 store 하고 retrieve 하는 것이다.
- 여기서 삽질한 것을 좀 정리해보자.

```bash title="store_retrieve.sh"
#!/bin/bash

set -e

DEV=/dev/nvme1n1

VAL="$(uuidgen)"
VAL_LEN=$(echo -n "${VAL}" | wc -c)

UUID=$(echo -n "${VAL}" | tr -d '-')
KEY0=$(echo -n "${UUID}" | sed -E 's|(.{4})(.{4})(.{4})(.{3})(.*)|\1|g')
KEY1=$(echo -n "${UUID}" | sed -E 's|(.{4})(.{4})(.{4})(.{3})(.*)|\2|g')
KEY2=$(echo -n "${UUID}" | sed -E 's|(.{4})(.{4})(.{4})(.{3})(.*)|\3|g')
KEY3=$(echo -n "${UUID}" | sed -E 's|(.{4})(.{4})(.{4})(.{3})(.*)|\4|g')

KEY="${KEY0}${KEY1}${KEY2}${KEY3}"
KEY_LEN=$(echo -n "${KEY}" | wc -c)

echo -n "${VAL}" | \
sudo nvme io-passthru ${DEV} \
--opcode="0x81" \
--cdw10="${VAL_LEN}" \
--cdw11="${KEY_LEN}" \
--cdw12="0x$(echo -n "${KEY0}" | rev | xxd -p)" \
--cdw13="0x$(echo -n "${KEY1}" | rev | xxd -p)" \
--cdw14="0x$(echo -n "${KEY2}" | rev | xxd -p)" \
--cdw15="0x$(echo -n "${KEY3}" | rev | xxd -p)" \
--namespace-id=1 \
--data-len="${VAL_LEN}" \
-svw

sudo nvme io-passthru ${DEV} \
--opcode="0x90" \
--cdw10="${VAL_LEN}" \
--cdw11="${KEY_LEN}" \
--cdw12="0x$(echo -n "${KEY0}" | rev | xxd -p)" \
--cdw13="0x$(echo -n "${KEY1}" | rev | xxd -p)" \
--cdw14="0x$(echo -n "${KEY2}" | rev | xxd -p)" \
--cdw15="0x$(echo -n "${KEY3}" | rev | xxd -p)" \
--namespace-id=1 \
--data-len="${VAL_LEN}" \
-svr
```

#### `opcode`

- opcode 정보:
	- Store: [`0x81`](https://github.com/snu-csl/nvmevirt/blob/main/nvme.h#L323)
	- Retrieve: [`0x90`](https://github.com/snu-csl/nvmevirt/blob/main/nvme.h#L325)
- 하지만 NVMe spec 에는 opcode 가 다르게 나온다. 

![[Pasted image 20240802135946.png]]

- 이건 (1) 주인장이 NVMe spec 에 나온 저 opcode 표를 잘못 해석하고 있거나 (2) NVMeVirt 구현에서 (나름의 이유로) 다른 opcode 를 정의해서 사용하거나 정도의 이유일 것 같다.

#### Key

##### Command Dwords

- Key 는 CDW 4개를 이용해 명시한다.
	- 각 CDW 는 4byte 이므로, key 를 4byte 씩 끊어서 4개의 CDW 에 넣어야 한다.
	- 따라서 key 의 최대 길이는 16byte 가 된다는 것을 알 수 있다.
- NVMe spec 에는 CDW 2, 3, 14, 15 를 이용한다고 되어 있는데,

![[Pasted image 20240802135355.png]]

- NVMeVirt 에는 CDW 12, 13, 14, 15 를 받는다. ([참고](https://github.com/snu-csl/nvmevirt/blob/main/nvme_kv.h#L37-L45))
- 이것 또한 [[#`opcode`|위]] 와 동일하게 (1) 주인장이 뭔가 잘못 생각하고있거나 (2) 나름의 이유에 따라 spec 과 다르게 구현되어 있거나 둘 중 하나일 것이다.
- Key 값의 길이는 CDW 11 에 넣어준다.

![[Pasted image 20240802140844.png]]

- Spec 상으로는 16byte 의 key 를 설정할 수 있지만, NVMeVirt 에서는 `memcpy` 에서 buffer overflow 가 발생해서 15byte 까지만 가능하다.
	- 이건 아마 c-style string 의 `\0` suffix 때문이지 않을까 싶다.

##### Byte 순서

- 위 스크립트를 보면 CDW 에 문자들이 역순으로 들어가는 것을 (`rev`) 볼 수 있다.

```bash title="store_retrieve.sh:L24-27"
--cdw12="0x$(echo -n "${KEY0}" | rev | xxd -p)" \
--cdw13="0x$(echo -n "${KEY1}" | rev | xxd -p)" \
--cdw14="0x$(echo -n "${KEY2}" | rev | xxd -p)" \
--cdw15="0x$(echo -n "${KEY3}" | rev | xxd -p)" \
```

- 이건 아마 각 CDW 에 저장되는 bit 들이 역순이기 때문이지 않을까:
	- 위의 Key CDW 설명 "Command Dword 2 contains bits 31:00" 에서 보면 bit 가 0-31 이 아니라 31-0 으로 되어 있다.
	- 물론 확실한 것은 아님; 그냥 추정이고, 더 파볼 수 있지만 일단 패스..

#### Value

- Value 는 일반 NVMe write 와 동일하게 받는다.
	- 즉, `nvme` CLI 기준, 파일 경로를 명시하거나 표준입력을 사용하면 된다.
- 이 데이터를 코드상에서 접근할 때에는 `nvmev_vdev->storage_mapped + offset` 로 접근 할 수 있다 ([코드](https://github.com/snu-csl/nvmevirt/blob/main/kv_ftl.c#L613-L614)).

```c
printk(KERN_INFO "[%s] data='%s'", __func__, nvmev_vdev->storage_mapped + offset);
```

### 콜스택

```
# NVMe KVSSD store
## IO submission queue
### Dispatcher
NVMeVirt:     +enter{func: 'nvmev_proc_io_sq [nvmev]'}
NVMeVirt:      +enter{func: '__nvmev_proc_io [nvmev]'}
<-- Enter KV FTL (@dispatcher_kvftl)
NVMeVirt:       +enter{func: 'kv_proc_nvme_io_cmd [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        +enter{func: '__schedule_io_units [nvmev]'}
NVMeVirt:        -exit{func: '__schedule_io_units [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:       -exit{func: 'kv_proc_nvme_io_cmd [nvmev]'}
Exit KV FTL -->
NVMeVirt:       +enter{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        -exit{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        +enter{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:        -exit{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:       -exit{func: '__nvmev_proc_io [nvmev]'}
NVMeVirt:       -exit{func: 'nvmev_proc_io_sq [nvmev]'}
### Worker
<-- Enter KV FTL (@worker_kvftl)
NVMeVirt:         +enter{func: 'kv_identify_nvme_io_cmd [nvmev]'}
NVMeVirt:        -exit{func: 'kv_identify_nvme_io_cmd [nvmev]'}
NVMeVirt:        +enter{func: 'kv_perform_nvme_io_cmd [nvmev]'}
NVMeVirt:        +enter{func: '__do_perform_kv_io [nvmev]'}
NVMeVirt:        +enter{func: 'get_mapping_entry [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        +enter{func: 'get_hash_slot [nvmev]'}
NVMeVirt:        -exit{func: 'get_hash_slot [nvmev]'}
NVMeVirt:       -exit{func: 'get_mapping_entry [nvmev]'}
NVMeVirt:       +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:       -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:       +enter{func: 'allocate_mem_offset [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        +enter{func: 'append_only_allocate [nvmev]'}
NVMeVirt:        -exit{func: 'append_only_allocate [nvmev]'}
NVMeVirt:       -exit{func: 'allocate_mem_offset [nvmev]'}
NVMeVirt:       +enter{func: 'new_mapping_entry [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        +enter{func: 'get_hash_slot [nvmev]'}
NVMeVirt:        -exit{func: 'get_hash_slot [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:       -exit{func: 'new_mapping_entry [nvmev]'}
NVMeVirt:      -exit{func: '__do_perform_kv_io [nvmev]'}
NVMeVirt:     -exit{func: 'kv_perform_nvme_io_cmd [nvmev]'}
Exit KV FTL -->
NVMeVirt:     +enter{func: '__fill_cq_result [nvmev]'}
NVMeVirt:     -exit{func: '__fill_cq_result [nvmev]'}
NVMeVirt:     +enter{func: '__process_msi_irq [nvmev]'}
NVMeVirt:      +enter{func: '__signal_irq [nvmev]'}
NVMeVirt:      -exit{func: '__signal_irq [nvmev]'}
NVMeVirt:     -exit{func: '__process_msi_irq [nvmev]'}
## IO completion queue
NVMeVirt:      +enter{func: 'nvmev_proc_io_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_io_cq [nvmev]'}
---
# NVMe KVSSD retrieve
## IO submission queue
### Dispatcher
NVMeVirt:     +enter{func: 'nvmev_proc_io_sq [nvmev]'}
NVMeVirt:      +enter{func: '__nvmev_proc_io [nvmev]'}
<-- Enter KV FTL (@dispatcher_kvftl)
NVMeVirt:       +enter{func: 'kv_proc_nvme_io_cmd [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        +enter{func: '__schedule_io_units [nvmev]'}
NVMeVirt:        -exit{func: '__schedule_io_units [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:       -exit{func: 'kv_proc_nvme_io_cmd [nvmev]'}
Exit KV FTL -->
NVMeVirt:       +enter{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        -exit{func: '__allocate_work_queue_entry [nvmev]'}
NVMeVirt:        +enter{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__insert_req_sorted [nvmev]'}
NVMeVirt:        -exit{func: '__enqueue_io_req [nvmev]'}
NVMeVirt:        +enter{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:        -exit{func: '__reclaim_completed_reqs [nvmev]'}
NVMeVirt:        -exit{func: '__nvmev_proc_io [nvmev]'}
NVMeVirt:        -exit{func: 'nvmev_proc_io_sq [nvmev]'}
### Worker
<-- Enter KV FTL (@worker_kvftl)
NVMeVirt:         +enter{func: 'kv_identify_nvme_io_cmd [nvmev]'}
NVMeVirt:        -exit{func: 'kv_identify_nvme_io_cmd [nvmev]'}
NVMeVirt:        +enter{func: 'kv_perform_nvme_io_cmd [nvmev]'}
NVMeVirt:         +enter{func: '__do_perform_kv_io [nvmev]'}
NVMeVirt:         +enter{func: 'get_mapping_entry [nvmev]'}
NVMeVirt:         +enter{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        +enter{func: 'get_hash_slot [nvmev]'}
NVMeVirt:        -exit{func: 'get_hash_slot [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        +enter{func: 'cmd_key_length [nvmev]'}
NVMeVirt:        -exit{func: 'cmd_key_length [nvmev]'}
NVMeVirt:       -exit{func: 'get_mapping_entry [nvmev]'}
NVMeVirt:       +enter{func: 'cmd_value_length [nvmev]'}
NVMeVirt:       -exit{func: 'cmd_value_length [nvmev]'}
NVMeVirt:      -exit{func: '__do_perform_kv_io [nvmev]'}
NVMeVirt:     -exit{func: 'kv_perform_nvme_io_cmd [nvmev]'}
Exit KV FTL -->
NVMeVirt:     +enter{func: '__fill_cq_result [nvmev]'}
NVMeVirt:     -exit{func: '__fill_cq_result [nvmev]'}
NVMeVirt:     +enter{func: '__process_msi_irq [nvmev]'}
NVMeVirt:      +enter{func: '__signal_irq [nvmev]'}
NVMeVirt:      -exit{func: '__signal_irq [nvmev]'}
NVMeVirt:     -exit{func: '__process_msi_irq [nvmev]'}
## IO completion queue
NVMeVirt:     +enter{func: 'nvmev_proc_io_cq [nvmev]'}
NVMeVirt:     -exit{func: 'nvmev_proc_io_cq [nvmev]'}
```

- KVSSD FTL Tag 들 (위 callstack 에 달아놨음)
	- `@dispatcher_kvftl`: Data size 에 따라 종료시점만 계산
	- `@worker_kvftl`: 내부적으로 구현된 hash table 을 이용해 key 로 value 의 memory offset 을 매핑하고 이것으로 값을 반환, 아마 GC 같은것도 이쪽에서 이루어지는 것 같다.