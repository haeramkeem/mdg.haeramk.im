---
tags:
  - database
  - db-postgresql
aliases:
  - Shared Buffer
date: 2024-09-29
---
> [!info]- 참고한 것들
> - [[Lab 03. Shared Buffer|서울대 정형수 교수님 BKMS 강의 (Fall 2024)]]

## Shared Buffer

- PostgreSQL 에서는 buffer pool 을 *Shared Buffer* 라고 부른다.

### Architecture

![[Pasted image 20240929183547.png]]

- 일단 전체적인 구조는 위와 같다. 이놈을 하나 하나 보면

#### Buffer table

![[Pasted image 20240929183800.png]]

- Buffer table 은 hash table 로, [[Relation (Relational Model)|table (relation) ID]] 와 page ID 를 key 로 하여 [[#Buffer Descriptor|buffer descriptor]] pointer 를 찾을 수 있게 하는 역할을 한다.
	- 즉, 여기를 보면 원하는 page 가 buffer 에 올라와 있는지 확인할 수 있고
	- Buffer descriptor 공간의 어디에 page 가 있는지 신경쓰지 않게 해준다는 점에서 일종의 indirection 이라고 할 수 있음

#### Buffer Descriptor, Buffer Page

![[Pasted image 20240929183844.png]]

![[Pasted image 20240929183835.png]]

- *Buffer descriptor* 는 buffer 의 metadata 이고 실제 데이터 공간인 *Buffer page* 와 1:1 로 매핑된다.
- *Buffer descriptor* 에는 replacement 를 위한 정보가 담긴다
	- *Reference count* 는 pinning 정보이다: 이놈이 0 이 아니면, 누군가가 사용하고 있다는 것.
	- *Usage count* 는 말 그대로 사용된 횟수인데, [[#CLOCK in Shared Buffer|clock replacement]] 를 위해 존재한다.
		- 즉, 사용되면 +1 이 되고, clock 에 걸리면 -1 이 되며, 0이 되면 evict 대상이 됨
	- dirty 는 flush 할지 말지를 알려주는 flag
		- 당연히 dirty 하지 않으면 flush 하지 않고 그냥 memory 만 비워준다.
- *Buffer page* 는 disk 에서 가져온 page 가 담길 memory 공간이다.

### CLOCK in Shared Buffer

- Replacement policy 로는 [[Least Recently Used, LRU (Replacement)|LRU]] 를 그냥 사용하진 않고 [[CLOCK (Replacement)|CLOCK]] 을 사용한다.

![[Pasted image 20240929184513.png]]

- 구체적인 과정을 한번 보자.
	- Eviction 이 시작되면 Clock 을 돌면서
	- Page 의 reference count 가 0이 아니면 pinning 되어 있다는 소리이기 때문에 넘어가고
	- 그렇지 않으면 usage count 를 1 낮추고 넘어간다.
	- 이 과정을 usage count 가 0인놈을 발견할 때까지 반복하며 빙빙 돌다가
	- Usage count 가 0이어서 1을 낮출 수 없으면 evict target 으로 정하게 되는 것.
	- 그리고 다음 eviction 때는 기존의 clock 의 다음 위치부터 시작해 위의 과정을 반복하게 된다.

### Configuration

- Shared buffer 의 크기는 `postgresql.conf` 의 `shared_buffers` 를 조정해 주면 된다.

![[Pasted image 20240929183353.png]]

- 그리고 확인하는건 `SHOW` 로 확인할 수 있다.

```sql
SHOW shared_buffers;
```

![[Pasted image 20240929183432.png]]