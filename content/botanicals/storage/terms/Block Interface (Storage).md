---
tags:
  - 용어집
  - Storage
---
> [!info] 참고한 자료
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/15/coding-for-ssd-part-3/)

## Cell, Page, Block, Plane, Die

![[Pasted image 20240315004625.png]]

- Bit 를 저장하는 최소단위인 *cell* 이 있고
- Cell 이 모여 *page* 가 되고
- Page 가 모여 *block* 이 되고
- Block 이 모이면 *plane* 이 되고
- Plane 이 모이면 *die* 가 되고
- 이 die 들이 하나의 SSD 를 구성하게 된다.

## Operation 특징

### Read, Write (혹은 *program* 이라는 용어도 쓴다) 작업은 *page* 단위로 이루어 진다.

- 사용자 입장에서 하나의 byte 만 읽고 쓰는건 가능하다. 하지만 이 요청이 SSD 레벨로 가게 되면 동일하게 page 전체를 r/w 하고 나머지는 버리게 된다.
	- Page 에 부분적으로 write 할 수는 없다. 즉, write 하려는 데이터가 page 사이즈보다 작을 경우 나머지 공간은 그냥 빈공간으로 남고 그 공간에 이어서 write 할 수는 없다. (이러한 경우도 [[Write Amplification, WA and Write Amplication Factor, WAF (Storage)|WA]] 에 속한다.)

### Erase 작업은 *block* 단위로 이루어 진다.

- Erase 작업은 page 들을 그룹한 단위인 block 단위로 이루어 진다.
	- 이때 block 에 있던 기존에 write 된 page 들은 다른 곳으로 옮겨 가게 되는데, 이 작업을 [[Garbage Collection, GC (Storage)|GC]] 라 한다.
- Erase 작업을 하게 되면 해당 block 의 모든 page 가 *free* 상태가 된다.

### Write 작업은 Free page 에서만 가능하다.

- 말 그대로: free page 에서만 가능하고 이전에 write 된 적이 있는 page 에서는 불가능하다.

### 페이지는 Overwrite 가 불가능하다.

![[Pasted image 20240314124139.png]]
> Page 를 수정하고 이후 erase (gc) 하는 과정 정리 이미지 ([출처](https://codecapsule.com/2014/02/12/coding-for-ssds-part-3-pages-blocks-and-the-flash-translation-layer/))

- [[#Write 작업은 Free page 에서만 가능하다.|위의 내용]] 에 연장되는 것이다: 페이지에 데이터를 쓰면 free 페이지가 아니기 때문에 write 가 불가능하다. (*in-place update* 가 불가능하다.)
- 따라서 내용이 변경되었을 때에는 기존의 페이지는 *stale* 혹은 *invalid* 상태가 되고, 해당 페이지를 레지스터 (아마 SSD Processor 안에 있는?) 로 옮겨서 수정을 한 뒤에, 새로운 free page 에 write 하게 된다.
	- 이 과정은 *Read-Modify-Write* 라고 부르기도 한다.
- 이후 이 *stale* 페이지는 [[Garbage Collection, GC (Storage)|GC]] 과정에서 정리된다.