---
tags:
  - elasticsearch
date: 2023-11-06
---
## 용어 설명

- [[Document (ElasticSearch)|Document]] 의 모음
- 인데, [[Shard (ElasticSearch)|Shard]] 로 분산되어 저장된다

## 분산 저장, 검색

```
         -> SHARD -> LUCENE INDEX
ES INDEX -> SHARD -> LUCENE INDEX
         -> SHARD -> LUCENE INDEX
```

- 아래의 세 정보를 조합하면,
	- [[Index (ElasticSearch)|ES Index]] 는 여러개의 [[Shard (ElasticSearch)|Shard]] 로 구성
	- [[Shard (ElasticSearch)|Shard]] 는 [[Index (Lucene)|Lucene Index]] 와 1:1 대응
	- [[Apache Lucene|Lucene]] 은 하나의 [[Index (Lucene)|Lucene Index]] 내에서 검색
- [[ElasticSearch|ES]] 는 여러 [[Shard (ElasticSearch)|Shard]] 에 걸쳐서 검색이 가능하다는 것을 알 수 있다
	- 즉, Lucene 은 하나의 Lucene Index 에서만 검색이 가능하지만,
	- (아마 Lucene Thread 를 여러개 돌리거나 해서) ES Index 안에 있는 여러 ES Shard 들에 대해 동시에 검색이 가능하다
	- 그래서 새 문서가 생성되면 여러 ES Shard 에 분산 저장, 색인하고 읽어들일때도 여러 ES Shard 에서 문서를 읽어들여 합친다
- [[ElasticSearch|ES]] 는 [[Apache Lucene|Lucene]] 을 분산 처리가 가능하도록 확장한 솔루션 이라고 생각할 수 있는 것
