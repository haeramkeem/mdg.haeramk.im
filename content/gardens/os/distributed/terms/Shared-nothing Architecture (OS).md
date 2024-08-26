---
tags:
  - os
date: 2024-07-18
---
> [!info]- 참고한 것들
> - [스킬라 DB](https://www.scylladb.com/glossary/shared-nothing-architecture/)
> - [를 제시한 논문](https://dsf.berkeley.edu/papers/hpts85-nothing.pdf)

## 공유하지 않기

- 이름 그대로 아무것도 공유하지 않는다는 것이다.
- 여기서 "공유" 는 processor 의 입장에서 어떤 것을 공유할 것이냐에 대한 것이고, 논문에서는 다음과 같이 세 부류로 나누었다.

| TERM                    | DESC                                            |
| ----------------------- | ----------------------------------------------- |
| *Shared-memory* (*SM*)  | Processor 들 간에 memory 를 공유하는 것.                 |
| *Shared-disk* (*SD*)    | Processor 들 간에 memory 는 공유하지 않고, disk 는 공유하는 것. |
| *Shared-nothing* (*SN*) | Processor 들 간에 memory, disk 모두 공유하지 않는 것.       |

- 즉, Shared-nothing 은 ==분산 시스템에서 각 node 의 memory 와 disk 를 독립적으로 활용해서 전체 시스템을 운용하는 것을 의미==한다.

### 사례로 이해하기

- 떠오르는 대표적인 사례는 [[(Garden) Kubernetes|Kubernetes]] 의 etcd 이다.
	- 이놈은 여러 node 들이 뭐 NFS 로 mount 된 공유 디스크를 사용하는 것이 아니고, 각 node 의 local disk 를 이용해 하나의 DB 를 제공한다.
	- 즉, 이놈은 사용하는 disk 까지도 별도로 분리되어 있기 때문에 *shared-nothing* 이라고 할 수 있는 것.