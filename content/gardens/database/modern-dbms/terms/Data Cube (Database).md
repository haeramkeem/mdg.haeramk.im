---
tags:
  - database
date: 2024-07-18
---
> [!info]- 참고한 것들
> - [[01. Modern OLAP Databases|CMU-15721, Advanced Database Systems]]

## 1990s - Data Cubes

![[Pasted image 20240708160039.png]]

- *Data Cube* 라는 것은 한줄로 요약하면 *Pre-computed aggregation* 이다.
	- 기존의 RDBMS 에서 `AVG` 와 같은 aggregation 기억나제?
	- 이런 것들을 미리 다 계산해 놓은 다음에 저장해 놨다가
	- 이것에 대한 질의가 들어오면 얘네들만 꺼내서 반환하는 것.
- 이것은 DBA 가 어떤 것을 cube 로 만들지 지정해 놓으면, (가령 매일 밤에 cron job 을 돌리는 것과 같은) 특정 때에 얘네들이 계산되어 저장되고, 이에 대한 query 가 들어오면 계산해 놓은 cube 들을 이용해 응답하는 방식으로 이루어진다.
- 다만, 지금은 많이는 사용되지 않는다. 1990 년도에 유행했던 방식으로, 이것은 이후 2000 년도에 들어 [[Data Warehouse (Database)|Data Warehouse]] 로 진화한다.