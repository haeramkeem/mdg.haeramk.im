---
tags:
  - database
  - db-recovery
  - terms
date: 2024-08-29
aliases:
  - STEAL
  - NO_STEAL
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/37861999)
> - [미디엄 블로그](https://medium.com/@vikas.singh_67409/algorithms-for-recovery-and-isolation-exploiting-semantics-aries-d904765fb9b8)

## Prevent un-committed data flush

- *STEAL* 은 commit 되지 않은 update 가 disk 로 flush 되는 것을 허락하는 정책이고,
- *NO_STEAL* 은 반대로 commit 되지 않은 update 는 disk 로 flush 되는 것을 금지하는 정책이다.

### FORCE 와의 차이

- *NO_STEAL* 을 다르게 생각하면 commit 되어야만 disk 로 flush 될 수 있는 것이기에 [[FORCE, NO_FORCE (Database)|FORCE]] 와 동일한거 아닌가 라고 생각할 수 있다.
- 또한 FORCE 를 사용하게 되면 commit 과정에서 flush 를 하게 되니 (원칙적으로는 commit 되지 않은 데이터가 flush 되는 것이므로) STEAL 정책과는 호환되지 않는 것 아닌가 하는 생각이 들 수 있다.
- 하지만 *STEAL*, *NO_STEAL* 와 *FORCE*, *NO_FORCE* 는 조금 느낌이 다르다.
	- *FORCE*, *NO_FORCE* 는 commit 과정에서 persistency 를 보장할지 말지를 선택하는 정책이고,
	- *STEAL*, *NO_STEAL* 은 commit 과정과는 무관한 것이다.
		- 가령 memory 가 부족해 buffer pool manager 가 일부 page 를 disk 로 evict 한다고 해보자.
		- 근데 이 page 들에는 commit 되지 않은 데이터들이 포함되어 있을 수도 있고, 그럼 얘네들을 flush 하는 것은 commit 된 데이터를 commit 되지 않은 데이터가 overwrite 하는 것이기에 위험하다고 할 수 있다.
		- 이런 상황에 대한 정책이 *STEAL*, *NO_STEAL* 인 것.

### 장단점

- Recovery 의 관점에서 보자면:
	- *STEAL* 의 경우에는 uncommitted data 가 disk 에 저장되기 떄문에 recovery 시에 [[Undo Log (Database)|UNDO]] 를 이용해 다 되돌려줘야 한다는 부담이 있다.
	- 반면에 *NO_STEAL* 의 경우에는 crash 의 상황에서 어차피 memory 에 있던 애들이 날아가고 disk 에는 committed data 만이 있기 때문에 별다른 조치를 취하지 않아도 된다.
- 하지만 *NO_STEAL* 의 경우에는 그만큼 메모리에 들고 있어야 하는 데이터의 양이 많아지기 때문에 memory pressure 가 쉽게 발생할 수 있다는 단점이 있다.