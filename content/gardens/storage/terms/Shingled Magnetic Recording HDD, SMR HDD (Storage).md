---
tags:
  - storage
  - terms
date: 2024-03-30
---
> [!info]- 참고한 것들
> - [고급운영체제 (김진수 교수님 '24H1, SNU CSE)](http://csl.snu.ac.kr/courses/4190.568/2024-1/)

## 이게 뭐고

- HDD 는 write 작업에 필요되는 너비와 read 작업에 필요되는 너비가 다르다고 한다.
	- Write 이 read 보다 더 넓은 너비를 차지하게 된다.
- 따라서 이전의 [[Conventional Magnetic Recording, CMR HDD (Storage)|CMR HDD]] 에서는 in-place update 를 가능하게 해 빠른 데이터 수정을 지원하기 위해 write 너비를 기준으로 track 의 너비를 산정했다:

![[Pasted image 20240320125416.png]]

- 하지만 이 방식은 디스크의 용량이 작아지게 된다는 단점이 있었기에, SMR HDD 에서는 다음과 같은 방식으로 데이터를 저장한다:

![[Pasted image 20240320124600.png]]

- 즉, write 너비 중 read 에 사용되지 않는 공간을 다음 track 에서 write 시에 overwrite 해버리는 것.
- 이렇게 중첨해서 write 하는 것이 집의 지붕을 만들 때 널빤지를 중첩해서 붙이는 것 (Roof shingle - 아래 그림 참고) 과 비슷하다고 하여 Shingled Magnetic Recording 이란 이름이 붙게 되었다.

![[Pasted image 20240320130919.png]]
> [사진 출처: 위키피디아](https://en.wikipedia.org/wiki/Roof_shingle)

- 이렇게 하면 다음과 같은 장단점이 있다.

## 좋은점

- Track 의 너비가 read 너비와 같아지기에, CMR 방식보다 track 의 너비가 좁아져 디스크의 용량이 늘어나게 된다.

## 나쁜점

- In-place update 가 불가능하다.
	- 따지고 보면 당연한 일이다. 데이터의 특정 부분을 수정하기 위해 해당 부분을 write 해버리면 다음 track 의 read 공간이 훼손되기에 해당 데이터를 전부 read 한 다음 다른 곳에 새로 write 하는 수밖에 없다. (Read-modify-update)
	- 즉, 특성이 [[Flash Memory, SSD (Storage)|SSD]] 와 비슷해져 버리게 되는 것.