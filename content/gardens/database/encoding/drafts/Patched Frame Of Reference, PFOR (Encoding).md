---
tags:
  - Database
  - db-encoding
date: 2024-08-06
---


## Patched FOR, PFOR

- 만약에 대부분의 숫자들은 슷비슷비한 범위에 몰려있는데, 어떤 값만 갑자기 튀어서 이 FOR 를 못쓰게 된다면 너무 아까울 것이다.
- 그래서 이런 튀는 값들에 대해서는 *Exception* 으로 따로 처리하는 방법이 *Patched FOR*, *PFOR* 이다.
- 