---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - Logical Logging
---
> [!info]- 참고한 것들
> - [미디엄 블로그](https://medium.com/@vikas.singh_67409/algorithms-for-recovery-and-isolation-exploiting-semantics-aries-d904765fb9b8)
> - [티스토리](https://sksstar.tistory.com/128)
> - [네이버 블로그](https://blog.naver.com/pjy791004/60122780251)

## Operation 단위의 로깅

- 변경 내용에 대한 operation 을 로깅하는 방법이다.
	- 따라서 block 단위 로깅을 하는 [[Physical Logging (Database Recovery)|Physical Logging]] 에 비하면 로그의 사이즈는 꽤 작지만
	- 복구가 오래걸린다.
		- 이건 왜냐면 operation 단위이기 때문에 해당 operation 에 관여되는 모든 block 들을 rollback 해야 하기 때문.
			- 가령 operation 에 관여되는 block 이 100 개일때, 실제로는 20개만 변경되었다고 할지라도 100 개 전부를 작업해야 한다.
		- 또한 [[Physical Logging (Database Recovery)|Physical Logging]] 에서는 block 의 "상태" ("image") 를 로깅하기 때문에 단순한 copy 로 rollback 이 가능했지만 여기서는 수행한 "작업" 을 로깅하는 것이기 때문에 해당 작업을 되돌리기 위해서는 단순한 copy 가 아니라 추가적인 연산이 들어가게 된다.
- 이와 대비되는 방법은 [[Physical Logging (Database Recovery)|Physical Logging]] 이고, *Logical Logging* 과 [[Physical Logging (Database Recovery)|Physical Logging]] 를 hybrid 로 사용하는 것이 [[Physiological Logging (Database Recovery)|Physiological Logging]] 이다.