---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - Physical Logging
---
> [!info]- 참고한 것들
> - [미디엄 블로그](https://medium.com/@vikas.singh_67409/algorithms-for-recovery-and-isolation-exploiting-semantics-aries-d904765fb9b8)
> - [티스토리](https://sksstar.tistory.com/128)
> - [네이버 블로그](https://blog.naver.com/pjy791004/60122780251)

## Block 단위의 로깅

- Transaction 을 로깅할 때, storage level 의 block (아마 [[Logical Block Addressing, LBA (Storage)|LBA]]) 혹은 page 단위로 로깅하는 것.
	- [[Undo Log (Database)|UNDO]] 를 위한 before image 와 [[Redo Log (Database)|REDO]] 를 위한 after image 를 모두 간직한다.
- 여기서의 핵심은 block (page) 단위인 것이다.
	- Block (page) 의 일부가 변경이 되어도 전부를 logging 하고,
	- 하나의 transaction 에는 여러 block (page) 이 관여될 수 있기 때문에 생성되는 로그가 많은 것이 특징이다.
- 따라서 장단점은 아무래도
	- 복구시에 그냥 block (page) copy 를 하면 되기 때문에 빠르게 복구가 가능하지만
	- 위에서 말한대로 block (page) 단위 로깅을 하기 때문에 로그의 사이즈가 크다.
- 이와 대비되는 방법은 [[Logical Logging (Database)|Logical Logging]] 이고, *Physical Logging* 과 [[Logical Logging (Database)|Logical Logging]] 를 hybrid 로 사용하는 것이 [[Physiological Logging (Database)|Physiological Logging]] 이다.