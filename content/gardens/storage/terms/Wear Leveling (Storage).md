---
tags:
  - 용어집
  - storage
date: 2024-03-16
---
> [!info]- 참고한 것들
> - [어떤 회사 글](https://www.tuxera.com/blog/what-is-write-amplification-why-is-it-bad-what-causes-it/)
> - [위키피디아](https://en.wikipedia.org/wiki/Wear_leveling)

## 닳는 것 (wear) 을 고르게 (leveling) 하는 것

![[Pasted image 20240312195442.png]]
> [이미지 출처](https://www.tuxera.com/blog/what-is-write-amplification-why-is-it-bad-what-causes-it/)

- [[PE Cyclen Limit, Wearing-off (Storage)|PE Cycle Limit]] 때문에, 플래시 메모리는 write, erase 작업을 한 부분에 집중적으로 수행할 경우 그 부분만 수명이 짧아지게 되는 문제가 있다.
- 따라서 실제로 write 할 때에는, 한 block 에 page 들을 몰빵하지 않고 여러 block 에 고르게 펼쳐서 작업을 해 모든 block 에 고르게 저장될 수 있게 한다.