---
tags:
  - 용어집
  - Storage
---
> [!info] 참고한 자료
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)
> - [고급운영체제 (김진수 교수님 '24H1, SNU CSE)](http://csl.snu.ac.kr/courses/4190.568/2024-1/)

## 란?

- [[Flash Memory, SSD (Storage)|SSD]] 는 셀 하나로 여러 비트를 표현하는 것이 가능하다. ([[Deep Dive SSD - Storing and Detecting Electrons (Storage)|어떻게?]])
	- 많이 표현하면 당연히 더 좋은게 아니겠는가 생각할 수 있지만, 기숙사랑 비슷한 느낌으로 생각하면 된다. 1인실이 제일 좋고 다인실 일수록 별로지만 가격은 싸다.
	- 마찬가지로, 셀이 비트를 적게 표현할수록 성능은 좋지만 가격은 비싸지게 된다.
	- 이는 전략적으로 사용하면 R/W 가 많은, 성능이 중요한 hot storage 에는 1인실 (SLC), R/W 는 비교적 적은 용량이 중요한 cold storage 에 는 다인실 (TLC) 로 구성할 수 있을 것이다.
- 표현 비트 갯수에 따라 (Single, Multiple, Triple, Quadra) Level Cell (*SLC*, *MLC*, *TLC*, *QLC*) 로 구분할 수 있다.
- 각각의 성능 비교는 카카오 테크 블로그 글에서 가져와 봤다:

![[Pasted image 20240313211934 1.png]]
> [출처](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)