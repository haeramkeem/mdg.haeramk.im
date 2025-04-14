---
tags:
  - c
  - c-io
aliases:
  - O_DIRECT
  - posix_memalign
  - Direct IO
date: 2024-10-15
---
> [!info]- 참고한 것들
> - [Linux man](https://man7.org/linux/man-pages/man3/posix_memalign.3.html)
> - [IBM docs](https://www.ibm.com/docs/en/storage-scale/5.1.9?topic=applications-considerations-use-direct-io-o-direct)
> - [스댕 - darwin O_DIRECT](https://stackoverflow.com/a/2307055)
> - [스댕 - 512 align](https://stackoverflow.com/a/55447597)
> - [스댕 - posix_memalign](https://stackoverflow.com/a/6563142)
> - [스댕 - GNU SOURCE](https://stackoverflow.com/a/61456808)

## TL;DR

> [!tip] Direct IO?
> - ... 가 뭔지는 [[Memory-mapped File IO, MMAP (OS)#다른 방법들과의 차이점|MMAP 글]] 에서 확인하자.

> [!tip] Header 정보
> | HEADER | FUNCTION |
> |---|---|
> | `fcntl.h` | `open` |
> | `stdlib.h` | `posix_memalign` |
> | `unistd.h` | `write` |

```c {1, 9-10, 13-14, 20, 43, 49}
#define _GNU_SOURCE

#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

#define F_BLOCK_SIZE (512)
#define F_BUF_SIZE (F_BLOCK_SIZE * 1)

int d_write(char *filename, char *content) {
	int fd = open(filename, O_WRONLY | O_CREAT | O_TRUNC | O_DIRECT,
			0644);
	if (fd == -1) {
		return 1;
	}

	char *buf;
	posix_memalign((void**)&buf, F_BLOCK_SIZE, F_BUF_SIZE);
	memset(buf, 0, F_BUF_SIZE);

	memcpy(buf, content, strlen(content));

	if (write(fd, buf, F_BUF_SIZE) == -1) {
		free(buf);
		close(fd);
		return 1;
	}

	if (fsync(fd) == -1) {
		free(buf);
		close(fd);
		return 1;
	}

	free(buf);
	close(fd);
	return 0;
}

int d_read(char *filename) {
	int fd = open(filename, O_RDONLY | O_DIRECT, 0644);
	if (fd == -1) {
		return 1;
	}

	char *buf;
	posix_memalign((void**)&buf, F_BLOCK_SIZE, F_BUF_SIZE);
	memset(buf, 0, F_BUF_SIZE);

	if (read(fd, buf, F_BUF_SIZE) == -1) {
		free(buf);
		close(fd);
		return 1;
	}

	printf("READ=%s\n", buf);

	free(buf);
	close(fd);
	return 0;
}

int main() {
	char *filename = "example_file.txt";
	char *content = "example content";

	d_write(filename, content);
	d_read(filename);
}
```

![[Pasted image 20241015092504.png]]

## 주의 (참고) 사항

> [!tip] 기타 함수 참고
> - [[Memory Utils (C Memory)|memcpy, memset]]
> - [[Open, Close System Call (C File IO)|open]]
> - [[C - File IO syscall (write, read, fsync)|write, read]]

### O_DIRECT

- `O_DIRECT` 는 Linux extension 이다. darwin (Mac OS) 에서는 안통한다 ([뿅](https://stackoverflow.com/a/2307055)).
- 컴파일할 때 `_GNU_SOURCE` 옵션이 있어야 한다.
	- 이건 `#include <fcntl.h>` 전에 `#define _GNU_SOURCE` 를 명시하거나
	- GCC option 으로 `-D_GNU_SOURCE` 를 적어주면 된다.

### `posix_memalign()`

- Direct IO 를 하려면 buffer 가 align 되어 있어야 한다.
- 구체적인 조건은 ([뿅](https://www.ibm.com/docs/en/storage-scale/5.1.9?topic=applications-considerations-use-direct-io-o-direct)):
	- IO size 가 512byte 의 배수여야 한다.
	- File offset 도 512byte 의 배수여야 한다.
	- Memory 의 buffer 는 512byte 에 align 되어 있어야 한다.
- 만약 이 조건이 지켜지지 않는다면, [[Error Number, errno (C)|errno]] 를 출력해봤을 때 `Invalid argument` 라는 에러가 뜬다.
- 이를 위해서 저 `posix_memalign()` 를 사용하는 것.
	- 이놈은 [[Memory Dynamic Allocation (C Memory)|malloc]] 처럼 동적할당을 해주되, 해당 memory 공간이 align 되어 있도록 할당해준다.
- 이놈의 함수 선언은 요래 돼있다.

```c
int posix_memalign(void **_memptr_, size_t _alignment_, size_t _size_);
```

- 여기서 주목할 것은 `_alignment_` 와 `_size_` 이다.
	- `_alignment_`: 이놈이 어떻게 align 할 것인지에 대한 인자이다. Direct IO 를 위해서는 `512` 를 넣어줘야 한다.
	- `_size_`: 이놈이 buffer size 를 얼마로 할 것이냐에 대한 인자이다. Direct IO 를 위해서는 `512` 의 배수를 넣어줘야 한다.