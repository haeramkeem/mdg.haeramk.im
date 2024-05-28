---
tags:
  - 용어집
  - Security
  - Hash
date: 2024-05-28
---
> [!info]- 참고한 것들
> - [[9. CT|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## Cryptographic Hash

- Cryptography 에서 hash 는 다음과 같은 성질을 만족함
	- Input length 에 관계없이 output length 는 정해져 있음 (일정)
	- Input 이 같으면 output 도 같음, input 이 다르면 output 도 다름
		- Bit 하나만 바뀌어도 결과는 완전히 바뀌어 버린다.
		- 이 성질을 이용하면 원본 데이터의 변경을 감지하기 용이하다.
	- *One-way function*: digest 를 가지고 원본을 찾을 수는 없다 (불가능하지는 않음; 확률적으로 희박함)
- Collision: 입력이 다른데 출력이 같은 경우
    - 입력값의 집합 에 비해 출력값의 집합이 더 작기 때문에 이러한 collision 이 당연히 가능하다.
    - 하지만 확률이 너무나 작아서 collision 이 발견되기 힘들다.
    - md5 나 sha1 같은 경우에는 collision 이 발견돼서 deprecated 되었고, 다른 sha256 같은 애들이 사용중이다.
    - 따라서 hash 함수는 collision 보호가 아주 중요하다고 하네.