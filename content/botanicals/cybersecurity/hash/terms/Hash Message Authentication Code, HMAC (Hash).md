---
tags:
  - 용어집
  - Security
date: 2024-05-27
---
> [!info]- 참고한 것들
> - [[7. PKC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## MAC, HMAC

- *MAC* (*Message Authentication Code*) 는 어떤 메세지가 변경 (위조) 되었는지 확인하는 코드이다.
- 이 중 Hash 를 사용하는 방법을 *HMAC* (*Hash Message Authentication Code*) 인 것.

## 원리

- 송신자 Alice 는 msg 앞에 공유된 시크릿 (*Shared secret*, *Prepend*) 하나를 붙인다
- 그리고 그 msg 에 hash 를 한 후, msg 와 붙인 후 Bob 에게 보낸다

```
TRANSMIT_MSG
= MSG + DIGEST
= MSG + HASH(SHARED_SECRET + MSG)
```

- Bob 은 이것을 받아들고 msg 앞에 공유 시크릿을 붙인 뒤에 hash 를 하여 전송된 digest 과 비교하여 msg 가 변경되었는지 감지한다.

```
COMP(DIGEST, HASH(SHARED_SECRET + MSG))
```

- 근데 이 방법은 문제가 있다:
    - Alice 는 아무것도 보내지 않았는데, Bob 은 이 메세지를 받았다고 주작치는 것이 가능하다.
    - 반대로 Alice 가 보내놓고서 안보냈다고 주장할 수도 있다.
    - 즉, Non-repudiation 문제가 있는 것.
- 이는 [[Public Key Cryptography, PKC (PKC)|signature]] 을 이용하면 해결할 수 있다
    - 즉, Alice 가 개인키로 msg 를 서명하여 보낸다면, 이 개인키는 Alice 만 갖고 있기 때문에 Bob 은 공개키로 로 검증은 할 수 있지만, Bob 은 개인키를 모르기 때문에 거짓으로 이것을 만들어서 수신되었다고 주장할 수 없다.
    - 조금 더 구체적으로는 msg 를 hash 하여 서명하게 된다

```
Alice:
TRANSMIT_MSG = MSG + SIGN(PRIVKEY, HASH(MSG))
Bob:
VERIFY(PUBKEY, HASH(MSG), SIGN)
```