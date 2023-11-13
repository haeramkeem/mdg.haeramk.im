> [!info] 충남대학교 컴퓨터공학과 김상하 교수님의 "컴퓨터 네트워크" 강의를 필기한 내용입니다.

> [!warning] 다소 잘못된 내용과 구어적 표현 이 포함되어 있을 수 있습니다.

## Gratuitious ARP

- 이놈은 자신의 물리주소가 바뀌었을 때 그것을 다른 호스트에게 알리기 위한 용도이다
- 즉, 자신의 물리주소가 바뀌었으면 바뀐 물리주소를 ARP Request에 포함하여 전송함으로 다른 호스트가 이것을 받아들고 각자의 Cache table을 업데이트 하는 것이다

![%E1%84%89%E1%85%B5%E1%86%AF%E1%84%89%E1%85%B3%E1%86%B804%20-%20GARP%203992cfa98edd4d10809c4f9cc7f0bd2e/image1.png](originals/comnet.fall.2021.cse.cnu.ac.kr/images/prac03_3992cfa98edd4d10809c4f9cc7f0bd2e/image1.png)

- 그래서 전체적으로는 위와 같은 구조를 가진다
- 해당 그림은 이더넷 프레임의 구조 를 보여주는 그림으로 위의 세 칸은 이더넷 프레임의 헤더이고, 지금까지 너가 알던 대로 Broadcast, 자신의 물리주소, 프레임 타입 0806이 들어간 것 을 볼 수 있다
- 이제 그 아래가 네트워크 패킷인데
- 다른부분보다 맨 아래 네 칸을 잘 봐라
- 먼저 **Sender’s hardware address**에는 바뀐 자신의 주소가 들어간다
- 그리고 Sender’s protocol address는 당연히 자신의 네트워크 주소가 들어가고
- Traget’s hardware address도 당연히 Broadcast로 보내는 ARP Request이기 때문에 알 수 없으므로 ??로 되어있다
- 그리고 **Target’s protocol address**에도 Sender’s hardware address와 같은 자신의 네트워크 주소가 들어가게 된다
- 그 이유를 대충 짐작해보면
- ARP Request를 받은 수신지는 상대방의 Protocol address를 업데이트하고 Target’s protocol address가 자신의 주소면 ARP Reply를 보내게 되지만 만약 자신의 주소가 아니라면 상대방의 Protocol address만 업데이트 할 것이다
- 하지만 Target’s protocol address에 송신지의 주소를 적으면 어느 수신지의 protocol address와도 일치하지 않기 때문에 그 누구도 ARP Reply를 보내지 않게 되고 따라서 그냥 송신지의 물리주소를 통보하는 용도로 사용될 수 있는 것