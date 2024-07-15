---
tags:
  - 용어집
  - Storage
date: 2024-03-16
---
> [!info]- 참고한 것들
> [카카오 테크 블로그](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)

## 스루풋, Throughput

- 범용적으로 말하면 단위 시간당 처리량 이지만
- Storage 관련해서 좀 더 구체적으로 말하면, 전송속도를 나타낸다.
- KB/s, MB/s 등의 단위를 사용하고
- Sequential r/w 벤치마크에 주로 사용된다고 한다.

## IOps 와의 차이?

- [[Input Output per second, IOps (storage)|IOps]] 도 결국에는 단위 시간당 어쩌고 이기 때문에 throughput 과 뭔차인가 싶을 수 있는데
- Storage 에서 throughput 은 IOps 뿐 아니라 [[Data Chunk (Storage)|데이터 청크의 길이]]에도 영향을 받는다.
	- 가령 데이터 청크 길이가 4Kb 이고 1k IOps 를 가지고 있다면 이놈의 throughput 은 4Mb/s 로 말할 수 있는 것.
- 또한 데이터 r/w 에 대해서도 sequential 하게 처리는지 아니면 random 하게 처리하는 지에 따라서도 IOps 와 throughput 은 차이를 보일 수 있다.
	- 즉, IOps 와 데이터 청크의 길이가 같아도 sequential 인지, random 인지에 따라서 throughput 은 달라질 수 있다.
	- [이 친구의 경험](https://codecapsule.com/2014/02/12/coding-for-ssds-part-2-architecture-of-an-ssd-and-benchmarking/) 에 따르면, sequential 일 때 throughput 이 10배 가량 더 좋았다고 한다.