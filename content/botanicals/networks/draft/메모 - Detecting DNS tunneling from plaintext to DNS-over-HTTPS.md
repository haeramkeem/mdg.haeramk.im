---
tags:
  - DNS
  - Network
  - SNU_CSE_MS_COMNET24S
  - 메모
---
> [!danger] #draft 의식의 흐름 기법에 따른 메모글 입니다.

## 개요

- DNS tunneling detection 에 대해 조사하며 훑어본 논문들 정리해놓기

## 요약 정리

## 논문들 (년도순)

- [Comparative analysis of DNS over HTTPS detectors (ComNet vol. 247, 2024)](https://www.sciencedirect.com/science/article/pii/S1389128624002846)
- [Summary of DNS Over HTTPS Abuse (IEEE Access vol.10, 2022)](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=9775718)
- [Tunneling through DNS over TLS providers (CNSM’22)](https://ieeexplore.ieee.org/abstract/document/9964617)
	- 논문 소개
	    - 이 논문은 tunneling detection 이 아니라 major DNS resolver 들에 대한 DoT tunneling 대응 정도를 실험한 것이다
	    - 여기에 따르면, tunneling 을 위해서는 resolver 의 경우 Google DNS 가 제일 좋았고 (즉, 제일 대비가 안되어 있었고) tool 의 경우에는 iodine 이 제일 좋았다고 한다.
	- Demo 파트에 활용해볼 만한 논문; 실험 환경 설정이나 DoT, DoH proxy 등을 참고할 만 하다
		- DoHBrw 데이터셋
		- [OpenWrt 라우터 운영체제](https://github.com/openwrt)
		- [Stubby DoT proxy](https://dnsprivacy.org/dns_privacy_daemon_-_stubby/)
- [Detecting DNS over HTTPS based data exfiltration (ComNet vol. 209, 2022)](https://www.sciencedirect.com/science/article/pii/S1389128622001104)
- [A comprehensive survey on DNS tunnel detection (ComNet vol. 197, 2021)](https://www.sciencedirect.com/science/article/pii/S1389128621003248)
	- ...은 [[논문 - A comprehensive survey on DNS tunnel detection|여기]] 에 별도로 정리되어 있다.
- [Exploring Simple Detection Techniques for DNS-over-HTTPS Tunnels (FOCI’21)](https://dl.acm.org/doi/10.1145/3473604.3474563)
	- 몇가지 정보들
		- [이 연구](https://dl.acm.org/doi/10.1145/3355369.3355575) 에 따르면, DoH 가 DoT 보다 느릴 것 같지만, 실제로는 거의 비슷한 성능을 낸다고 한다.
		- DoT 는 853 port 를 사용하지만, DoH 는 HTTPS 와 동일한 443 을 사용한다 - 따라서 DoH tunneling detection 의 경우에는 일반 HTTPS 인지 DoH 인지 부터 판별하는 로직이 포함되어야 한다.
- [Towards Comprehensive Detection of DNS Tunnels (ISCC’20)](https://ieeexplore.ieee.org/abstract/document/9219547)
- [DoH Insight: detecting DNS over HTTPS by machine learning (ARES'20)](https://dl.acm.org/doi/abs/10.1145/3407023.3409192)
- [Detection of DoH Tunnels using Time-series Classification of Encrypted Traffic (DASC/PiCom/CBDCom/CyberSciTech'20)](https://ieeexplore.ieee.org/document/9251211)
- [An Investigation on Information Leakage of DNS over TLS (CoNEXT’19)](https://dl.acm.org/doi/10.1145/3359989.3365429)
- [SoK: Towards Grounding Censorship Circumvention in Empiricism (SP'16)](https://ieeexplore.ieee.org/document/7546542)
- [Seeing through Network-Protocol Obfuscation (CCS'15)](https://dl.acm.org/doi/10.1145/2810103.2813715)
- [Practical Comprehensive Bounds on Surreptitious Communication over DNS (Security’13)](https://www.usenix.org/conference/usenixsecurity13/technical-sessions/presentation/paxson)
	- 논문 소개
	    - Encoding 뿐 아니라 codebook, time interval 을 이용한 정보 전송까지 detection 하기 위한 방법
	    - 1일 간의 DNS query 에서 substring 과 time interval 등을 추려 압축 (e.g. gzip) 한 사이즈를 이용해 filtering 하는 것이 핵심 아이디어
	        - “압축” 이기에 기본적으로 원본 데이터가 손실되지 않아 (압축파일로 부터 원본 데이터를 다시 뽑아낼 수 있기에) false negative 가 없다고 주장
	    - 데이터셋을 위의 압축사이즈를 포함한 5개의 필터로 여과한 결과 dns tunneling 을 detection 할 수 있었음
	    - 4KB/day 를 넘기면 dns tunnel 로 의심할 수 있다는 결론을 내렸음
	    - 특정 기간의 packet 들을 종합해야 하기에 zk 를 사용하기에 무리가 있지 않나
	- 몇가지 정보들..
	    - 제시된 데이터셋을 분석한 결과 domain name 의 길이나 traffic volume 으로는 tunneling 과 benign 간의 차이가 크지 않았다고 함
	        - tunneling 이 아닌 정상 패킷의 경우에도 인코딩된 것과 유사한 형태의 subdomain 을 사용
	        - 가령 CDN 의 경우 uuid 가 subdomain 으로 붙을 때도 있다
	    - 또한 tunneling 의 경우 caching 을 방지하기 위해 TTL 을 낮게 설정하기도 하는데, 이것은 benign 에서도 이러한 패킷이 많아 TTL 을 이용해 detection 하는 것도 힘들다고 함
	    - Threshold 를 정하는 과정에서 [[논문 - Increased DNS forgery resistance through 0x20-bit encoding - security via leet queries|0x20 인코딩]] 된 데이터셋은 전부 제외했다고 한다.
		    - 당연히 0x20 인코딩을 적용하게 되면 DNS tunneling 의 데이터가 전부 망가지기 때문에 data leakage 를 걱정할 일이 없기 때문.
		    - 다만 이들을 제외하는 것이 본 논문에서는 나름의 challenge 였다고 한다. 하지만 어떻게 했는지는 별로 안중요했는지 논문에서는 서술하지 않았다.
- [Detecting DNS Tunneling (SANS, 2013)](https://www.sans.org/white-papers/34152/)
- [Flow-Based Detection of DNS Tunnels (AIMS'13)](https://link.springer.com/chapter/10.1007/978-3-642-38998-6_16)
- [NgViz: detecting DNS tunnels through n-gram visualization and quantitative analysis (CSIIRW'10)](https://dl.acm.org/doi/10.1145/1852666.1852718)