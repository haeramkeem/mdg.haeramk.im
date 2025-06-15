---
tags:
  - c
  - c-memory
date: 2025-06-15
---
> [!info]- 참고한 것들
> - [네이버 블로그](https://blog.naver.com/sysganda/30103851649)

## TL;DR

- [[Memory Dynamic Allocation (C Memory)|free]] 를 할때 간혹 이런 에러를 발견할 수도 있다:

```
free(): invalid next size (normal)
```

- 이 말은 [[Memory Dynamic Allocation (C Memory)|malloc]] 등으로 할당받은 영역보다 더 많은 영역에 write 했다는 것을 의미한다.
- 따라서 이놈을 해결하기 위해서는, 실제 얼만큼 할당받았는지, 그리고 할당받은 영역에 접근하는 것을 추적해서 어디에 접근하여 write 를 하고 있는지를 디버깅해보면 된다.