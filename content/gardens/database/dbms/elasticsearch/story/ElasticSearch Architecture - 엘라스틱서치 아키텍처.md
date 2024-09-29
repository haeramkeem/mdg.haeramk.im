---
tags:
  - elasticsearch
date: 2023-11-06
---
## 오버뷰

![[Pasted image 20231106172020.png]]
> 이미지 출처: "엘라스틱서치 바이블", 여동현 저

- 물리적으로 봤을 때, [[Cluster (ElasticSearch)|Cluster]] 하나는 여러개의 [[Node (ElasticSearch)|Node]] 로 구성된다
- 논리적으로 봤을 때에는, [[Document (ElasticSearch)|Document]] 들이 모여 [[Index (ElasticSearch)|Index]] 가 되고, 이것이 [[Cluster (ElasticSearch)|Cluster]] 내에서의 검색 단위가 된다
- [[Index (ElasticSearch)|Index]] 는 각 [[Node (ElasticSearch)|Node]] 에 [[Shard (ElasticSearch)|Shard]] 란 이름으로 분산 저장된다