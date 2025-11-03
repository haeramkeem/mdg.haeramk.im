---
tags:
  - terms
  - data-structure
date: 2021-11-12
aliases:
  - Stack
  - Queue
  - Container Adapter
---
## Container Adapter

- 컨테이너 어답터는 간단하게 말해서 기존의 컨테이너의 기능을 축소시키는 것이다.
- 즉, 많은 기능을 제공하는 컨테이너를 하나 만들어놓고 그걸 기반으로 하되 특정 기능만 사용할 수 있게 함으로써 실수로 허용되지 않는 작업을 수행하는 것을 막을 수 있는 것이다.

## Stack, Queue

- Queue 와 Stack 이 이런 방식으로 구현되어 있다.
- 즉, [[Deque (Data Structure)|Deque]] 를 기반으로 하되 Stack 과 Queue 에 맞는 기능들만 사용할 수 있도록 제한하는 방식이다.
	- Stack 의 경우에는 deque 에서 `push_front()` 와 `pop_front()`, 혹은 `push_back()` 와 `pop_back()` 만 사용하도록 제한하는식으로 구현하고,
	- Queue 의 경우에는 deque 에서 `push_front()` 와 `pop_back()`, 혹은 `push_back()` 와 `pop_front()` 만 사용하도록 제한하는식으로 구현된다.