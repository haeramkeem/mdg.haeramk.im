---
tags:
  - terms
  - storage
date: 2024-03-16
---
> [!info]- 참고한 것들
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/15/coding-for-ssd-part-3)

## 이게 뭐람

- 데이터를 읽는 것은 주변 cell 들의 상태를 변경할 수도 있어서 결과적으로는 주변 cell 의 데이터를 잘못 읽어오는 현상이 발생할 수도 있다고 한다.
- 이를 위해 주기적으로 block 들을 이동시키기도 한다.