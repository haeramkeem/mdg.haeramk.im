---
tags:
  - database
  - db-transaction
aliases:
  - New-to-old
  - N2O
  - Undo versioning
  - Delta versioning
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

## N2O

- 이름 그대로 최신 버전 (New) 부터 옛날 버전 순서대로 연결하는 [[Multiversion Concurrency Control, MVCC (Database Transaction)|MVCC]] 구현체를 일컫는다.
	- 이것을 Undo log 를 저장한다고 해서 *Undo versioning* 이라고도 하고
	- Undo log 에는 변경사항만 적히기 때문에 *Delta versioning* 이라고도 한다.