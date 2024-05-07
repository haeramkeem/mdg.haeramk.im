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

## Kubernetes Control Plane 에서 사용하는 인증서들

![[kubernetes_controlplane_tls.png]]

- Control Plane 의 모든 구성요소들은 기본적으로 [[Mutual TLS, mTLS (PKIX)|mTLS(mutual TLS)]] 로 통신하기 때문에, Server cert 뿐만 아니라 Client cert 도 생성되게 된다.
- 따라서 인증서들이 **경**장히 많이 생성되게 되는데, 이들 모두를 신뢰하기 위해 Self-signed root CA cert 를 생성하고 이것을 신뢰하도록 Host level 에 설정하는 식으로 구현된다.
	- APT 로 Kubernetes 관련 패키지를 설치하다 보면 dependency 로 `ca-certificates` 라는 패키지가 포함되어 있는 것을 확인할 수 있는데, 이 툴을 이용해 Host level trust 를 제공한다.
- 어쨋든 그럼 사용되는 인증서들을 대략 다음과 같이 세가지로 분류해 볼 수 있다.
	- CA 인증서
	- (CA-Signed) Server 인증서
		- 이 인증서들은 x509 key usage 에 `Server Auth` 가 포함되어 있다
	- (CA-Signed) Client 인증서
		- 이 인증서들은 x509 key usage 에 `Client Auth` 가 포함되어 있다

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
- `etcd-server` (Client, Server 겸용)
	- etcd 가 접근하는 클라이언트들에게 제시하는 Server 인증서.
		- [[Kubernetes Control Plane TLS explained - 컨트롤 플레인 인증서 톺아보기#(CA-Signed) Client 인증서|뒤]] 에서 한번 더 말하겠지만, 이 인증서는 Client 인증서로 사용할 수도 있다.
	- 파일 위치: `/etc/kubernetes/pki/etcd/server.{crt,key}`
- `etcd-peer` (Client, Server 겸용)
	- etcd 가 접근하는 etcd member 들에게 제시하는 Server 인증서.
		- 이 인증서도 Client 인증서로 사용할 수도 있다. ([[Kubernetes Control Plane TLS explained - 컨트롤 플레인 인증서 톺아보기#(CA-Signed) Client 인증서|뒤]] 에서 한번 더 등장한다.)
		- Member 가 다른 member 에 접근했을 때 server 인증서로 `etcd-server` 를 제시할 지 아니면 `etcd-peer` 를 제시할 지 궁금해서 [[Security model in etcd - etcd 에서 사용되는 인증서들|이 디버깅 기록]] 에서 확인해 봤는데, `etcd-peer` 인증서가 날라왔다.
	- 파일위치: `/etc/kubernetes/pki/etcd/peer.{crt,key}`

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
	- 클라이언트가 Etcd 에 접근하기 위해 제시하는 인증서.
		- 찾아보니 Control Plane 구성 요소들 중에 이 인증서를 사용하는 것은 없는 것 같다.
		- 확실하진 않지만, [이거](https://kubernetes.io/docs/setup/best-practices/certificates/#certificate-paths) 를 보면 `etcdctl` 등의 툴로 etcd 클러스터에 접근하기 위한 용도인 듯 하다.
	- 파일 위치: `/etc/kubernetes/pki/etcd/healthcheck-client.{crt,key}`
- `etcd-server` (Client, Server 공용)
	- 솔직히 나도 이게 왜 Client 인증서인지 모르겠다.
		- 일단 x509 key usage 에 server auth 말고 client auth 도 포함이 되어 있어서 Client 인증으로도 사용할 수 있다는 것은 알겠는데,
		- 어떻게 사용되는지는 아직 확인 안됨.
	- 파일 위치: `/etc/kubernetes/pki/etcd/server.{crt,key}`
- `etcd-peer` (Client, Server 공용)
	- etcd member 가 다른 etcd member 에 접근하기 위해 제시하는 인증서.
	- Client, Server 공용이다. 즉, x509 key usage 에 server auth 와 client auth 가 모두 포함되어 있다.
	- 파일위치: `/etc/kubernetes/pki/etcd/peer.{crt,key}`
- `front-proxy-client`
	- Kube-apiserver 앞단에 위치한 proxy 가 Kube-apiserver 에 접근하기 위해 제시하는 인증서.
	- 파일 위치: `/etc/kubernetes/pki/front-proxy-client.{crt,key}`
- `scheduler.conf`
	- Kube-scheduler 가 Kube-apiserver 에 접근하기 위해 제시하는 Kubeconfig 형태의 인증서.
	- 파일 위치: `/etc/kubernetes/scheduler.conf`

### 기타 - 위 그림에서 (괄호) 로 표시된 항목

- `(kubelet.conf)`
	- Kubelet 이 Kube-apiserver 에 접근하기 위해 제시하는 Kubeconfig 형태의 인증서
	- 인데, `kubeadm certs` 명령어에 표시되지 않는 이유는 이 인증서가 자동으로 rotation 되기 때문이다.
		- 즉, 주기적으로 재생성되며 기간이 만료되지 않게 자동으로 관리되기 때문
- `(kube-system/cm/kube-proxy)`
	- Kube-proxy 가 kube-apiserver 에 접근하기 위해 제시하는 Kubeconfig 형태의 인증서
	- 인데, 얘는 파일로 관리되지 않고 클러스터 내에 ConfigMap 으로 저장된다.
	- 그리고 Client 인증서가 아니라 Service Account 의 Token 방식으로 Kube-apiserver 에 인증한다.
	- 다음 명령어로 내용을 확인할 수 있다.

```bash
kubectl -n kube-system get cm kube-proxy -ojsonpath='{.data.kubeconfig\.conf}'
```

- `(whatever)`
	- 얘는 사용자가 Proxy 서버에 인증한다는 것을 의미하기 위해 그려놓았고, 딱히 뭐 정해진 뭔가는 없다.
	- Proxy 서버를 설정(구현) 하기 나름
