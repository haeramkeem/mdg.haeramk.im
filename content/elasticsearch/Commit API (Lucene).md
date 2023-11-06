## 용어 설명

- [[Flush API (Lucene)|Lucene Flush]] 는 시스템의 페이지 캐시에 데이터를 넘겨주는 것까지만 한다
	- 즉, 실제로 디스크로 내려보내는게 아닌 메모리버퍼의 내용을 _메모리에 있는_ 페이지 캐시에 저장해서 커널의 Paging memory management 에 의해 디스크로 내려갈 수 있게 한다
- 따라서 [[Apache Lucene|Lucene]] 은 주기적으로 fsync syscall 을 날려 커널의 Paging memory management 가 페이지 캐시에 있는 내용을 디스크로 내려보내도록 하는데, 이것을 [[Commit API (Lucene)|Lucene Commit]] 이라고 한다
- 하지만 그래도 [[ElasticSearch|ES]] 의 입장에서 볼때 [[Flush API (Lucene)|Lucene Flush]] 를 하는 것은 파일로 저장된 것이나 마찬가지의 효과이다
	- _즉, [[Flush API (Lucene)|Lucene Flush]] 에 추가적으로 [[Commit API (Lucene)|Lucene Commit]] 까지 되어야 수정사항이 검색결과에 반영되는게 아니다 이거야_
	- 페이지 캐시라는 것이 IO 성능을 높이기 위해 디스크의 내용을 메모리에 캐싱해 놓은 것이기 때문에, open syscall 을 호출한 client 의 입장에서 볼때 open 이후 process memory 공간에 들어온 데이터가 디스크에서 가져온 것인지 캐싱된 내용을 가져온 것인지 구분하지 못한다
- 따라서 [[Commit API (Lucene)|Lucene Commit]] 은 새로고침의 목적이 아닌 영속성의 목적이다
	- 즉, 수정사항을 검색결과에 반영하기 위해서는 [[Flush API (Lucene)|Lucene Flush]] 로 충분하고
	- 재부팅 등의 상황으로 인해 메모리의 내용이 날아갔을 때에도 데이터 손실이 없도록 하는 Persistent 의 목적이다
- 이 과정은 [[Flush (ElasticSearch)|엘라스틱서치의 Flush 과정]] 에서 수행된다