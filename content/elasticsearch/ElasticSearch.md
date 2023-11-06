---
aliases:
  - ElasticSearch
---
## Architecture

![[Pasted image 20231106172020.png]]

- 물리적으로 봤을 때, [[Cluster|Cluster]] 하나는 여러개의 [[Node|Node]] 로 구성된다
- 논리적으로 봤을 때에는, [[Document|Document]] 들이 모여 [[elasticsearch/Index|Index]] 가 되고, 이것이 [[Cluster|Cluster]] 내에서의 검색 단위가 된다
- [[elasticsearch/Index|Index]] 는 각 [[Node|Node]] 에 [[Shard|Shard]] 란 이름으로 분산 저장된다