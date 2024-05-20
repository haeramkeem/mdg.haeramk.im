---
tags:
  - PKIX
---
> [!info] 참고 문서 - [RFC5280](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.9)

## Basic Constraints

- 간단하다.
- 이 인증서가 (1) [[Certificate Authority, CA (PKIX)|CA]] 인지, (2) 만일 CA 라면, 자식 Intermediate certificate 를 몇개나 만들 수 있는지 명시하는 부분이다.
	- (1) 항목은 `cA` 필드를 이용해 명시하고,
	- (2) 항목은 `pathLenConstraint` 필드를 이용해 명시한다.
- [RFC5280](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.9) 에는 이 항목을 다음과 같은 구조체로 정의한다:

```
BasicConstraints ::= SEQUENCE {
	cA                      BOOLEAN DEFAULT FALSE,
	pathLenConstraint       INTEGER (0..MAX) OPTIONAL
}
```

## 항목들

### `cA`

- 별로 어려울 건 없다; 이 인증서가 CA 인지를 나타내는 boolean 값이다.
	- `cA:TRUE` 라면, 이 인증서는 CA 인증서로 사용할 수 있는거고
	- `cA:FALSE` 라면 그 반대겠지
- 만일 이 값이 설정돼있지 않거나 `cA:FALSE` 라면, [[x509v3 Key Usage and Extended Key Usage extension explained - Key Usage 와 Extended Key Usage 란?#Certificate Signing (`keyCertSign`)|keyCertSign]] 또한 설정되면 안되고, 공개키가 인증서 서명을 검증하는데 사용되어서도 안된다고 한다.

### `pathLenConstraint`

- 이건 이 인증서가 생성할 수 있는 자식 CA (Intermediate certificate) 가 몇개인지를 제한하는 값이다.
	- *제한* 의 말뜻처럼, 이 값을 명시하지 않으면 무한대의 자식 CA 를 생성할 수 있다
- 다만, 여기에는 인증서 체인의 마지막 non-CA 인증서 (End-entity certificate) 은 포함되지 않는다.
	- 즉, `pathLenConstraint` 값이 `0` 이라면, 이 인증서를 이용해 자식 인증서를 생성할 때 CA 는 생성하지 못하지만 CA 가 아닌 인증서는 생성할 수 있다는 소리이다.
	- 주의할 점은 (비록 흔하진 않지만) 마지막 인증서가 CA 일 경우에는 포함이 된다는 것이다.
- 이 값이 효력이 있기 위해서는 [[x509v3 Basic Constraints extension explained - Basic Constraints 란?#`cA`|cA]] 가 `TRUE` 여야 하고 [[x509v3 Key Usage and Extended Key Usage extension explained - Key Usage 와 Extended Key Usage 란?#Certificate Signing (`keyCertSign`)|keyCertSign]] 또한 설정되어 있어야 한다.