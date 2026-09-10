---
tags:
  - mdg
  - database
  - index
  - hash
aliases:
  - Extendible Hash
date: 2026-09-09
---
> [!info]- 참고한 것들
> - [[08. Hash Tables Part 2 - Dynamic Hash|서울대 정형수 교수님 데이터사이언스 응용을 위한 빅데이터 및 지식 관리 시스템 강의 (Fall 2024)]]

## Extendible hash

- 이놈이 사실상 dynamic hash 에서는 SOTA 나 다름없는데
- 이름이 시사하는 것 처럼 이것은 적절한 시점마다 hash table 을 두 배씩 확장 (Extend) 하는 방법을 사용한다.
- 작동 원리는
	- 일단, 가장 먼저의 entry point hash table 인 global table 이 있고, 이곳의 entry 는 bucket 을 가리키고 있는 구조이다.
	- 이때 global bitwidth 이 $n$ 이라면, global table size 는 $2^{n}$ 가 된다.
	- 그리고 key 를 hash 한 digest 에서 상위 global bitwidth ($n$) 개의 bit 를 보고 global table entry 로 들어가 연결된 bucket 으로 가게 되는 흐름이다.
	- 이 bucket 에도 local bitwidth ($l$) 가 있는데, 이 값은 해당 bucket 내에 있는 애들이 공통된 $l$ 개의 상위 digest bit 을 가진다는 것을 뜻한다.
		- 그리고 만약에 $n > l$ 이라면, local 에서는 상위 bit 를 적게 본다는 의미이기 때문에 여러개의 global table entry 가 이 bucket 을 가리키게 되고
		- 만약 $n = l$ 이라면, global bucket entry 하나만이 bucket 을 가리키고 있고, 이는 이놈이 바로 이전에 쪼개어졌다는 의미이다.
	- 만약 쪼개어진다면, 해당 bucket 이 두개가 되고 global table 의 크기도 두배가 되며 쪼개진 애를 가리키는 pointer 가 entry 에 각각 들어가게 된다.
- 감이 잘 안오면 다음의 예시로 보자.

![[Pasted image 20241022005427.png]]

- 일단 이게 resize 전의 모습이다.
- 보면 global table 의 bitwidth 가 2이기 때문에, 이놈은 4개의 entry 를 갖고 있고, global table 의 entry 로 접근하는 것은 digest 의 상위 2개의 bit 로 수행한다.
	- `0` 으로 시작하는 애들이 모여있는 것이 첫번째 local bucket 이다.
		- 따라서 global table 에서도 0으로 시작하는 (0, 1) entry 들은 이 bucket 으로 연결되어 있고
		- 이 local bucket 에 명시된 bitwidth 도 1인 것을 볼 수 있다.
	- 그리고 `10`, `11` 으로 시작하는 애들은 각각의 bucket 에 연결되어 있다.
		- 따라서 이 bucket 들의 경우에는 bitwidth 가 2로 적혀 있는 것을 볼 수 있다.
- 근데 C 가 INSERT 되면 두번째 bucket 에 대해 자리가 없기 떄문에 이놈을 reshuffling 해야 한다.
- 이때, resize 가 일어난다.

![[Pasted image 20241022010028.png]]

- 보면 이제는 global table 의 bitwidth 가 3이 되었고, digest 의 상위 3개의 bit 로 이 global table 의 entry 에 접근하게끔 바뀐 것을 볼 수 있다.
- 우선 안쪼개진 애들부터 보면
	- `0` 으로 시작하는애들은 여전히 안쪼개어지고 남아 있다.
		- 따라서 global table 에서도 제일 위 bucket 을 가리키는 entry 가 2개에서 4개로 바뀐다.
	- 그리고 `11` 로 시작하는 애들도 안쪼개진다.
		- 그래서 이놈에 대한 bucket 을 가리키는 global table entry 가 1개에서 2개가 된다.
- 여기서 쪼개진 놈은 저 `10` 으로 시작하는 애들이다.
	- 이때는 상위 3bit 를 보게 되고, 따라서 `100` 에 대한 entry 와 `101` 에 대한 entry 가 별도의 bucket 에 연결되어 있는 것을 볼 수 있다.
	- 그리고 원래 `10` 에 있던 애들은 이 두개의 bucket 으로 나눠 들어간다.
	- C 도 `101` entry 의 bucket 에 얌전히 들어가게 된 것을 볼 수 있다.