---
tags:
  - NVMe
  - nvme-csd
  - Storage
date: 2024-08-02
---
> [!info]- 참고한 것들
> - [NVMe 발표자료](https://nvmexpress.org/wp-content/uploads/FMS-2023-Computational-Storage-Subsystem-Local-Memory.pdf)

## 연산 가능한 저장장치

- 말 그대로 SSD 와 같은 저장장치에 연산 기능을 제한적으로 넣은 것이다.
- 하지만 device 의 computing power 는 host 의 그것보다 당연히 안좋을 것이다. 그럼에도 불구하고 이런 짓을 한 것은 (그냥 심심해서 이렇게 했을리는 없고) 이것이 뭔가 더 좋으니까 이렇게 했을 것이야:
	- Device IO 가 overhead 가 큰 것은 누구나 알 것이다.
	- 근데 만약 데이터를 가져와서 별 짓 안하고 다시 저장한다면, 이 왕복 IO 의 overhead 가 computing 보다 더 커지는 배보다 배꼽이 더 커지는 상황이 된다.
	- 따라서 이런 단순한 작업은, host 에서 하지 말고 (즉, 데이터를 가져오는 *data-to-code* 가 아닌), device 에서 하면 (즉, 코드를 보내는 *code-to-data*) 더 좋을 것 같다는 아이디어이다.

> [!tip] 참고) 관련된 비슷한 여러 용어들
> - *Near-Data Processing* (*NDP*)
> - *In-Storage Processing* (*ISP*)
> - *Smart-SSD*

