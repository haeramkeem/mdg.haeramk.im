---
tags:
  - 용어집
  - Storage
date: 2024-03-16
---
> [!info]- 참고한 것들
> - [누군가의 블로그](https://dhkoo.github.io/2019/02/26/multistream/)
> - [ZNS 논문의 background 파트 (ATC '21)](https://www.usenix.org/system/files/atc21-bjorling.pdf)

## 이건 또 뭐야

- 결국에는 이것도 [[Garbage Collection, GC (Storage)|GC]] 오버헤드를 줄이기 위해 도입된 것이다.
	- 만일 invalid page 들이 한 block 에 모여있으면 GC 오버헤드가 없을 텐데
	- Lifecycle 이 유사한 page 들이 한 block 에 모여 있으면 다같이 write 된 이후에 다같이 invalid 가 되고 다같이 GC 가 이루어 질 수 있으므로 참 좋다잉 그쵸?
- *Multi-stream SSD* 는 이렇게 lifecycle 이 비슷한 page 를 한 block 에 모아놓기 위한 방법으로 여러개의 *Stream* 을 제공하는 것을 택한 방식이다.
	- 즉, 각 Stream 은 독립된 block 들에 저장되고 하나의 stream 에다는 비슷한 lifecycle 을 가지는 데이터들을 전달해서 저장하게 된다.
	- 이렇게 되면 하나의 block 내에는 하나의 stream 에서 들어온 데이터들만이 있을 것이고,
	- 따라서 block 내에는 유사한 lifecycle 을 가지는 데이터들만이 있을 것이므로
	- 유사한 시점에 invalid 가 될 가능성이 높아지기에 GC 오버헤드가 줄어들게 되는 것
- Write command 에 stream hint (뭐 stream ID 정도로 생각해도 될 것 같다) 까지 같이 전달하면 SSD Controller 에서 알아서 처리하는 식으로 구현된다고 한다.

## 그럼 Stream 은 어떻게 할당하지?

- Lifecycle 이 다른 데이터들이 stream 으로 들어오게 되면 그냥 SSD 와 별반 다를게 없기에, 데이터의 lifecycle 을 명확히 판단해서 그에 맞는 stream 으로 넣어 주는 것이 중요하다.
- Application 이 데이터의 lifecycle 을 제일 잘 알고 있을테니 이 수준에서 stream 을 할당하면 아주 좋지만, 그럼 application 코드를 변경해야 하기에 한계점이 있다.
- 따라서 커널레벨의 파일시스템 및 블럭 레이어 수준에서 stream 을 할당하는 연구가 진행되어 왔고,
- 최근에는 program context 에 따라서 stream 을 할당하는 연구도 진행된다고 한다.