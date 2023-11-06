## 용어 설명

- 디스크에 파일 형태로 저장된 [[Document (ElasticSearch)|문서]] 를 읽어들이는 API 인데
- 이 용어 자체보다는 작동 과정을 아는게 더 중허겠지

## 작동 과정

- 일단 [[Apache Lucene|Lucene]] 은 [[Document (ElasticSearch)|문서]] 들을 파일 형태로 저장하는데
- [[Read API (Lucene)|읽기 작업]] 을 하기 위해서는 open syscall 이 호출되어 메모리공간으로 올라간다
- 따라서 이 시점에 읽어와진 내용만이 검색에 반영된다
	- 즉, 읽어와진 다음에 변경된 내용은 검색에 반영이 안된다
		- 예상컨데 [[Read API (Lucene)|Read API]] 로 올라온 메모리 공간과 [[Flush API (Lucene)|Flush API]] 에서 사용하는 메모리 버퍼는 다른 공간인 것 같다
		- 그렇기에 변경이 이루어 졌을 때 [[Read API (Lucene)|Read API]] 에 저장된 내용은 변경되지 않아 검색에 반영이 안되는 것 아닌가
- 변경된 내용을 검색 결과에 반영하기 위해서는 [[Flush API (Lucene)|Flush API]] 를 호출하고 파일을 다시 열어야 한다
	- 이 과정은 [[Refresh (ElasticSearch)|엘라스틱서치의 Refresh API]] 에 의해 구현된다