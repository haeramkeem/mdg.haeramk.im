---
tags:
  - database
  - db-benchmark
date: 2024-08-23
---
> [!info]- 참조한 것들
> - [TPC-C Spec](https://tpc.org/TPC_Documents_Current_Versions/pdf/tpc-c_v5.11.0.pdf)

## OLTP Benchmark

> [!warning] #draft 내용 추가
> - 일단 당장 급한 TPC-C ERD 만 첨부해놓고 설명은 나중에 적자

![[Pasted image 20240823104722.png]]

- TPC-C 는 TPC 시리즈 중에서 [[On-Line Transactional Processing, OLTP (Modern Database)|OLTP]] 를 벤치마크하기 위해 설계된 것이다.
- 위의 ER Diagram 을 보면 알 수 있듯이, 온라인 커머스 비즈니스를 모사하고 있다.

## Dataset 생성해보기

> [!warning] #draft 나중에..