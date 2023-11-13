## 읽기

1. [[Read API (Lucene)|Lucene Read]] 를 통해 파일로 저장된 [[Document (ElasticSearch)|문서]] 를 메모리로 올림
2. 만일 [[Document (ElasticSearch)|문서]] 가 변경되었을 때에는, 주기적인 [[Refresh (ElasticSearch)|Refresh]] 작업 (혹은 명시적인 API 호출) 이후에야 변경사항이 반영됨

## (디스크에) 쓰기

![[Pasted image 20231107000420.png]]
> 이미지 출처: "엘라스틱서치 바이블", 여동현 저

1. 수정사항이 있으면 일단은 메모리 버퍼에 저장
2. [[Refresh (ElasticSearch)|ES Refresh]] 를 통해 [[Flush API (Lucene)|Lucene Flush]] 작업을 수행해서 수정사항이 논리적으로 파일에 저장될 수 있도록 함
3. [[Flush (ElasticSearch)|ES Flush]] 를 통해 [[Commit API (Lucene)|Lucene Commit]] 작업을 수행해서 수정사항이 물리적으로 파일에 저장될 수 있도록 함