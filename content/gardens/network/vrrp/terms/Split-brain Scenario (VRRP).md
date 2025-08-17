---
tags:
  - network
  - 스토리
date: 2023-02-02
aliases:
  - Split-brain Scenario
---
> [!info]- 참고한 것들
> - [Understanding and Avoiding Split Brain Scenarios](https://us.sios.com/blogs/split-brain-scenarios/)

## Split-brain Scenario

- [[Virtual Router Redundancy Protocol (VRRP)|VRRP]] 와 같은 HA 구성에서, Active 와 Standby 간 통신이 원활하지 못해 Standby 가 Active 가 사라진 것으로 판단해 Active 가 되는 상황을 말한다.
	- 즉, Active 가 여럿이 되는 셈.

## 실습해보기

### Normal (No split-brained)

1. Active 노드 - VIP 가 올라와 있음

![[Pasted image 20240602203255.png]]

2. Standby 노드 - VIP 가 없음

![[Pasted image 20240602203315.png]]

3. Active, standby 모두 `60001/tcp` 를 열고 대기

![[Pasted image 20240602203331.png]]

4. Client 에서 접근하면 Active 쪽에 연결됨

![[Pasted image 20240602203346.png]]

### Abnormal (Split-brained)

1. Split-brain scenario 를 만들기 위해 방화벽을 킨다 (Active-standby 간의 통신 막기)

![[Pasted image 20240602203407.png]]

2. 그럼 Active 와 Standby 모두 스스로를 Active 라 생각해 VIP 가 생성된다.

![[Pasted image 20240602203456.png]]

![[Pasted image 20240602203503.png]]

3. `60001/tcp` 를 열고 대기

![[Pasted image 20240602203517.png]]

4. 반복적으로 ARP 캐시를 지우고 TCP 커넥션을 맺어보자.

```bash
while true; do
sudo arp -d $VIRTUAL_IP # Clear ARP cache
ncat -z $VIRTUAL_IP 60001 # Use -z option to connect only (not sending data)
done
```

5. 결과: 둘 다 연결된다.

![[Pasted image 20240602203558.png]]

### Why?

- Split-brain scenario 에서는 Active 와 Standby 모두 스스로를 Active 라 생각하기 때문에 VIP 를 생성하고, ARP 에 응답한다.
- 따라서 ARP 를 Active, Standby 모두 랜덤하게 응답하고
- 결과적으로 Active 와 Standby 모두에게 TCP 가 연결된다.

