---
tags:
  - cmu-15445
  - database
  - bustub
date: 2024-07-11
---
> [!info]- 참고한 것들
> - [가이드](https://15445.courses.cs.cmu.edu/fall2023/project1/)

> [!info]- CodeRef (인데 private 이라 주인장만 볼 수 있음)
> - [Github PR06](https://github.com/haeramkeem/bustub-private.idbs.fall.2023.cs.cmu.edu/pull/6)

## Overview

- 여기서는 2개의 함수만 구현하면 된다:
	- `DiskScheduler::Schedule`: `DiskScheduler` 로 새로운 `DiskRequest` 를 스케줄링하는 API
	- `DiskScheduler::StartWorkerThread`: Background worker 가 실행할 함수
- 그리 길지 않으니 빠르게 보고 가자.

## `DiskScheduler::Schedule`

- 여기서는 `DiskScheduler` 에 기본 내장되어 있는 thread-safe shared queue 인 `request_queue_` 에 인자로 받은 `DiskRequest` 객체를 넣어주기만 하면 된다.
	- 즉, insert 하는 코드 한줄로 끝낼 수 있다는 얘기.
- 어차피 `request_queue_` 가 thread-safe 하기 때문에, 별도로 lock 에 대한 고려는 안해도 되고, `Channel::Put()` 이라는 insert API 도 제공해 주기 때문에, 별로 어려울 것은 없다.
- 다만, queue element type 이 `std::optional` 이기 때문에 여기서 좀 애를 먹긴 했다.
	- `DiskRequest` 를 `std::optional<DiskRequest>` 로 변환할 때 `call to implicitly-deleted copy constructor` 에러가 계속 나는 것이 문제였다.
	- 그래서 뭐 `DiskRequest` 에 [[Copy constructor, 복사 생성자 (C++ Class)|copy constructor]] 도 구현해 보고 별 짓을 다 해봤지만
	- 결론적으로 말하면 `DiskRequest` 의 member 인 `callback_` 이 `std::promise` 여서 [[Copy constructor, 복사 생성자 (C++ Class)|copy constructor]] 나 [[Copy assignment operator, 복사 대입 연산자 (C++ Class)|copy assignment operator]] 를 지원하지 않아 [[소유권, move (C++)|move]] 를 해줌으로써 해결했다.

## `DiskScheduler::StartWorkerThread`

- 스레드를 위한 함수인 만큼 무한루프를 돌며 `request_queue_` 에서 값을 받아와 처리하는 짓만 반복하도록 구현하는, 코드 길이 자체는 그리 길지 않은 작업이었다.
	- 어차피 실제 IO 작업은 `DiskManager` 라는 class 에서 수행하기 때문에 IO 를 직접 구현하지 않아도 되기 때문.
	- `DiskScheduler` 가 제거될 때 `request_queue_` 에 `std::nullopt` 를 넣어주기 때문에 queue 에서 꺼낸 값이 이것이 아닌 한 반복문을 돌며 queue 에서 꺼내 `DiskManager` object 에 던져주기만 하면 된다.
- 마지막에는 `DiskRequst` object 에 작업이 끝났음을 알리는 `callback_` promise 에 `true` 값만 넣어주고 다음 request 를 기다리면 된다.
- 다만 여기서 삽질한 것은 request 가 하나씩 누락되는 문제였다.
	- 처음에는 `while (this->request_queue_.Get() != std::nullopt)` 로 반복문을 돌았는데
	- Request 가 하나씩 누락되어 write 를 처리하지 않고 read 를 해 런타임 에러가 나는 상황이 발생했다.
	- 근데 확인해 보니 Bustub 에서 제공하는 `Channel::Get()` 함수는 일반 STL 의 `std::queue` 와 다르게 값을 "꺼내" 주는 것이었다.
		- STL 의 `std::queue::front()` 는 값을 확인하게 해주고 queue 상태는 바뀌지 않지만
		- `Channel::Get()` 은 소유권을 이전하고 값을 꺼내기 때문에 이것을 호출하는 것만으로 queue 에서 값이 pop 된다.
		- 따라서 원소가 소진되는 것을 막기 위해 `for (auto req = this->request_queue_.Get(); req != std::nullopt; req = this->request_queue_.Get())` 로 변경하여 해결.

## C++ 관련 삽질

- [[Optional 소개 (C++ Optional)]]
- [[Optional 객체 사용하기, bugprone-unchecked-optional-access 에러 (C++ Optional)]]
- [[Optional 객체 생성하기 (C++ Optional)]]
- [[Promise, future 사용법 (C++ Async)]]
- [[Constructor, 생성자 (C++ Class)]]
- [[Copy assignment operator, 복사 대입 연산자 (C++ Class)]]
- [[Copy constructor, 복사 생성자 (C++ Class)]]
- [[Destructor, 소멸자 (C++ Class)]]
- [[Move constructor, 이동 생성자 (C++ Class)]]