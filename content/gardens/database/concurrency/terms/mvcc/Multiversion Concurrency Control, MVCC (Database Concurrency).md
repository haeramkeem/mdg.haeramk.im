---
tags:
  - database
  - db-concurrency
aliases:
  - MVCC
date: 2024-10-06
---
## 란?

- Concurrency control 을 하기 위한 전통적인 방법은 [[Two Phase Locking, 2PL (Database)|lock]] 이었다.
- 근데 이건 당연히 느리다.
	- Lock 이 해제될때까지 "기다려야" 하기 때문.
- 기존 방식은 어찌 보면 in-place update 를 하기 위해 그것에 대해 lock 을 잡고 작업하는 것이었다면,
- 여기에서의 lock 에 의한 문제점을 해결하기 위한 방식인 MVCC 는 out-of-place update 를 하여 lock 을 필요 없게 한 것이라 할 수 있다.
- 이게 뭔소린지 구체적으로 알아보자.

## Key idea of MVCC

> [!tip] High-level overview of MVCC
> - 여기 내용은 MVCC 에 대한 단순한 principle 이고, 이들의 실제 구현은 별도의 작물로 분리되어 있습니다.
> - Key idea 가 중요한 내용이며 실제 작동 원리는 이와 다를 수 있습니다.

- MVCC 의 가장 기본적인 아이디어는 다음의 두 개이다.
	- Out-of-place update 를 하여 lock 을 없애자. 이 out-of-place update data 들을 *Version* 이라고 부른다.
	- Read 할 때는, *Version* 들 중에서 read 시점에서 읽을 수 있는 *Version* 을 읽는다.
		- 이것을 *Snapshot-read* 라고 부르기도 한다.

![[Pasted image 20241006213742.png]]

- 위 그림으로 이해하면 더 쉽다.
	- 일단 update 가 발생하면 이 update 들을 원본 (data) 에 바로 반영하지 않고 chain 으로 주렁주렁 달아놓는다.
	- 그리고 read 를 할 때는, 이 chain 을 쭉 따라가다가 자신이 읽을 수 있는 것을 읽는다.
		- 가령 위의 그림에서는 2번째 update 를 수행한 놈은 read 시점에 이미 commit 된 상태고, 3번째 update 의 경우에는 read 시점에서는 commit 되지 않았기 때문에 2번째를 읽어간다.
- 다만 위의 예시에서는 최신의 update 가 tail 에 달리게 되는데, 이건 그냥 예시일 뿐이고 이렇지 않은 경우도 있다.
	- 여기서는 "Update 시에는 in-place 가 아니라 version 이 생성된다" 라는 것과 "Transaction timestamp 를 이용해 version 들 중에 내가 읽을 수 있는 것을 찾는다" 라는 아이디어에만 주목하자.