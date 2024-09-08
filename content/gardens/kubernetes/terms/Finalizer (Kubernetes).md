---
tags:
  - kubernetes
  - terms
date: 2023-02-02
---
> [!info]- 참고한 것들
> [Finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/)
> [Using Finalizers to Control Deletion](https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/)

## Overview

- 얘는 약간 C++ 에서의 소멸자라고 생각할 수 있음
	- 뭐 또 비유를 해보자면 BeforeDeleteHook 정도로 생각할 수 있겠제
- 즉, 오브젝트가 삭제되기 전에 Finalizer 목록이 비어져 있어야 오브젝트가 삭제될 수 있댄다

## 오브젝트가 삭제되는 과정

- Finalizer 가 작동하는 과정을 알아보기 위해 오브젝트가 삭제되는 과정을 좀 알아보면
1. 오브젝트 삭제 요청이 들어옴
2. `metadata.deletionTimestamp` 항목에 현재의 시간을 추가함
3. `metadata.finalizers` 필드가 비워질때까지 (리스트 형태임) 오브젝트 삭제를 지연시킴
	1. 필드의 항목과 관련된 Controller 들에게 알림을 보내 finalize 과정을 수행하도록 하고
	2. finalize 가 종료된다면 해당 항목을 finalizer 필드에서 삭제한다
	3. 모든 항목이 제거될 때 까지 삭제를 지연시키게 되는 것
4. `202:ACCEPTED` 응답 코드를 보내며 삭제를 완료함

## 활용

- Finalizer 가 사용되는 가장 흔한 예시는 파드가 PV 랑 묶여있을 때이다
	- STS 같은 것을 정리하지 않고 PV 를 지우려고 하면 무한 대기가 걸리는 것을 볼 수 있는데
	- 이것이 Finalizer 때문이다
	- 파드가 PV 를 사용한다면 PV 에 자동으로 `kubernetes.io/pv-protection` 이라는 Finalizer 가 걸려서 연관된 파드가 제거되기 전까지 PV 가 지워지지 않는다
- 네임스페이스를 지우는 상황에서도 비슷한 일이 일어날 수 있다
- CRD 에 대한 operator 가 없어진 경우 CRD 가 Finalize 로 들어가 있는 리소스는 CRD 가 제거될 수 없기 때문에 무한히 대기하는 상황이 일어날 수 있다