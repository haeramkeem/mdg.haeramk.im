---
tags:
  - cpp
  - cpp-async
date: 2024-07-13
---
> [!info]- 참고한 것들
> - [스댕](https://stackoverflow.com/a/12335206)

## 란?

- 자바스크립트를 해보았다면, 어느정도 친숙한 개념인데
- 이것은 "미래에 어떤 값을 주겠다는 약속" 으로, 스레드나 비동기 프로그래밍에서 유용하게 사용된다.
- 가령 다음의 군대 후임이 전역복을 맞춰주겠다고 가져가서는 그것을 잃어버려 예비군에 입고 갈 군복이 없는 "동작구 김씨" 상황을 생각해 보자.
	- "동작구 김씨" 는 예비군에 가기 위해 "동대문구 김씨" 에게 군복을 빌리고, 그것을 예비군 갔다 와서 나중에 돌려주겠다는 *약속* 를 한다.
	- "동작구 김씨" 는 군복을 입고 예비군에 가고, "동대문구 김씨" 는 그 시간에 회사에 출근한다.
	- 각자의 삶을 살다가 이번에는 "동대문구 김씨" 가 예비군에 갈 차례이다.
	- "동대문구 김씨" 는 "동작구 김씨" 가 군복을 되돌려 주기를 *기다리고*, "동작구 김씨" 는 군복을 되돌려 줌으로써 *약속을 이행* 한다.
	- "동대문구 김씨" 는 이 군복을 받아 예비군에 간다.
- 위 예시를 정리해 보면 다음과 같다.
	- 두 멍청이는 일련의 *약속* 을 한다.
	- 그리고 각자 독립적으로 살아간다.
	- 마지막으로, 어느 시점이 되면 한 놈은 *기다리고*, 한 놈은 *약속을 이행* 한다.
- 즉, 이 *약속* 을 통해 독립적인 흐름을 가지는 여러 개체가 문제 없이 어떤 것을 주고받을 수 있게 된것이다.
- 이제 코드를 보자.

```cpp
#include <future>
#include <iostream>
#include <thread>
#include <chrono>

void Waiting(std::promise<int>* prom) {
	std::this_thread::sleep_for(std::chrono::seconds(10));
	prom->set_value(12345);
}

int main() {
	std::promise<int> prom;
	std::thread t(Waiting, &prom);
	auto future = prom.get_future();
	for (int i = 0; i < 10; i++) {
		future.wait_for(std::chrono::seconds(1));
		std::cout << "Waiting (" << i + 1 <<
			") seconds for the thread to stop..." << std::endl;
	}
	t.join();
	future.wait();
	std::cout << "done." << std::endl;
	auto val = future.get();
	std::cout << "Thread ends with (" << val << ")" << std::endl;
	return 0;
}
```

```
Waiting (1) seconds for the thread to stop...
Waiting (2) seconds for the thread to stop...
Waiting (3) seconds for the thread to stop...
Waiting (4) seconds for the thread to stop...
Waiting (5) seconds for the thread to stop...
Waiting (6) seconds for the thread to stop...
Waiting (7) seconds for the thread to stop...
Waiting (8) seconds for the thread to stop...
Waiting (9) seconds for the thread to stop...
Waiting (10) seconds for the thread to stop...
done.
Thread ends with (12345)
```

- 읽어 보면 별로 어려운 코드는 아니다; 한 놈은 10초동안 자고, 한 놈은 1초씩 기다리는 코드이다.
- 위 예제에서 주목해야 할 것은 우선:

```cpp title="Line: 12-13"
...
std::promise<int> prom;
std::thread t(Waiting, &prom);
...
```

- 기본적인 `std::promise` 생성법인데,
- 주의할 것은 `std::promise` 는 non-copiable 이라는 것이다.
	- 따라서 위 예시처럼 포인터를 사용하거나,
	- 아니면 [[Cpp - 소유권 (move)|std::move]] 를 이용해 전달해 주어야 한다.

```cpp title="Line: 8"
prom->set_value(12345);
```

- 그리고 위와 같이 `std::promise::set_value()` 로 약속을 이행할 수 있다.

```cpp title="Line: 14,16,21,23"
...
auto future = prom.get_future();
...
future.wait_for(std::chrono::seconds(1));
...
future.wait();
...
auto val = future.get();
...
```

- 그리고 이 `std::future` 은 약속이 이행되는 것을 기다리기 위한 클래스이다.
- 가장 간단하게는 `std::promise::get_future()` 로 받아낼 수 있다.
- 그리고, `std::future::wait()` 으로 약속이 이행될 때 까지 기다릴 수 있다.
	- 추가적으로 위 예시에서처럼 `std::future::wait_for()` 로 일정 기간동안만 기다릴 수도 있다.
- 약속이 이행된 다음에는, `std::future::get()` 으로 결과를 받아올 수 있다.
	- 이 함수 또한, `std::future::wait()` 과 동일하게 약속이 이행되지 않았으면 기다린다.
		- 즉, `std::future::get()` 을 쓸 거면 `std::future::wait()` 은 굳이 안써도 된다는 것.
	- 다만 이 함수는 여러번 호출되면 안된다는 것에 주의하자.