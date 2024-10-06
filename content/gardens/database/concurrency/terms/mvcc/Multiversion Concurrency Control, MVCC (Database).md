---
tags:
  - database
  - db-concurrency
aliases:
  - MVCC
date: 2024-10-06
---
## 란?

- Concurrency control 을 하기 위한 전통적인 방법은 [[Two Phase Locking, 2PL (Database)|lock]] 이었다.
- 근데 이건 당연히 느리다.
	- 