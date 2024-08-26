---
tags:
  - 용어집
  - storage
---
> [!info] 참고한 자료
> - [NVMe document](https://nvmexpress.org/resource/nvme-namespaces/)

## 이건 뭐지

- NVMe 스펙에 명시된 LBA 공간의 논리적인 하위 공간이다.
	- 즉, 전체 LBA 공간을 논리적으로 분리하여 사용할 수 있도록 한 것.
	- 뭐 "논리적 분리" 이기 때문에 물리적인 분리보다는 분리 정도가 약하긴 하다.
- 이렇게 분리하는 이유는 여러가지가 있을 수 있다:
	- 뭐 보안 측면 때문이라던지
	- 아니면 multi-tenancy 를 위해서라던지 등등
- 각 Namespace 는 ID 가 부여되며 (*NSID*) 이것은 Host 가 SSD Controller 를 거쳐 특정 NS 에 접근할 수 있도록 해준다.