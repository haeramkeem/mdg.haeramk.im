---
tags:
  - kubernetes
date: 2023-08-03
---
> [!info] 본 글은 Tigera 의 블로그에 올라온 것을 요약한 내용입니다.
> - [Tigera 블로그](https://www.tigera.io/blog/comparing-kube-proxy-modes-iptables-or-ipvs/)

## 요약

- 이론적으로는 iptables 는 체인룰을 따라가기에 $O(n)$ 의 시간복잡도를, ipvs 는 L4 로드밸런싱만을 위해 최적화 되었기에 $O(1)$ 시간복잡도를 가진다
	- 즉 이론적으로는, ipvs 모드가 더 빠르다.
- 1000 개 이상의 k8s svc 가 있는 환경에서 시험한 결과 TCP connection 이 여러 요청에서 재사용되는 (keepalive connection) 경우에는 iptables 와 ipvs 모드 간 성능 차이는 없었다.
- 다만 매 요청마다 TCP connection 을 맺는 경우에는 iptables 보다 ipvs 가 현저히 빨랐다.
- CPU 사용량도 k8s svc 가 5000 개가 넘을 정도가 되어야 유의미한 차이를 보였다 (ipvs 가 더 적은 CPU 를 사용).

## 결론

- keepalive TCP connection 을 주로 이용한다면, 기본 설정인 iptables 에서 ipvs 로 굳이 바꿀 필요는 없다.
- (비고) L4 통신 장애 건 해결을 위해 한 클러스터를 잠깐 ipvs 모드로 설정해 보았는데, 설정 변경시 (장애 해결에는 도움이 되지 않았지만) side effect 가 발생하지는 않았다.
	- 즉 나중에 전환의 필요성이 있을 시 전환해도 별 문제는 발생하지 않을 확률이 높다.