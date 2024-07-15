---
tags:
  - 용어집
  - Storage
date: 2024-03-16
---
> [!info]- 참고한 것들
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/16/coding-for-ssd-part-4/)

## 이게 뭐람

- TRIM (Deallocation) 기능은 Host 가 SSD Controller 에게 사용하지 않는 [[Logical Block Addressing, LBA (Storage)|LBA]] 를 알려주는 기능이다.
- 이것은 Host 와 SSD 간의 인터페이스 차이에 의해 발생하는 문제점을 해결하기 위해 등장했다.
- Host 에서는 "Delete" 라는 것이 있지만 SSD 는 이러한 기능이 없다고 할 수 있다.
	- SSD 에서는 "Erase" 가 있지만 이것은 free block 을 생성하기 위한 것이다.
	- 즉, Host 에서 데이터를 지웠을때 해당 데이터를 "Erase" 하라고 SSD 에 전달하지는 않는다는 것이다.
- 그럼 Host 에서 데이터를 "Delete" 하면 이것은 어떻게 처리되는가:
	- 일단 Host 에서는 LBA 공간에서 해당 부분을 할당 해제할 것이다.
	- 이후 새로운 데이터가 생성되면 (데이터가 지워졌다는 것을 Host 는 알고 있기 때문에) 해당 데이터를 지워진 LBA 공간에 할당한다.
	- 이것은 SSD 의 관점에서 보자면 "Rewrite" 의 작업이고, 이를 수행하게 된다.
		- 기존의 데이터가 새로운 데이터로 변경된 것이기 때문
- 이것은 그럼 어떤 문제를 초래할까.
	- SSD 관점에서는 해당 데이터가 지워졌다는 사실 (invalid 하다는 것) 을 "Rewrite" 시에 인지하게 된다.
		- Invalid 함을 일찍 알았으면 [[Garbage Collection, GC (Storage)#Background GC (BGC), Idle Collection, Idle-time Garbage Collection (ITGC)|BGC]] 를 수행해서 free block 을 미리 확보해 놓을 수 있었을 텐데, 이것을 너무 늦게 알았기 때문에 write 요청이 들어왔을 떄 free page 가 부족한 상황이라면 그때서야 GC 를 수행하게 되고, 이는 성능 저하를 유발한다.
		- 또한 그 전까지는 valid 하다고 생각할 것이므로, BGC 에 해당 page 들을 이리저리 옮기며 추가적인 [[Write Amplification, WA and Write Amplication Factor, WAF (Storage)|WA]] 를 유발하게 된다.
- 따라서 이 TRIM 기능을 이용하면 Host 가 알고 있던 지워진 데이터들 (더 이상 사용하지 않는 LBA 공간들) 을 SSD 에 전달하게 되고, 그럼 SSD 는 해당 LBA 공간에 할당되어 있던 PBA 들을 더욱 일찍 invalid 처리할 수 있게 된다.