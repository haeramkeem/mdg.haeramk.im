> [!info] [이 공식 문서](https://kubernetes.io/docs/setup/best-practices/certificates)를 주로 참고했지요

## 어떤게 있을까?

- 일단 인증서 파일들은 `/etc/kubernetes/pki` 디렉토리에 있다.
- 아래의 명령어로 Kubeadm 이 생성하는 인증서와 만료기간, CA 정보 등을 확인할 수 있다.

```bash
sudo kubeadm certs check-expiration
```

- 그럼 아래처럼 나온다.

```
[check-expiration] Reading configuration from the cluster...
[check-expiration] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'

CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
admin.conf                 Aug 30, 2024 11:38 UTC   364d            ca                      no      
apiserver                  Aug 30, 2024 11:38 UTC   364d            ca                      no      
apiserver-etcd-client      Aug 30, 2024 11:38 UTC   364d            etcd-ca                 no      
apiserver-kubelet-client   Aug 30, 2024 11:38 UTC   364d            ca                      no      
controller-manager.conf    Aug 30, 2024 11:38 UTC   364d            ca                      no      
etcd-healthcheck-client    Aug 30, 2024 11:38 UTC   364d            etcd-ca                 no      
etcd-peer                  Aug 30, 2024 11:38 UTC   364d            etcd-ca                 no      
etcd-server                Aug 30, 2024 11:38 UTC   364d            etcd-ca                 no      
front-proxy-client         Aug 30, 2024 11:38 UTC   364d            front-proxy-ca          no      
scheduler.conf             Aug 30, 2024 11:38 UTC   364d            ca                      no      

CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
ca                      Aug 28, 2033 11:38 UTC   9y              no      
etcd-ca                 Aug 28, 2033 11:38 UTC   9y              no      
front-proxy-ca          Aug 28, 2033 11:38 UTC   9y              no
```

- 자 그럼 이제 이 인증서들을 차근차근 살펴보자구

## Kubernetes Controlplane 에서 사용하는 인증서들

### 개요

- Controlplane 의 모든 구성요소들은 기본적으로 [[Mutual TLS, mTLS (PKIX)|mTLS(mutual TLS)]] 로 통신하기 때문에, Server cert 뿐만 아니라 Client cert 도 생성되게 된다.
- 따라서 인증서들이 **경**장히 많이 생성되게 되는데, 이들 모두를 신뢰하기 위해 Self-signed root CA cert 를 생성하고 이것을 신뢰하도록 Host level 에 설정하는 식으로 구현된다.
	- APT 로 Kubernetes 관련 패키지를 설치하다 보면 dependency 로 `ca-certificates` 라는 패키지가 포함되어 있는 것을 확인할 수 있는데, 이 툴을 이용해 Host level trust 를 제공한다.
- 어쨋든 그럼 사용되는 인증서들을 대략 다음과 같이 세가지로 분류해 볼 수 있다.
	- CA 인증서
	- (CA-Signed) Server 인증서
	- (CA-Signed) Client 인증서

### CA 인증서

- `ca`
	- 클러스터 내에서 범용적으로 사용되는 CA
	- 파일 위치: `/etc/kubernetes/pki/ca.{crt,key}`
- `etcd-ca`
	- etcd 와 관련된 구성요소들이 통신할 때 사용하는 CA
	- 파일 위치: `/etc/kubernetes/pki/etcd/ca.{crt,key}`
- `front-proxy-ca`
	- Kube-apiserver 앞단에 NGINX 같은 proxy 를 둘 수 있는데, 이때 사용하는 CA
		- 이러한 proxy 를 이용해 사용자 인증 과정을 proxy 에 위임하거나, proxy 에서 생성하는 로그를 통해 접속을 모니터링 하는 등의 방식으로 클러스터를 구성할 수 있다... 자세한 건 [[API Aggregation Layer on Kubernetes - 쿠버네티스 앞에 Proxy 서버 붙이기|이 문서]] 를 보자
	- 파일 위치: `/etc/kubernetes/pki/front-proxy-ca.{crt,key}`

### (CA-Signed) Server 인증서

- `apiserver`
	- Kube-apiserver 가 접근하는 클라이언트들에게 제시하는 Server 인증서.
	- 파일 위치: `/etc/kubernetes/pki/apiserver.{crt,key}`
- `etcd-server`
	- Etcd 가 접근하는 클라이언트들에게 제시하는 Server 인증서
	- 파일 위치: `/etc/kubernetes/pki/etcd/server.{crt,key}`

### (CA-Signed) Client 인증서

- `admin.conf`
	- 클러스터 관리자가 Kube-apisever 에 접근하기 위해 제시하는 Kubeconfig 형태의 인증서.
	- 파일 위치: `/etc/kubernetes/admin.conf`
- `apiserver-etcd-client`
	- Kube-apiserver 가 etcd 에 접근하기 위해 제시하는 인증서.
	- 파일 위치: `/etc/kubernetes/pki/apiserver-etcd-client.{crt,key}`
- `apiserver-kubelet-client`
	- Kube-apiserver 가 kubelet 에 접근하기 위해 제시하는 인증서.
	- 파일 위치: `/etc/kubernetes/pki/apiserver-kubelet-client.{crt,key}`
- `controller-manager.conf`
	- Kube-controller-manager 가 Kube-apiserver 에 접근하기 위해 제시하는 Kubeconfig 형태의 인증서.
	- 파일 위치: `/etc/kubernetes/controller-manager.conf`
- `etcd-healthcheck-client`
	- 
	- 파일 위치: `/etc/kubernetes/pki/etcd/healthcheck-client.{crt,key}`
- `etcd-peer`
	- etcd member 가 다른 etcd member 에 접근하기 위해 제시하는 인증서.
	- 파일위치: `/etc/kubernetes/pki/etcd/peer.{crt,key}`
- `front-proxy-client`
	- Kube-apiserver 앞단에 위치한 proxy 가 Kube-apiserver 에 접근하기 위해 제시하는 인증서.
	- 파일 위치: `/etc/kubernetes/pki/front-proxy-client.{crt,key}`
- `scheduler.conf`
	- Kube-scheduler 가 Kube-apiserver 에 접근하기 위해 제시하는 Kubeconfig 형태의 인증서.
	- 파일 위치: `/etc/kubernetes/scheduler.conf`