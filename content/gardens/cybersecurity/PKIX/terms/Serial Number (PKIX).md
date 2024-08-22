---
tags:
  - "#용어집"
  - pkix
date: 2023-12-11
---
> [!info]- 참고한 것들
> - [RFC5280](https://www.rfc-editor.org/rfc/rfc5280#section-4.1.2.2)

## 용어 설명

- [[Certificate Authority, CA (PKIX)|CA]] 가 [[Certificate (PKIX)|인증서]]를 발급해 줄 때, 발급한 인증서에 Unique Identifier 를 부여하기 위해 사용하는 값이다.
- 일반적으로는 다른 인증서랑 겹치지 않는 양의 정수를 이용해 값을 부여하나, 가령 Self-signed 인증서 등에서는 0 혹은 음의 정수를 사용하기도 한다고 한다.