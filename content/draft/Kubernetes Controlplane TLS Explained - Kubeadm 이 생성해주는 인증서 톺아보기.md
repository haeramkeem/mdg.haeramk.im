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

## CA 인증서 소개

- `ca`: 클러스터 내에서 범용적으로 사용되는 CA
- `etcd-ca`: etcd 와 관련된 구성요소들이 통신할 때 사용하는 CA
- `front-proxy-ca`: [[쿠버네티스에 API Aggregation Layer]] 를 구성할 때 사용하는 CA

## CA-Signed 인증서 소개

### `admin.conf`

| 파일 위치 |
| --- |
| `/etc/kubernetes/admin.conf` |

- ( 클러스터 관리자 ) -> ( kube-apisever ) 접근하기 위한 Kubeconfig 파일

### `apiserver`

| 파일 위치 |
| --- |
| `/etc/kubernetes/pki/apiserver.{crt,key}` |
- `apiserver`: ( 아무개 클라이언트 ) -> ( kube-apiserver ) 접근하기 위한 인증서

### `apiserver-etcd-client.{crt,key}`

- `apiserver-etcd-client`: ( kube-apiserver ) -> ( etcd ) 접근하기 위한 인증서

### `apiserver-kubelet-client.{crt,key}`

- `apiserver-kubelet-client`: kube-apiserver 가 kubelet 에 접근하기 위한 인증서

### `controller-manager.conf`

- `controller-manager.conf`: kube-controller-manager 가 kube-apiserver 에 접근하기 위한 Kubeconfig 파일

### `etcd-healthcheck-client.{crt,key}`

- `etcd-healthcheck-client`: Client 가 etcd 에 접근해서 etcd 클러스터가 살아있는지 확인하기 위해 사용하는 인증서
- `etcd-peer`: etcd member 끼리 통신할 때 사용하는 인증서
- `etcd-server`: etcd server 인증서
- `front-proxy-client`: 
- `scheduler.conf`: kube-scheduler 가 kube-apiserver 에 접근하기 위한 Kubeconfig 파일