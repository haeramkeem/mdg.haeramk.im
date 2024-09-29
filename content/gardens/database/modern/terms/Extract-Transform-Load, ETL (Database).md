---
tags:
  - database
date: 2024-07-18
---
> [!info]- 참고한 것들
> - [[01. Modern OLAP Databases|CMU-15721, Advanced Database Systems]]

## 꺼내서, 바꾸고, 다시 넣기

![[Pasted image 20240708162624.png]]

- 사실 제곧내이다.
	- ([[On-Line Transactional Processing, OLTP (Database)|OLTP]] 의 데이터를) 꺼내서,
	- ([[On-Line Analytical Processing, OLAP (Database)|OLAP]] 에 사용하기 편한 형태로) 바꾸고,
	- ([[On-Line Analytical Processing, OLAP (Database)|OLAP]] 에) 넣어주는 놈을 일컫는다.

## Modern OLAP DBMS

- 근데 왜 이런 짓을 할까? [[Relational Data Model (Database)|Relational data]] 의 경우를 생각해 보자.
- 여기에서, 보통은 [[Relation (Relational Model)|tuple]] 단위로 데이터를 저장하게 된다.
	- 즉, 한 tuple 은 연속된 공간에 저장하게 된다는 것.
	- 이것을 *row-store* 라고도 한다.
- 근데 analytics 를 할 때는 tuple 의 모든 데이터가 필요한 것이 아니라, tuple 의 특정 column 값만 필요한 경우가 많다.
	- 가령 어떤 수업에서의 학생들 점수 분포를 계산하고자 할 때는 점수표에서 학번 column 보다는 점수 column 의 데이터가 필요한 것을 생각하면 된다.
- 근데 문제는 row-store 에서는 특정 column 의 값을 알아내기 위해서는 해당 tuple 전체를 disk 에서 읽어와야 한다는 것이고, (불필요한 부분 또한 읽어들이기에) 이것이 너무 비효율적이라는 것이다.
- 따라서 이런 row-store 를 column 별로 쪼개서 하나의 column 에 속한 데이터들을 연속된 공간에 저장하는 방식 (이것을 column-store 라고 한다.) 으로 "변환" 하면 이런 불필요한 read 가 없기 때문에 더 효율적일 것이다.
- 이러한 "변환" 을 위해 ETL 이 있는 것.