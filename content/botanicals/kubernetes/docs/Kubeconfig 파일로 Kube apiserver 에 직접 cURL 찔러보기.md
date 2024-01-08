## 개요

- 물논 [kubectl](https://kubernetes.io/docs/reference/kubectl/) 을 사용하면 간편하게 Kube apiserver 에 API 를 찔러서 기능들을 활용할 수 있지만,
- 인증서 관련 디버깅을 해야되거나, 아니면 작동 원리 등이 궁금할 때 kubectl 을 사용하지 않고 직접 [cURL](https://curl.se/) 로 Kube apiserver 에 접근하는 것은 알아두면 좋다.
	- 심지어 cURL 의 `--verbose` 옵션을 이용해 추가적인 정보를 얻을 수도 있다..!
- Kube apiserver 에 cURL 을 찌르기 위해서는 다음의 세 파일이 필요하다:
	1. CA 인증서: Kube apiserver 는 보통 self-signed CA 인증서를 사용하기 때문에, cURL 에게 해당 CA 를 신뢰해야 한다는 것을 알려줘야 한다
	2. Client 인증서: Client 인증서가 필요한 이유는 두가지 이다:
		1. mTLS (mutual TLS) 를 제공하기 위해. 즉, Client <-> Kube apiserver 양방향 통신 간 암호화를 지원하기 위해
		2. Client 인증을 위해: Kube apiserver 에 Client 의 정보를 전달할 때, 이 인증서의 CN (Common Name) 과 O (Organization) 항목을 사용한다.
	4. Client 개인키: Client 인증서에 대한 개인키 파일
- 그래서 [YAML Query (yq)](https://github.com/mikefarah/yq) 를 이용해 Kubeconfig 파일에서 필요한 정보들을 뽑아내 Kube apiserver 에 cURL 를 찔러보자

## 말이 너무 많다! (TL;DR)

> 아래 실습은 Kubeconfig 로 `/etc/kubernetes/admin.conf` 를 이용하기에, Control plane node 에서 진행해야 한다.

1. yq 로 admin.conf 에서 CA 인증서 뽑아내기

```bash
yq '.clusters.[0].cluster.certificate-authority-data' /etc/kubernetes/admin.conf | base64 -d
```

결과 예시:

```
-----BEGIN CERTIFICATE-----
### 뭔가 심오한 알파벳들 ###
-----END CERTIFICATE-----
```

2. yq 로 kube-apiserver 진입점 url 뽑아내기

```bash
yq '.clusters.[0].cluster.server' /etc/kubernetes/admin.conf
```

결과 예시:

```
https://localhost:6443
```

3. yq 로 client 인증서 뽑아내기

```bash
yq '.users.[0].user.client-certificate-data' /etc/kubernetes/admin.conf | base64 -d
```

결과 예시:

```
-----BEGIN CERTIFICATE-----
### 뭔가 심오한 알파벳들 ###
-----END CERTIFICATE-----
```

5. yq 로 client 인증서 개인키 뽑아내기

```bash
yq '.users.[0].user.client-key-data' /etc/kubernetes/admin.conf | base64 -d
```

결과 예시:

```
-----BEGIN RSA PRIVATE KEY-----
### 뭔가 심오한 알파벳들 ###
-----END RSA PRIVATE KEY-----
```

6. 위에서 뽑아낸 정보를 이용해 cURL 로 Kube-apiserver 에 직접 API 를 찔러보자

```bash
curl \
    --cacert <(yq '.clusters.[0].cluster.certificate-authority-data' /etc/kubernetes/admin.conf | base64 -d) \
    --cert <(yq '.users.[0].user.client-certificate-data' /etc/kubernetes/admin.conf | base64 -d) \
    --key <(yq '.users.[0].user.client-key-data' /etc/kubernetes/admin.conf | base64 -d) \
    $(yq '.clusters.[0].cluster.server' /etc/kubernetes/admin.conf)
```

7. 그럼 아래와 같이 결과가 정상적으로 나오는 것을 볼 수 있다

```JSON
{
  "paths": [
    "/.well-known/openid-configuration",
    "/api",
    "/api/v1",
    "/apis",
    "/apis/",
    "/apis/acme.cert-manager.io",
    "/apis/acme.cert-manager.io/v1",
    // 후략 ...
}
```