---
tags:
  - 용어집
  - Network
date: 2024-05-27
---
## 란?

- L4 프로토콜로, 다음과 같은 특징이 있다:
	- *Connection-oriented*: 누락되거나 순서가 뒤바뀌지 않는 데이터 전송을 보장
	- *Reliable*: Flow & Error control → 라우터 in-out queue 속도차이(Queue overflow congestion) 혹은 물리적인 Error 에 의한 데이터의 변형을 방지해줌
	- *Stream delivery service*: 상위계층에서 내려온 메세지를 버퍼에 모았다가 segment 단위로 송신

## Handshake

### Connection Establishment: 3-Way Handshake

1. *Client SYN*: Connection 요청
	- 통신을 위해 수신버퍼를 준비하라고 요청하는 것
    - `SYN(SEQ=n)`: Connection 요청을 의미하는 SYN 플래그와 SEQ번호로는 난수를 생성하여 보냄
2. *Server SYN*:  버퍼 준비 완료 응답
	- 통신을 위한 수신버퍼가 준비됐다고 응답하는 것
    - `SYN+ACK(SEQ=m;ACK=n+1)`: Connection 요청을 의미하는 SYN 플래그와 SEQ 로는 난수를 생성하여 보냄, 수신성공을 알리기 위해 ACK 플래그를 올리고 ACK 번호는 수신한 SEQ 번호 + 1 로 하여 송신
3. *Client ACK*: 통신 시작 응답
	- 송신버퍼와 넘버링 후 자기도 준비됐다고 응답하는 것
    - `ACK(SEQ=m;ACK=m+1)`: 데이터를 보내지 않았으므로 SEQ 는 유지, 수신 성공을 알리기 위해 ACK 플래그를 올리고 ACK 번호는 수신한 SEQ 번호 +1 로 하여 송신

### Disconnection Establishment (Half close): 4-Way Handshake

1. *Client FIN*: Disconnection 요청 단계
	- 이제 통신 그만하고 버퍼 반납하라고 요청하는 것
    - `FIN+ACK(SEQ=n;ACK=m+1)`: Disconnection 을 위한 FIN 플래그를 올려서 보냄
    - ACK 는 이전 에 SEQ=m 을 수신했다는 가정 하에 m+1 을 송신함
2. *Server ACK*: Half close 단계
	-  Disconnection 요청을 수신한 후 알겠다고 응답한 뒤 서버가 보낼 데이터가 남아있으면 마저 보내는 단계. Client 는 Server 가 보내는 데이터를 계속 수신하며 ACK 를 보낸다.
    - `ACK(SEQ=m;ACK=n+1)`: 알겠다는 의미로 ACK 플래그를 올리고 ACK 번호는 수신된 SEQ + 1 로 하여 송신. 이때 데이터는 보내지 않으므로 SEQ 는 여전히 m
3. *Server FIN*: Disconnection 단계
	- Server 가 자기도 이제 데이터를 다 보냈다고 Client 에게 알려주는 단계
    - `FIN+ACK(SEQ=i;ACK=n+1)`: Server 도 Disconnection 을 하기 위해 FIN 플래그를 올려서 송신
    - 이때, 나머지 데이터를 처리하는 과정을 앞서 진행했기 때문에 SEQ 는 변경(i) 되어 있지만 Client 는 데이터를 더이상 보내지 않았기 때문에 ACK 는 그대로 n+1 이다
4. *Client ACK*: Close 단계
	- Client 가 알겠다고 한 뒤 Server 는 바로 버퍼를 반납하고 Client 는 일정시간 대기한 뒤 반납
    - `ACK(SEQ=n;ACK=i+1)`: 수신확인을 위해 ACK 플래그를 올리고 ACK 번호는 수신된 SEQ + 1 로 하여 응답
    - 또한 이때에도 데이터는 전송하지 않기 때문에 SEQ 는 여전히 n