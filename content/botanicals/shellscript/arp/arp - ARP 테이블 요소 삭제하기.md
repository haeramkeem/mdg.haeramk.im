---
tags:
  - 쉘스크립트
---
## 개요

- 새로 ARP 를 보내 MAC 주소를 새로고침하는 등의 상황에서, [[13. Routing#ARP|ARP]] 캐시 테이블에 있는 데이터를 지우는 방법

## TL;DR

```bash
arp -d ${IP주소}
```