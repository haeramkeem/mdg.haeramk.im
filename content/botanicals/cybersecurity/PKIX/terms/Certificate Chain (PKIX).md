---
tags:
  - 용어집
  - Security
  - PKIX
date: 2024-05-27
---
> [!info]- 참고한 것
> - [[7. PKC|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## CA Hierarchy, Certificate Chain

![[Pasted image 20240527201918.png]]

- 한 인증서는 issuer 에 의해 보증되는데, 이 issuer 는 또 다른 issuer 에 의해 보증되는 일련의 *Hierarchical* 형태를 띄게 된다.
- 이때, 계층 맨 위의 issuer 를 *Root CA* 라고 하고, 이놈의 인증서는 다른 issuer 없이 스스로 서명 (*Self-signed*) 되어 있다.
	- 이 
- 그리고 중간에 껴있는 issuer 들을 *Intermediate CA* (*Subordinate CA*) 라고 하고, 이놈의 인증서는 *Intermediate Certificate* 라고 한다.
	- 이 intermediate certificate 들은 당연히 상위 issuer (다른 Intermediate CA 혹은 Root CA) 에 의해 서명된다.
	- Intermediate CA 중에서 제일 아래, user 에게 인증서를 서명해 발급해 주는 CA 를 *Issuing CA* 라고 부르기도 한다.
- 마지막으로 실질적으로 이 인증서를 사용하는 user (server) 들을 *End-entity* 라고 한다.
- 이렇듯 Root -> Intermediate -> End-entity 로 내려가며 인증서가 발급되고, 인증서를 검증할 때에는 반대로 End-entity -> Intermediate -> Root 순서로 거슬러 올라가며 진행된다.
	- 이러한 것을 *Certificate Chain* 이라고도 한다.
- 이렇게 계층적으로 구성하는 데에는 이유가 있다.
	- 일단 이렇게 함으로써 Root CA 혹은 일부 Intermediate CA 를 offline 으로 유지해 외부에서 접근할 수 없게 할 수 있다.
		- 실질적으로 user 에게 인증서를 발급해 주는 Issuing CA 만 online 으로 운영함으로써, 다른 CA 들이 compromise 될 가능성을 더욱 낮출 수 있다.
	- 또 다른 이유로는 chain 이 길어질 수록 보증해 주는 CA 가 많아지는 것이기에 더욱 보안성이 높아진다고도 할 수 있고
	- 마지막으로는 확장성을 들 수 있다: 인증서 발급에 새로운 정책을 강제하고자 할 때, Root CA 의 인증서를 변경하는 것은 많은 공수가 들지만 intermediate CA 를 추가하거나 변경하는 것은 상대적으로 쉽기 때문.