---
tags:
  - terms
  - storage
date: 2024-03-30
aliases:
  - LBA
---
> [!info]- 참고한 것들
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/15/coding-for-ssd-part-3/)
> - [고급운영체제 (김진수 교수님 '24H1, SNU CSE)](http://csl.snu.ac.kr/courses/4190.568/2024-1/)

## 이게 뭐임

- Storage 를 고정크기인 *Block* 들의 1차원 배열로 나타내는 논리적인 주소 공간.
	- Virtual memory 공간의 storage 버전인 셈.
	- 반대 개념으로는 [[Physical Block Address, PBA (Storage)|PBA]] 가 있다.
- 이 공간은 논리적인 공간인 만큼, block 들에는 아무런 제약도 걸려있지 않다고 보면 된다:
	- LBA 주소를 통해 Random access 가능
	- Read, write, overwrite 가능

## 등장 배경

- 원래 HDD 는 block 을 3차원 주소로 나타내는 [[Cylinder Head Section, CHS (Storage)|CHS]] 라는 주소체계를 사용했는데,
- 이 방식은 track 의 길이에 무관하게 track 당 일정한 개수의 block 을 가지는 문제점이 있어서
- 길이가 긴 track 에는 더 많은 block 을 담도록 하고 주소도 1차원 주소 공간으로 바꾸면서 나온 것이 이 LBA 이다.
- 따라서 논리적인 공간인 LBA 의 주소를 물리적인 실제 주소 (PBA) 로 바꿔주는 로직이 각 storage device 의 펌웨어에 포함된다
	- [[Flash Memory, SSD (Storage)|SSD]] 의 경우에는 [[Flash Translation Layer, FTL (Storage)|FTL]] 이 그 역할을 한다.