---
tags:
  - c
  - linux-kernel
date: 2024-12-21
---
> [!info]- 참고한 것들
> - [스댕 - 기본](https://stackoverflow.com/a/1184346)
> - [스댕 - kernel_read, kernel_write 지원](https://stackoverflow.com/a/53917617)
> - [스댕 - flip_open 리턴값](https://stackoverflow.com/a/58562444)
> - [스댕 - loff_t](https://stackoverflow.com/a/9713598)
> - [Linux journal](https://www.linuxjournal.com/article/8110)

## 주의

- Kernel space 에서 File IO 를 하는 것은 일반적으로 권장되지 않는다.
	- 왜인지는 [이 글](https://www.linuxjournal.com/article/8110) 을 참고하자.
- 그럼에도 불구하고 디버깅, 연구 등의 목적으로 이런게 필요하다고 할때, 어떻게 해야 하는지 알아보자.

## 어케하누

> [!tip] Header 파일
> - [linux/fs.h](https://github.com/torvalds/linux/blob/499551201b5f4fd3c0618a3e95e3d0d15ea18f31/include/linux/fs.h#L2743)

- Userspace 에서 File IO 에 사용하는 syscall 몇개에 대해, kernel space 에서는 어떻게 하는지 알아보자.
- 가장 기본 아이디어는 kernel space 에서는 syscall 을 호출하는 것 대신, virtual filesystem (vfs) layer 의 API 들을 이용하는 것이다.
- 다만 Userspace 에서와의 차이점이라면 file descriptor (`fd`) 대신 file 구조체 (`struct file*`) 가 사용된다고 생각하면 된다.

### `open()` -> `flip_open()`, `close()` -> `flip_close()`

```c
struct file *
f_open(const char *path, int flags, int rights)
{
	struct file *file = NULL;
	int err = 0;

	file = filp_open(path, flags, rights);
	if (IS_ERR(file)) {
		err = PTR_ERR(file);
		printk(KERN_INFO "error: file open error(%d)\n", err);
		return NULL;
	}
	return file;
}
```

- File open 은, `flip_open()` 을 사용하면 된다.
- 이때 `flip_open()` 의 return 값은 정상적인 경우라면 `struct file*` 이지만, 그렇지 않을 때에는 음수 errno 번호를 준다.
	- 가령 파일이 존재하지 않을 때는 errno `NOEXT` 인 `2` 를 return 하는데, 대신 이것의 음수인 `-2` 가 실제로는 return 된다.
	- 이것은 `flip_open()` 의 반환값이 `NULL` 인지 확인하는 것으로 성공 여부를 확인할 수 없다는 말이다.
	- 따라서 이것이 정상적인 `struct file*` 인지 확인하기 위해서는 위 예시처럼 `IS_ERR()` macro 를 사용해야 하고, 이것을 errno 로 뽑아내기 위해서는 `PTR_ERR()` macro 를 사용해야 한다.
- 그리고 주의할점은 여기서 파일의 경로는 절대경로를 사용해야 한다는 것이다. `~` 나 `.` 를 사용하면 kernel module 입장에서는 경로를 알 수 없기 때문.

```c
void
f_close(struct file *file)
{
	if (file)
		filp_close(file, NULL);
}
```

- 마찬가지로 file close 는 `flip_close()` 를 사용하면 된다.

### `pread()` -> `kernel_read()`, `pwrite()` -> `kernel_write()`

```c
int
f_pread(struct file *file, loff_t offset, char *data, size_t size)
{
	if (!file)
		return -1;
	return kernel_read(file, data, size, &offset);
}
```

```c
int
f_pwrite(struct file *file, loff_t offset, char *data, size_t size) 
{
	if (!file)
		return -1;
	return kernel_write(file, data, size, &offset);
}
```

- `pread()` 와 `pwrite()` 는 `kernel_read()`, `kernel_write()` 를 사용하면 된다.
- 옛날글에는 `vfs_read()` 나 `vfs_write()` 를 사용하는 예시들이 있지만, kernel version `4.14` 부터는 사용 못한다고 한다.
- 참고로 여기서 `loff_t` 는 long offset 으로, `long long int` 이다.

### `llseek()` -> `vfs_llseek()`, `fsync()` -> `vfs_fsync()`

```c
loff_t
f_llseek(struct file *file, loff_t offset, int whence)
{
	if (!file)
		return -1;
	return vfs_llseek(file, offset, whence);
}
```

```c
int
f_fsync(struct file *file) 
{
	vfs_fsync(file, 0);
	return 0;
}
```

- `llseek()` 와 `fsync()` 는 `vfs_llseek()` 와 `vfs_fsync()` 를 이용하면 된다.

## Complete Example

- Makefile 등과 같은것들은 [[세상 간단한 Kernel module 예시 (C Linux Kernel)|이거]] 를 참고하자.

```c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>

struct file *f_open(const char *path, int flags, int rights);
void f_close(struct file *file);
int f_pread(struct file *file, loff_t offset, char *data, size_t size);
loff_t f_llseek(struct file *file, loff_t offset, int whence);
int f_pwrite(struct file *file, loff_t offset, char *data, size_t size);

struct file *
f_open(const char *path, int flags, int rights)
{
	struct file *file = NULL;
	int err = 0;
	
	file = filp_open(path, flags, rights);
	if (IS_ERR(file)) {
		err = PTR_ERR(file);
		printk(KERN_INFO "error: file open error(%d)\n", err);
		return NULL;
	}
	return file;
}

void
f_close(struct file *file)
{
	if (file)
		filp_close(file, NULL);
}

int
f_pread(struct file *file, loff_t offset, char *data, size_t size)
{
	if (!file)
		return -1;
	return kernel_read(file, data, size, &offset);
}

loff_t
f_llseek(struct file *file, loff_t offset, int whence)
{
	if (!file)
		return -1;
	return vfs_llseek(file, offset, whence);
}

int
f_pwrite(struct file *file, loff_t offset, char *data, size_t size) 
{
	if (!file)
		return -1;
	return kernel_write(file, data, size, &offset);
}

static int
fileio_init(void)
{
	struct file *file = f_open("/path/to/file.txt", O_RDWR, 0644);
	char buf[5] = {'\0'};
	f_pread(file, 0, buf, 4);
	printk(KERN_INFO "read: '%s'\n", buf);
	loff_t size = f_llseek(file, 0, SEEK_END);
	printk(KERN_INFO "size: '%lld'\n", size);
	f_pwrite(file, 10, buf, 4);
	f_close(file);
	return 0;
}
 
static void
fileio_exit(void)
{
	printk(KERN_INFO "Exit\n");
}
 
MODULE_LICENSE("GPL");
module_init(fileio_init);
module_exit(fileio_exit);
```