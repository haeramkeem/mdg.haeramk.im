---
tags:
  - kubernetes
  - kube-install
  - kubernetes-dashboard
date: 2024-08-30
---
> [!tip] 선택의 이유
> - 물론 Prometheus 같은거 쓰면 더 좋다는거 안다.
> - 근데
>	- Node 의 사양이 그리 좋지 않다.
>	- 그리고 여기에 너무 많은 시간투자를 하기 싫다.
> - 따라서 그냥 무난무난 둥글둥글한 [kubernetes-dashboard](https://github.com/kubernetes/dashboard) 를 사용하기로.

## 설치

- NS 생성 (선택)

```bash
kubectl create ns system-monitoring
```

- Helm values

```yaml title="dashboard.yaml"
app:
  ingress:
    enabled: true
    hosts:
      - {{ Dashboard 엔드포인트 }}
    ingressClassName: nginx
    useDefaultIngressClass: true
    path: /
    tls:
      enabled: false

metrics-server:
  enabled: true
```

- 여기서 주목할 점은
	- `app.ingress.useDefaultAnnotations: true` 로 주면 `ingressClassName: nginx` 는 의미가 없어진다. 근데 그냥 더블체크로다가 설정함 ([참고](https://github.com/kubernetes/dashboard/blob/master/charts/kubernetes-dashboard/templates/networking/ingress.yaml#L46))
	- Metrics server 는 별도로 설치하지 않고 subchart 로 제공해주는거 사용함
- Helm repo add

```bash
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
helm repo update
```

- Helm install

```bash
helm -n system-monitoring upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard -f dashboard.yaml
```

## Token 생성

- Kube-dashboard 는 그냥은 못쓰고 SA 를 생성해 token 을 받아야 한다.
- Admin 권한으로 만들어 보자. 일단 다음 명령어로 SA 를 만든다.

```bash
kubectl -n kube-system create sa {{ SA 이름 }}
```

- 그리고 이놈에게 admin ClusterRole 을 묶어준다.

```bash
kubectl create clusterrolebinding {{ CRB 이름 }} --clusterrole=admin --user=system:serviceaccount:kube-system:{{ SA 이름 }}
```

- 마지막으로 다음 명령어로 token 을 생성해준다.

```bash
kubectl -n kube-system create token {{ SA 이름 }}
```