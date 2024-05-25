---
tags:
  - 용어집
  - Network
  - BGP
date: 2024-05-24
---
> [!info]- 참고한 것들
> - [[5. BGPSEC, RPKI#2. RPKI (Resource Public Key Infrastructure)|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 개요

- 기존에 PKI (TLS 에서 사용되는) 이 성공적으로 운영이 되고 있고,
- ASN 이나 IP prefix 와 같은 internet resource 들이 계층적으로 관리된다는 것이 기존의 PKI 와 유사하기 때문에 이 resource 들도 PKI 를 이용해 관리해보자는 아이디어이다.
- 즉, RIR 이 PKI 에서 Root CA 가 되고, 중간에 NIR, LIR, ISP 가 Intermediate CA 가 되며 마지막 End user 가 End-entity CA 가 되는 셈.
	- 따라서 ASN 과 IP addr block 을 할당받는 모든 AS 들은 계층에 따라 인증서를 발급받게 된다.
- 정리하자면 어떤 ASN 이 어떤 IP addr block 을 소유하고 있다는 것을 PKI 로 보증하자라는 아이디어이다.

## Issuing Resource Certificate (RC)

![[Pasted image 20240525153309.png]]

- 위에서 말한 것처럼 root CA 는 RIR 이 된다.
	- 기존의 PKI 에서처럼 이놈들은 그냥 묻지도 따지지도 않고 신뢰하게 되며
	- 따라서 스스로 서명한 인증서 (Self-signed certificate) 를 갖고 있다.
- 그리고 intermediate CA 는 NIR (혹은 LIR), ISP 들이 된다.
	- RIR 이 NIR (혹은 LIR) 에 인증서를 생성해 주는 것으로 시작해
	- NIR 이 LIR 에게, 혹은 LIR 이 ISP 에게 인증서를 생성해주게 된다.
- 마지막으로 ISP (혹은 경우에 따라서 End-user) 에서는 상위계층으로부터 받은 인증서를 이용해 End-entity (EE) 인증서를 생성하게 된다.
	- 따라서 얘네들은 인증서를 두개 (받은것, 받은것으로 만든것) 갖고 있게 된다.

### Resource Certificate Structure

![[Pasted image 20240525162456.png]]

- 뭐 많기는 한데 전부 PKI 관련 필드이고 resource cert 에서 중요한 것은 저 `Extension` 필드에 들어가는 값들이다.
	1. List of Resources: 인증서 주인이 가지고 있는 ASN 들과 IP addr block 들의 리스트
	2. AIA: CA cert (아마 바로 상위 계층?) 의 URI
	3. SIA: 연관된 많은 object 들 (예를 들면 바로 다음에 나올 [[#Route Origin Authorization (ROA)|ROA]]) 에 접근할 수 있는 URI

## Route Origin Authorization (ROA)

- 여기까지 오면 NIR, LIR, ISP 같은 기관들은 상위 기관으로부터 사용할 수 있는 ASN 들과 IP addr block 들, 그리고 이것들을 받았다는 인증서 (즉, resource certificate) 총 세개를 받게 될 것이다.
- AS 는 이제 AS 로 기능하기 위해 NIR/LIR/ISP 들로부터 ASN 하나와 IP prefix 들을 할당받을 것이다.
	- 여기서 주의할 점은 AS 와 NIR/LIR/ISP 를 좀 구분지어서 생각해야 된다는 것이다.
	- NIR/LIR/ISP 는 리소스를 주는놈, AS 는 그 리소스를 받아서 사용하는 놈이다.
	- 물론 LIR 과 ISP 이 AS 로 기능할 때도 있지만, 이것은 스스로에게 리소스를 주는 경우라고 이해하면 된다.
- 그럼 NIR/LIR/ISP 는 AS 에게 요청받은 것 (ASN 하나, IP prefix 하나이상) 을 주며 이 할당 정보를 서명한다.
- 이때 이 "정보 + 서명" 을 ROA (Route Origin Authorization) 이라고 한다.
	- 즉, ROA 는 ==해당 AS 가 이 IP prefix 들에 포함되는 IP 들을 운영하고 있고, 이때의 ASN 과 IP prefix 들은 NIR/LIR/ISP 로부터 적법하게 할당받았다는 것에 대한 증명==인 셈

![[Pasted image 20240525165025.png]]

- 위 그림이 ROA 의 구조이다.
	- 뭐 특별할 것은 없죠?
## Repository

- 이때 NIR/LIR/ISP 와 같은 기관들이 인증서와 ROA 등의 signed object 들을 누구나 볼 수 있게 공개하는 저장소를 *Repository* 라고 한다.
- 또한 이 signed object 들의 리스트는 *Manifest* 라고 한다.
	- 이 manifest 또한 서명된다.

## Validator, Validated ROA Payload (VRP)

![[Pasted image 20240525171029.png]]

- Repository 에 있는 ROA 를 가져와서 인증서 확인하고 하는 작업은 router 에게 부담을 주지 않기 위해 router 가 직접 하지는 않는다.
- 대신, 이 작업을 수행하는 놈을 *RPKI Validator* (혹은 *Cache*) 라고 한다.
- Validator 는 repository 에서 ROA 를 가져와가 인증서랑 비교하면서 이 ROA 가 적법한지 확인한다.
	1. ROA 에 적힌 리소스 (ASN, IP prefix) 를 할당한 기관의 resource certificate privkey 로 ROA 가 서명되었나?
	2. 그 resource certificate 은 유효한가?
	3. 그 resource certificate 의 cert chain 은 유효한가?
	4. 그 resource certificate 안에 적힌 리소스가 ROA 리소스의 superset 인가?
		- 해당 기관이 갖고 있는 리소스 중 일부를 AS 에 할당할 것이기 때문에 superset 의 관계가 된다.
		- 즉, 해당 기관이 리소스를 갖고 있냐는 cert chain 으로 검증하고 그 리소스 중 일부를 AS 에 할당한 것이 맞냐를 검증하는 것.

![[Pasted image 20240525172546.png]]

- 그리고 이 검증작업이 끝나면 서명을 빼고 (ASN 하나, Prefix 하나) 로 reformat 해서 router 에게 전달해 준다.
	- 이렇게 reformat 된 문서를 *Validated ROA Payload (VRP)* 라고 한다.

## Route Origin Validation (ROV)

- 왜 이 검증 과정을 *Route Origin Validation (ROV)* 이라는 거창한 이름으로 부르는지는 모르겠는데
- Router 는 이 VRP 를 받아 BGP announcement 를 검증하는데 사용한다.
	- *Valid*: BGP announcement 가 하나 이상의 VRP 에 의해 *Cover* 된다
		- 여기서 Cover 라는 것은 해당 ASN 에 대한 BGP announcement 메세지의 IP prefix 가 VRP 의 IP prefix 와 일치하거나 혹은 포함된다는 것을 의미한다.
	- *Invalid*: 다음과 같은 경우의 수가 있다고 한다.
		- Unauthorized AS: 신뢰할 수 없는 AS... 인데 router 는 VRP 밖에 못보니까 아마 [[#Validator, Validated ROA Payload (VRP)|Validation]] 과정에서 validate 실패한 AS 는 뭐 추가적으로 router 에게 알려주거나 하겠제
		- MaxLength violation: BGP announcement 에 명시된 IP prefix maxlength 가 VRP 의 maxlength 보다 더 큰 경우 (더 좁은 범위의 IP)
	- *NotFound*: BGP announcement 가 하나 이상의 VRP 에 의해 Cover 되지 않는 경우

## RPKI Limitations

- 아직 deployment 비율이 너무 낮다,,
- 작성시점 (2024-05-25) 기준, 50% 정도 된다 ([여기](https://rpki-monitor.antd.nist.gov/) 에서 확인할 수 있다).

![[Pasted image 20240525173726.png]]