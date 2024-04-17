---
tags:
  - cpp
---
> [!info]- 참고한 것들
> - [마소](https://learn.microsoft.com/en-us/cpp/cpp/main-function-command-line-args)

## 개요

- 뭐 프로덕션환경에서는 [C++ ArgParse](https://github.com/p-ranav/argparse) 와 같은 툴을 사용하겠지만
- 이런거 없이 간단하게 명령줄 인자를 받아 처리하기 예제 코드

## TL;DR!

- 코드

```cpp
#include <iostream>

using namespace std;

int main(int argc, char *argv[]) {
    // argc: Argument Count (naming convention), Always greater than 0
    // argv: Argument Value (naming convention), Starts with binary name
    for (int i = 0; i < argc; i++) {
        cout << argv[i] << endl;
    }
}
```

- 컴파일 후 명령어 실행

```bash
./a.out holy moly guaca mole
```

- 표준출력

```
./a.out
holy
moly
guaca
mole
```