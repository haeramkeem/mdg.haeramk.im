---
tags:
  - database
  - db-benchmark
date: 2024-08-23
---
> [!info]- 참조한 것들
> - [TPC-H Spec](https://www.tpc.org/tpc_documents_current_versions/pdf/tpc-h_v2.17.1.pdf)

## OLAP Benchmark

> [!warning] #draft 내용 추가
> - 일단 당장 급한 TPC-H ERD 만 첨부하고 자세한 설명은 나중에 적자

![[Pasted image 20240823100809.png]]

- TPC-H 는 TPC 시리즈 중에서 "의사 결정 지원 시스템" 을 벤치마크할 용도로 설계된 것이다.
	- 즉, [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] 벤치마크 용도인 것.
- 위의 ER Diagram 을 보면 알 수 있듯이, [[TPC-C (Database Benchmark)|TPC-C]] 처럼 온라인 커머스 비즈니스를 모사하고 있다.

## Dataset 생성해보기

> [!warning] #draft 나중에..