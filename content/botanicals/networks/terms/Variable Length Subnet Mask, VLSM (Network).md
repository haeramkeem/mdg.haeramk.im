---
tags:
  - 용어집
  - Network
date: 2024-05-26
---
> [!info]- 참고한 것들
> - [Introduction of Variable Length Subnet Mask (VLSM) - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-variable-length-subnet-mask-vlsm/)
> - [Difference Between CIDR and VLSM (with Comparison Chart, Example and Merits) - Tech Differences](https://techdifferences.com/difference-between-cidr-and-vlsm.html)

## 란?

- IANA 가 특정 네트워크에 Network address 를 할당해준다고 했는데
- 네트워크에 속한 노드의 개수에 따라(네트워크의 크기에 따라) 특정 IP Class 의 Network address 를 할당해주는 방식으로 작동했었음
- 즉, 네트워크에 256개 이하의 노드가 존재한다면 그러한 네트워크(단체) 에게는 Class C 가 할당되는 셈임
- 근데 이거의 문제가 뭐냐면
- 네트워크에 노드가 30000개 있다면 당연히 Class B IP 가 할당되겠지
- 근데 Class B 는 65536 개의 IP 가 포함되므로 나머지 35536 개의 IP 는 사용되지 않고 낭비되더라 이거임
- 즉, 기존의 Classful 한 방식은 IP 의 낭비가 생기므로 이것을 막기 위해 VLSM 가 도입된 셈이다
- VLSM 은 어떻게 Classful 한 방식을 보완하냐면
- 기존의 Classful 한 방식은 서브넷 마스크가 고정길이인 셈이다
    - 즉, Class C 의 경우는 `255.255.255.0` 으로 마스크의 길이는 24 인셈
- 하지만 VLSM 는 이름답게 마스크의 길이가 고정되어있지 않고 가변길이를 사용한다.
    - 즉, 길이가 26인 `255.255.255.192` 도 서브넷 마스크로 사용할 수 있다
- 이것을 서브넷 안의 서브넷 (서브넷 안에 또 다른 서브넷이 존재) 이라고 생각할 수 있다.
    - 즉, 위에서 설명한 `255.255.255.192` 는 `255.255.255.0` 서브넷에서 한번 더 서브넷을 나눠 서브넷 마스크를 설정한 방식이라고 생각할 수 있다
- 뭐 좀 말장난같은 부분이 있지만 어쨌든 결론은
- 네트워크의 서브넷을 나눌 때 서브넷 마스크의 길이가 Class 에 따라서 결정되는 고정길이가 아니고 가변길이를 사용해서 불필요한 IP 의 낭비를 막는다는 개념이다