> [!info] 관련된 [공식 문서](https://kubernetes.io/docs/tasks/extend-kubernetes/configure-aggregation-layer/)


    Kube apiserver 가 제공하는 API 들에 추가적으로 더 많은 API 를 제공하기 위해 Extension API Server 를 구성할 수 있는데, 사용자가 이것과 통신할 때 직접 통신하는
	- Kube apiserver 를 Front Proxy 처럼 구성할 수 있다... 앞에 [선택적으로 붙이는 proxy](https://kubernetes.io/docs/tasks/extend-kubernetes/configure-aggregation-layer/) 가 사용할 