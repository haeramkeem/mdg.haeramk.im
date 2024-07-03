---
tags:
  - cpp
date: 2024-05-08
---
> [!info]- 참고한 것들
> - [스댕오버플로](https://stackoverflow.com/a/51234964)

## 뭘?

- STL 의 `size()` 함수를 사용할 때에는 조심해야 할 것이 있다.
- 바로 `size()` 의 결과는 `unsigned` [^unsigned-size] 라는 것.
- 고로 이 값에 사칙연산을 때릴 때에는 예상치 못한 상황이 발생할 수 있는데, 바로 사칙연산의 결과로 음수가 될 때이다.
- `signed` 에서는 음수를 2의 보수로 처리하고, `unsigned` 는 이것을 2의 보수가 아닌 그냥 곧이곧대로 받아들이기 때문에 음수가 아닌 음청나게 큰 수가 된다.
	- 가령, `-1` 는 `2^64 - 1 == 18446744073709551615` 와 같다.
- 확인해 보자.

### Code reference

- 아래 코드를 실행해 보면 자신있게 출력 결과가 모두 `-1` 이라고 생각할 수 있다.

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include <queue>
#include <stack>

using namespace std;

int main() {
    vector<int> vtr;
    list<int> lst;
    deque<int> dq;
    queue<int> q;
    stack<int> stk;

    cout << (vtr.size() - 1) << endl;
    cout << (lst.size() - 1) << endl;
    cout << (dq.size() - 1) << endl;
    cout << (q.size() - 1) << endl;
    cout << (stk.size() - 1) << endl;
}
```

- 하지만 그렇지 않다는 것.

```
18446744073709551615
18446744073709551615
18446744073709551615
18446744073709551615
18446744073709551615
```

---
[^unsigned-size]: 무조건인지 아닌지 (뭐 설정할 수 있는 방법이 있거나) 는 모르겠다.