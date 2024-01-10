## 용어 설명

- [[Flush API (Lucene)|Lucene 의 Flush]] 와 이름이 같아서 헷갈리긴 한데
- [[ElasticSearch|ES]] 에서 [[Commit API (Lucene)|Lucene Commit]] 을 호출해 데이터의 영속성을 보장 (디스크에 *진짜* 저장) 하는 과정을 말한다
- [[Flush (ElasticSearch)|ES Flush]] 는 [[Refresh (ElasticSearch)|ES Refresh]] 보다도 더 비용이 많이 드는 연산이기에, 이것도 수정사항이 있을 때 마다가 아닌, 적당한 주기마다 수행한다
	- 이것도 물론 [[ElasticSearch|ES]] 의 `Flush` API 를 사용하면 강제로 [[Flush (ElasticSearch)|ES Flush]] 를 수행할 수 있다