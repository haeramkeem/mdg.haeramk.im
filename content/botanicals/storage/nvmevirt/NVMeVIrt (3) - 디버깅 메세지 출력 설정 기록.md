---
tags:
  - 삽질록
  - NVMe
  - NVMeVirt
  - Storage
date: 2024-04-24
---
> [!info]- 참고한 것들
> - [논문 (FAST '23)](https://www.usenix.org/conference/fast23/presentation/kim-sang-hoon)
> - [GItHub](https://github.com/snu-csl/nvmevirt)
> - [유투브 저자직강](https://youtu.be/eV7vQyg46zc?si=USiYITI09Sdz01YZ)

> [!tip] [[NVMeVirt (2) - S.M.A.R.T log 기능 디버깅 기록|이전 글]]

## 개요

- 어떤 NVMe command 를 날렸을 때, 어떤 함수들이 관여되는지 확인하기 위해 모든 디버그 메세지를 키고 함수 진입 및 탈출마다 커널메세지를 남기도록 설정해 보자.

## Debug 로그 출력

- 모든 debugging 로그를 출력해보자.
- `nvmev.h` 에서 아래 메크로를 `undef` 에서 `define` 으로 살리면 된다
- 이 상태에서

```c
#undef CONFIG_NVMEV_VERBOSE
#undef CONFIG_NVMEV_DEBUG
#undef CONFIG_NVMEV_DEBUG_VERBOSE
```

- 요로코롬 바꾸면 된다는 것.

```c
#define CONFIG_NVMEV_VERBOSE
#define CONFIG_NVMEV_DEBUG
#define CONFIG_NVMEV_DEBUG_VERBOSE
```

## Debug 메세지 포맷 변경

- Debug 메세지에 어느 파일의 어느 함수의 어느 줄에서 이 메세지를 출력하는 것인지 formatting 을 바꿔보자.

### `NVMEV_DEBUG()`, `nvmev.h`

- 이전

```c
#define NVMEV_DEBUG(string, args...) printk(KERN_INFO "%s: " string, NVMEV_DRV_NAME, ##args)
```

- 이후

```c
#define NVMEV_DEBUG(string, args...) printk(KERN_INFO "%s{file: '%s', line: %d, func: '%s'}: " string, NVMEV_DRV_NAME, __FILE__, __LINE__, __func__, ##args)
```

### `NVMEV_DEBUG_VERBOSE()`, `nvmev.h`

- 이전

```c
#define NVMEV_DEBUG_VERBOSE(string, args...) printk(KERN_INFO "%s: " string, NVMEV_DRV_NAME, ##args)
```

- 이후

```c
#define NVMEV_DEBUG_VERBOSE(string, args...) printk(KERN_INFO "%s{file: '%s', line: %d, func: '%s'}: " string, NVMEV_DRV_NAME, __FILE__, __LINE__, __func__, ##args)
```

## 함수 진입 / 탈출 문구 출력

- 함수 진입/종료 logging 을 위해서 [[C - 함수 진입, 탈출 메세지 출력하기|Instrument Function]] 을 사용하였다.
- 근데 user mode 에서는 [[C - 함수 진입, 탈출 메세지 출력하기|dlfnc.h]] 를 사용할 수 있지만 kernel mode 에서는 이것을 사용할 수 없기 때문에 고민고민하던중
	- `printk()` 의 formatting 중에 function pointer 를 function name 으로 [[C - printk format 정리|바꿔주는 것]] (`%ps`) 이 있길래 사용해 보니 잘 돼서 이걸 사용.
- 추가적으로 보기 편하게 하려고 함수 진입/탈출 인덴트도 처리했다.
	- ...근데 multi-thread 로 돌아가서 좀 이상하게 나오긴 함
- `debug.c` 파일 생성

```c
#include "nvmev.h"

void __cyg_profile_func_enter(void *this_fn, void *call_site) __attribute__((no_instrument_function));
void __cyg_profile_func_exit(void *this_fn, void *call_site) __attribute__((no_instrument_function));

int lv = 0;

void __cyg_profile_func_enter(void *this_fn, void *call_site) {
  lv++;
  char buffer[32];
  for (int i = 0; i < lv; i++)
    strcat(buffer, " ");
  printk(KERN_WARNING "%s: %s +enter{func: '%ps'}", NVMEV_DRV_NAME, buffer, this_fn);
}

void __cyg_profile_func_exit(void *this_fn, void *call_site) {
  char buffer[32];
  for (int i = 0; i < lv; i++)
    strcat(buffer, " ");
  printk(KERN_WARNING "%s: %s -exit{func: '%ps'}", NVMEV_DRV_NAME, buffer, this_fn);
  lv--;
}
```

- 그리고 이놈을 사용하기 위해 `Kbuild` 파일을 좀 수정해 줘야 했다.
	- 즉, 컴파일 타겟에 `debug.c` 를 추가하고, `-fintrument-functions` 옵션을 추가해 줘야 한다.

```
ccflags-y += -finstrument-functions
nvmev-y += debug.o
```

#### Thread loop

- NVMeVirt 는 하나의 Dispatcher 와 여러 Worker 들이 thread 로 생성돼서 작업을 처리하고
- 각 thread 에서는 무한루프를 돌며 어떤 메세지가 들어왔는지 등을 체크한다.
- 따라서 이 무한루프에 의해 지속적으로 실행되는 함수의 경우에는 logging 을 꺼놔야 한다.
- 제외된 함수들
	- `io.c`: `__get_io_worker`
	- `io.c`: `__get_wallclock`
	- `main.c`: `nvmev_proc_dbs`
	- `pci.c`: `nvmev_signal_irq`
	- `pci.c`: `nvmev_proc_bars`
- 이놈들에 대해서는 `__attribute__((no_instrument_function))` 를 전부 달아 로그를 비활성화하면 된다.
- 다만, loop 의 영향을 최소화 하고 최대한 많은 로그를 찍게 하기 위해 제외된 함수들에 대해서는 다음과 같은 처리를 하였다.
	- 세 함수(`__get_io_worker`, `__get_wallclock`, `nvmev_signal_irq`) 들은 Infinite loop 이외에도 사용되고 있어 loop 내에서만 사용할 용도로 `_muted` wrapper function 을 추가적으로 정의했다.
	- 두 함수(`nvmev_proc_dbs`, `nvmev_proc_bars`) 들은 한번밖에 사용되지 않기 때문에 함수 내부의 `if` 문에 걸리는 부분에만 logging 을 하도록 했다.
- 추가적으로... 얘네들도 module init 할때 너무 많은 로그를 찍어서 로깅 비활성화시킴
	- `ssd_init_nand_page`
	- `ssd_remove_nand_page`
	- `ssd_init_nand_blk`
	- `ssd_remove_nand_blk`