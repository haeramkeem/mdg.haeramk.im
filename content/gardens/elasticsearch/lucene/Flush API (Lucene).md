---
tags:
  - elasticsearch
date: 2023-11-06
---
## 용어 설명

- 메모리 버퍼에 임시로 저장된 [[Document (ElasticSearch)|Document]] 를 디스크로 내려보내는 [[Apache Lucene|Lucene]] 의 API
- Write 요청이 있을때마다 디스크 IO 를 하면 비효율적이기 때문에 문서가 [[Indexing (ElasticSearch)|색인]] 되면 메모리 버퍼에 들고 있게 됨
- 그러다가 적당한 시기마다 디스크로 내려보내게 되고, 이때의 디스크로 내려보내는 작업을 [[Flush API (Lucene)|Flush]] 라고 한다
	- 다만, 진짜로 디스크에 쓰는게 아니라 커널에 디스크에 써달라고 전달만 한다
	- 진짜로 디스크에 쓰는 것은 [[Commit API (Lucene)]] 에서 수행된다