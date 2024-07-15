---
tags:
  - elasticsearch
date: 2023-11-06
---
## 용어 설명

- [[Document (ElasticSearch)|문서]] 가 변경되었을 때, 이것을 [[Flush API (Lucene)|디스크에 반영]] 하고 파일을 다시 open 하여 검색 결과에 반영되도록 하는 과정
- [[Refresh (ElasticSearch)|Refresh]] 과정은 비용이 많이 드는 연산으로, 변경될 때마다 하지 않고 _적절한_ 시기마다 주기적으로 수행한다
	- 물론 [[ElasticSearch|ES]] 의 `Refresh` API 를 사용하면 강제로 실행할 수도 있다
## Code Ref

- [[Apache Lucene|Lucene]] 의 `DirectoryReader` 클래스로 파일을 열고 색인에 접근하기 위한 객체인 `IndexReader` 를 얻는다
- 수정사항을 검색에 반영하기 위해서는 `DirectoryReader.openIfChanged` 를 통해 파일을 새로 열어주고, `IndexReader` 를 새로 받은 후 기존의 `IndexReader` 는 닫아서 반영이 되게 함
	- `DirectoryReader.openIfChanged` 를 통해 아마 [[Flush API (Lucene)|Lucene Flush]] 작업이 이루어지는 것 같음
- [Elasticsearch 의 `refreshIfNeeded` 메소드](https://github.com/elastic/elasticsearch/blob/main/server/src/main/java/org/elasticsearch/index/engine/ElasticsearchReaderManager.java#L46-L49)
- [ElasticSearch 의 `createReaderManager` 메소드](https://github.com/elastic/elasticsearch/blob/main/server/src/main/java/org/elasticsearch/index/engine/InternalEngine.java#L760-L788)