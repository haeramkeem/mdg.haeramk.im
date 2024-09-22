---
tags:
  - terms
  - storage
date: 2024-03-16
---
> [!info]- 참고한 것들
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)

## 이게 무언가?

- [[Flash Memory, SSD (Storage)|SSD]] 의 성능을 벤치마크하고자 할 때, 30분 이상의 지속적인 랜덤 쓰기 부하를 건 뒤에 측정을 하는 것.
- SSD 는 30 여분정도의 부하가 걸린 이후에 실질적인 성능 저하가 발생하는 경향이 있기 때문에 (아래 그림 보면 진자루 그렇타) 이러한 방법을 통해 최악의 성능을 확인해 보는 것.

![[Pasted image 20240313220544 1.png]]
> [출처](https://www.storagereview.com/review/samsung-ssd-840-pro-review)

![[Pasted image 20240313220550 1.png]]
> [출처](https://www.storagereview.com/review/samsung-ssd-840-pro-review)

## 왜 그런가?

- 과한 랜덤 쓰기가 가해질 경우, [[Garbage Collection, GC (Storage)|GC]] 과도하게 발생하기 때문.
	- [저기](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2) 에서는 "Sustaining mode" 에 들어간다고 했는데, 공식 용어가 아닌건지, 검색해도 잘 안나온다.