---
tags:
  - 용어집
  - Storage
---
## 이게 뭐고

![[Pasted image 20240320125416.png]]

- [[Shingled Magnetic Recording HDD, SMR HDD (Storage)|SMR HDD]] 와 대조적으로, write 에 필요한 공간을 기준으로 track 너비를 산정하는 방법이다.
	- SMR HDD 와 대조되는 개념이기에 해당 문서를 같이 참조하면 이해하기 쉬울듯.
- Read 에 필요한 공간은 write 에 필요한 공간보다 너비가 작기 때문에, write 너비로 track 너비를 정하면 데이터를 부분적으로 수정하는 것에 (in-place update) 아무 문제가 없다는 장점이 있다.
	- 즉, 데이터 수정이 빠르다는 장점이 있는 것.
- 하지만 그만큼 track 의 너비가 넓어져 데이터를 저장할 공간은 부족해 진다.
	- 다시말해, 디스크의 용량이 작다는 단점이 있다.