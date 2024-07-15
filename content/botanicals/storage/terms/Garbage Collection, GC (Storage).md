---
tags:
  - 용어집
  - Storage
date: 2024-03-30
---
> [!info]- 참고한 것들
> - [어떤 회사 글](https://www.tuxera.com/blog/what-is-write-amplification-why-is-it-bad-what-causes-it/)
> - [어떤 블로그 글](https://medium.com/@reefland/over-provisioning-ssd-for-increased-performance-and-write-endurance-142feb015b4e)
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/15/coding-for-ssd-part-3)
> - [윅히피디아](https://en.wikipedia.org/wiki/Write_amplification)

## SSD 에서의 Garbage Collection (GC)

![[Pasted image 20240312195045.png]]
> [이미지 출처](https://www.tuxera.com/blog/what-is-write-amplification-why-is-it-bad-what-causes-it/)

- [[Flash Memory, SSD (Storage)#Read-modify-write|여기서 언급한 것]] 처럼, 플래시 메모리에서는 GC (Garbage Collection) 을 필요로 한다.
	- 즉, read/write size (page) 와 erase size (block) 이 다르기 때문
	- write page 를 하려면 erase 를 먼저 해야 하는데 이것이 page 단위가 아닌 block 단위로만 가능하기 때문에 block 내부에 있던 기존의 valid page 들을 딴 곳으로 옮겨야 한다.
- 구체적으로 이것이 어떻게 수행되는 지는 아래에서 설명해준다.

## GC 의 과정

- SSD 의 컨트롤러는 [[Flash Translation Layer, FTL (Storage)|FTL]] 의 LBA mapping table 를 보고 block 내의 valid page 들을 확인한다.
- 그리고 이들을 다른 block 으로 옮긴 후, LBA 에 기존의 page 는 `invalid` 로 표시한 뒤 새로운 page address 를 매핑해 놓는다.
	- SSD 를 사용하는 호스트 (예: OS) 는 GC 가 수행되었는지 아닌지 모르기 때문. 즉, GC 여부와 관계 없이 호스트는 자신이 알고 있던 주소로 접근한다.
- 이후 해당 block 을 erase 한다.

## GC 의 문제점 및 개선 방법들

- GC 를 한다는 것은 page 를 옮기는 작업이 수반되므로, 추가적인 write 가 발생해 [[Write Amplification, WA and Write Amplication Factor, WAF (Storage)|WA]] 를 늘리는 원인이 된다.
- 또한 write 보다 erase 의 작업 시간이 더 길다. (250 ~ 1500 마이크로 초 vs 1500 ~ 3500 마이크로 초) 따라서 GC 를 하는 것은 비용이 꽤나 큰 작업이다.

## GC 종류들

### Background GC (BGC), Idle Collection, Idle-time Garbage Collection (ITGC)

- Background GC 는 SSD 가 한가할 때 주기적으로 블럭들에 대해 GC 를 수행하는 방식이다.
	- 이 방식을 이용하면 free page 를 사전에 확보해 놓는 셈이 되어 실제 write operation 이 들어왔을 때 free page 가 부족해질 가능성이 적어진다.
- 보통 "Background operation" 이라 하면 이러한 BGC 를 말하고, 반대로 "Foreground operation" 은 host 로부터 전달되는 r/w 등의 작업을 일컫는다.

### Parallel Garbage Collection (PGC)

- 이 방식은 BGC 와 두가지 차이점이 있다:
	- 주기적으로 GC 를 하는 것이 아닌, write operation 시에 수행한다.
	- BCG 는 최대한 많은 free block 을 확보하는 반면, PGC 는 (Foreground operation 과의 경합을 최소화하기 위해) 최소한의 free block 을 확보한다.
- 이 방식은 write 부하가 아주 많이 걸리는 환경에서 이점이 있다.
	- BGC 에서는 "한가" 할 때 "주기적" 으로 GC 가 실행되기 때문에, write 부하가 많을 경우에는 write operation 시에 free page 가 부족해질 수 있기 때문이다.
	- 그럼 PGC 와 동일하게 write operation 이 들어왔을 때 GC 가 수행되는데, BGC 는 free block 을 최대한 많이 생성하려 하기 때문에 PGC 의 GC 보다는 느리고, 따라서 PGC 보다도 더 write operation 에 딜레이가 걸리게 된다. (아마?)