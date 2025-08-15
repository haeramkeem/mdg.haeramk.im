---
tags:
  - terms
  - network
  - tls
date: 2024-05-29
aliases:
  - Forward Secrecy
---
> [!info]- 참고한 것들
> - [[11. TLS|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 란?

- 지금 당장은 key 가 없어서 해독은 못하더라도, 일단은 암호문을 전부 다 모아놨다가
- 나중에 key 가 유출이 되면 이 암호문을 전부 다 해독해 버리는 방법이다.
- NSA 스타일이라고 한다.
- 이를 해결하기 위해 시간이 지나면 key 가 있어도 해독하지 못하는 ephimeral key algorithm (가령 [[Diffie-Hellman Ephimeral, DHE (PKC)|DHE]]) 이 제시되었다고 한다.