> [!warning] DEPRECATED 된 개념임

## 용어 설명

- [[Index (ElasticSearch)|Index]] 내에서 [[Document (ElasticSearch)|Document]] 들을 논리적으로 묶는 단위

## 이 개념은 폐기되었다

- 지금은 [[Document (ElasticSearch)|Document]] 들을 논리적으로 묶고싶다면 그냥 새로운 [[Index (ElasticSearch)|Index]] 를 생성해야 한다
- Backward-compability 를 위해 [[_doc (ElasticSearch)|_doc]] 이라는 [[Type (ElasticSearch)|Type]] 하나만 사용한다
	- 즉, API 에 [[Type (ElasticSearch)|Type]] 을 명시하는 부분에 [[_doc (ElasticSearch)|_doc]] 외에는 다른 것이 올 수 없다