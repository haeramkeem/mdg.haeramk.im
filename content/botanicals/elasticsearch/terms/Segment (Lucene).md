## 용어 설명

- [[Segment (Lucene)|Lucene Segment]] 는 [[Document (ElasticSearch)|문서 파일]] 들의 집합이다
- [[Apache Lucene|Lucene]] 은 모든 [[Segment (Lucene)|Lucene Segment]] 을 대상으로 하여 검색한다

## 불변 (Immutable) 성

- [[Segment (Lucene)|Lucene Segment]] 는 불변 (Immutable) 한 성질을 가지고 있다
	- 즉, 새 문서가 생성되면 [[Segment (Lucene)|Lucene Segment]] 가 추가되고,
	- 삭제되면 삭제 플래그만 걸어놓으며,
	- 변경되면 삭제 플래그를 걸어놓은 상태로 새로 [[Segment (Lucene)|Lucene Segment]] 를 생성한다
- 이때, [[Segment (Lucene)|Lucene Segment]] 가 무한히 늘어나는 것을 막기 위해 자동으로 [[Merge (Lucene)|Merge]] 작업이 수행된다