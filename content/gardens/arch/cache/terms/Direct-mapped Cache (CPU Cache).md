---
tags:
  - arch
  - arch-cache
date: 2024-10-09
aliases:
  - Direct-mapped cache
---
> [!info]- 참고한 것들
> - [[10. Caches|서울대 이재진 교수님 확장형 고성능 컴퓨팅 강의 (Fall 2024)]]

## Direct-mapped Cache

![[Pasted image 20241203182925.png]]

- 간단하다: $L = 1$ 일때를 *Direct-mapped Cache* 라고 부른다.
- 접근하는 것은 아주 쉽다.
	- Set index 를 보고 해당 set 으로 간다.
	- Tag 를 보고 원하는 cacheline 인지 확인한다.
	- 만약에 맞다면, 그냥 사용하면 되고, 아니라면 이놈을 빼버리고 원하는 cacheline 을 가져오면 된다.
- 따라서 replacement 도 간단하다: 뭐 victim 선정 이런거 없이 tag 안맞으면 빼버리면 되니까.
- 이걸 회로로 나타내보면 이렇게 그릴 수 있다.

![[Pasted image 20241203190909.png]]

- 위에서 말한대로,
	- Set index 로 set 을 정하고
	- Tag 를 비교해서 hit 인지 아닌지 알려주고
	- Offset 으로 해당 offset 의 word 를 찾아서 그것도 알려준다.
		- 참고로 저기 등변사다리꼴은 Multiplexer (MUX) 로, index access 와 비슷하게 입력값 $N$ 으로 $N$ 번째 입력값을 뱉는 역할을 한다.

## Access Example

- Access 예시를 보자.

![[Pasted image 20241203191312.png]]

- 각 색깔은 word (4byte) 이고 이때 cacheline 은 word 두개 크기 (8byte) 이다.
	- 따라서 offset 은 cacheline 이 8byte 이기 때문에 3bit 이다.
- Set 이 4개이면 Set index 는 2bit 면 될 것이다.
- 그리고 Tag 는 1bit 를 사용해 총 6bit address space 라고 해보자.
- 이때 address 0 (주황색) 에 접근했을 때의 모습이 위 그림이다.
	- Set 0 의 validity 가 0이었기 때문에, cache miss 가 나고 해당 cacheline 이 올라오게 된 것.
	- 따라서 이때는 저 주황색이 cache miss 에 의해 올라온 것이고, 그 옆의 연두색은 cacheline 단위로 올라오느라 prefetch 된 것이다.

![[Pasted image 20241203191759.png]]

- 그래서 다음 address 4 (연두색) 에 접근하면 hit 가 나게 된다.

![[Pasted image 20241203192036.png]]

- 동일하게 address 20 에 접근하면 miss 가 나게 되고, set index 가 `10` 이기 때문에 set 2 에 올라온다.

![[Pasted image 20241203192145.png]]

- 이때 address 48 에 접근하게 되면 conflict 가 나게 된다.
	- 이놈도 동일하게 set index 가 `10` 이고 심지어 validity bit 도 켜져있는데 tag 가 다르기 때문 (address 20 은 `0`, 48 은 `1`).
- 따라서 아래처럼 address 48 의 cacheline 이 올라오게 된다.

![[Pasted image 20241203192428.png]]