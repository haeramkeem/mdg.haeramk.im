---
tags:
  - kubernetes
  - ingress-nginx
  - kube-setup
date: 2024-08-30
---
> [!info]- 참고한 것들
> - [Kubernetes 공식문서](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_tls/)
> - [ingress-nginx 공식문서](https://kubernetes.github.io/ingress-nginx/deploy/)

## TL;DR

- NS 생성 (선택)

```bash
kubectl create ns system-ingressctl
```

- TLS 인증서를 생성해주자. ([[openssl - 간단한 CA, CA-signed 인증서 만들기|TLS 인증서 생성 가이드]])
- 그리고 이놈을 클러스터에 등록해준다.

```bash
kubectl -n system-ingressctl create secret tls tls-ingress --cert=path/to/cert/file --key=path/to/key/file
```

- 이후 Helm 으로 설치하기:
- Helm values: ([Full values ref](https://github.com/kubernetes/ingress-nginx/blob/main/charts/ingress-nginx/values.yaml))

```yaml title="ingress.yaml"
controller:
  extraArgs:
    default-ssl-certificate: "system-ingressctl/tls-ingress"
  service:
    type: NodePort
    nodePorts:
      http: "30080"
      https: "30443"
  config:
    proxy-body-size: "0"
  ingressClassResource:
    default: true
```

- Helm repo add

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

- Helm install:

```bash
helm -n system-ingressctl upgrade --install ingress-nginx ingress-nginx/ingress-nginx -f ingress.yaml
```