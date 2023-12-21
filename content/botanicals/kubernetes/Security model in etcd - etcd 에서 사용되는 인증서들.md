> [!info] 참고한 [공식 문서](https://etcd.io/docs/v3.5/op-guide/security/)
## 개요

- [[Kubernetes Controlplane TLS Explained - Kubeadm 이 생성해주는 인증서 톺아보기|이 글]] 을 적다가 etcd 에서 사용되는 인증서들 용도가 헷갈려서 직접 확인해본 내용들.
- etcd 클러스터를 직접 구축해봤으면 더 좋았겠지만, 일단 [Kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm) 으로 생성한 쿠버네티스 클러스터 controlplane 의 etcd 클러스터를 이용했다.

## etcd 의 인증서들

![[etcd_tls.png]]

- 일반적인 서버 프로그램의 인증서 관련 설정 처럼, etcd 에서도 그냥 `cert-file` 혹은 `key-file` 이라 한다면 이것은 Client-to-server communication 에서 사용되는 인증서를 일컫는다.
	- 이들은 `2379` 포트로 통신할 때 사용되고, 외부 클라이언트가 접근할 용도이다.
- *그런데 말입니다* etcd 에는 `peer` 가 붙은 인증서 관련 설정들이 있는데, 이것은 etcd 가 분산 DB 이기 때문에 각 서버끼리 통신하는 데 사용되는 인증서 설정이다.
	- 즉, server-to-server 혹은 server-to-cluster 통신에 사용되는 인증서인 것.
	- 이들은 `2380` 포트로 통신할 때 사용된다.
- 그럼 이제 쿠버네티스 클러스터의 controlplane node 중 하나에 ssh 로 접속해서 어떤 식으로 설정되어 있는지, 진짜로 그렇게 작동하는지 등을 확인해 보자.

## Client-to-server communication

### 관련 설정들

- 먼저, etcd pod 의 관련 설정부터 보면 다음과 같다.

```yaml
# 파일위치: /etc/kubernetes/manifests/etcd.yaml
- etcd
- --advertise-client-urls=https://${HOST_IP}:2379
- --cert-file=/etc/kubernetes/pki/etcd/server.crt
- --client-cert-auth=true
# 중략...
- --key-file=/etc/kubernetes/pki/etcd/server.key
- --listen-client-urls=https://127.0.0.1:2379,https://${HOST_IP}:2379
# 중략...
- --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
```

- Client 가 접근할 진입점에 관한 설정들
	- `--advertise-client-urls` : 이 etcd member 가 담당할 클라이언트의 url. 해당 값은 클러스터의 다른 etcd member 에 전파하여 자신이 어떤 Client 를 담당하는지 공유한다.
	- `--listen-client-urls` : 클라이언트의 접속을 허용할 IP 와 Port.
- 인증서와 관련된 설정들
	- `--cert-file` : 클라이언트가 접속했을 때, 제시할 Server 인증서.
	- `--client-cert-auth` : 이 값이 `true` 라면, 통신시에 [[Mutual TLS, mTLS (PKIX)|mTLS]] 를 강제한다. 즉, 클라이언트도 인증서를 제시해야 한다.
	- `--key-file` : 클라이언트가 접속했을 때, 제시할 Server 인증서에 대한 개인키.
	- `--trusted-ca-file` : 신뢰할 CA 인증서.

### Client 인증서를 직접 만들어 요청해보기

1. Configuration 파일 작성 (`test-client.conf`)

```
[req]
distinguished_name = cert_dn
x509_extensions = v3_req
prompt = no

[cert_dn]
CN = test-client

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
basicConstraints = critical, CA:FALSE
subjectKeyIdentifier = hash
```

2. 사용할 개인키 (`test-client.key`) 및 CSR (Certificate Signing Request - `test-client.csr`) 생성

```bash
openssl req -new -nodes \
	-newkey rsa:2048 \
	-keyout test-client.key \
	-out test-client.csr \
	-config test-client.conf
```

3. 인증서 생성 (`test-client.crt`)

```bash
sudo openssl x509 -req -days 1 -sha256 \
	-in test-client.csr \
	-extensions v3_req \
	-extfile test-client.conf \
	-CA /etc/kubernetes/pki/etcd/ca.crt \
	-CAkey /etc/kubernetes/pki/etcd/ca.key \
	-CAcreateserial \
	-out test-client.crt
```

- 그리고 이 인증서를 바탕으로, 2379 포트로 요청을 보내면 정상적으로 응답이 오는 것을 볼 수 있다.

```bash
curl \
	--cacert /etc/kubernetes/pki/etcd/ca.crt \
	--cert test-client.crt \
	--key test-client.key \
	https://${HOST_IP}:2379/version
```

```
{"etcdserver":"3.5.6","etcdcluster":"3.5.0"}
```

### Server 는 어떤 인증서를 제시할까?

- [[openssl - Server 인증서 다운로드 하기|openssl s_client]] 모듈로 Server 가 어떤 인증서를 제시하는지 확인해 보자.

```bash
openssl s_client -showcerts -connect ${HOST_IP}:2379 </dev/null 2>/dev/null \
	| openssl x509 -text -noout
```

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: ### 어쩌고 ###
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = etcd-ca
        Validity
            Not Before: Jan  0 00:00:00 0000 GMT
            Not After : Jan  0 00:00:00 0000 GMT
        Subject: CN = ${HOSTNAME}
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    ### 어쩌고 ###
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Extended Key Usage: 
                TLS Web Server Authentication, TLS Web Client Authentication
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Authority Key Identifier:
                keyid:### 어쩌고 ###
            X509v3 Subject Alternative Name: 
                DNS:${HOSTNAME}, DNS:localhost, IP Address:${HOST_IP}, IP Address:127.0.0.1, IP Address:0:0:0:0:0:0:0:1
    Signature Algorithm: sha256WithRSAEncryption
         ### 어쩌고 ###
```

- 확인해 보면, Issuer 는 etcd-ca 이고, x509 key usage 에 Server auth 가 포함되어 있는 인증서인 것을 알 수 있다.
- 근데 설정에 따르면, Server 인증서로 `/etc/kubernetes/pki/etcd/server.crt` 를 제시하도록 되어 있었다. 아래의 명령어로 실제로 그런지 확인해 보자.

```bash
diff \
	<(openssl s_client -showcerts -connect ${HOST_IP}:2379 </dev/null 2>/dev/null | openssl x509 -outform PEM) \
	/etc/kubernetes/pki/etcd/server.crt
```

- 실행해보면 아무것도 출력되지 않는 것을 확인할 수 있다. 즉, 둘 간의 차이가 없다는 것을 알 수 있다.

## Peer (server-to-server / cluster) communication

### 관련 설정들

- 이제 Peer 통신에서 사용하는 인증서를 확인해보자. etcd pod 에서 관련 설정들은 다음과 같다.
```yaml
# 파일위치: /etc/kubernetes/manifests/etcd.yaml
- etcd
# 중략
- --initial-advertise-peer-urls=https://${HOST_IP}:2380
- --initial-cluster=${HOSTNAME}=https://${HOST_IP}:2380
# 중략
- --listen-peer-urls=https://${HOST_IP}:2380
# 중략
- --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt
- --peer-client-cert-auth=true
- --peer-key-file=/etc/kubernetes/pki/etcd/peer.key
- --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
# 후략
```

- etcd member 들의 접근 진입점에 대한 설정들
	- `--initial-advertise-peer-urls` : 다른 etcd member 들의 url.
	- `--initial-cluster` : 다른 etcd 클러스터에 합류하는 경우, 해당 클러스터의 url (기본값은 자기자신이다).
	- `--listen-peer-urls` : 다른 etcd member 의 접근을 허용할 IP 와 Port.
- 인증서 관련 설정들
	- `--peer-cert-file` : etcd member 가 접근했을 때, 제시할 Server 인증서.
	- `--peer-client-cert-auth` : etcd member 에 대해 [[Mutual TLS, mTLS (PKIX)|mTLS]] 를 강제할 것인지에 대한 여부. 즉, 이 값이 `true` 라면, etcd member 가 접근할 때에 Client 인증서를 제시해야 한다.
	- `--peer-key-file` : etcd member 가 접근했을 때, 제시할 Server 인증서에 대한 개인키.
	- `--peer-trusted-ca-file` : 신뢰할 CA 인증서

### Client 인증서를 직접 만들어 요청해보기

- ...는 해보려 했으나 잘 안된다. 인증서 관련 문제는 아닌 것 같은데, cURL 로 보내면 `EMPTY_RESPONSE` 가 오고, [grpcurl](https://github.com/fullstorydev/grpcurl) 로 보내면 timeout 이 발생한다.
	- etcd 로그에는 `tls: first record does not look like a TLS handshake` 에러가 출력된다.
	- 찾아보니 https 으로 요청을 보내지 않아서 그렇다고 하는데... grpcurl 에는 인증서만 설정하면 https 로 보내는 것 같은데 좀 이상함.
	- 일단 여기까지 하고 나중에 좀 더 확인해봐야 겠다.

```bash
sudo grpcurl -cacert /etc/kubernetes/pki/etcd/ca.crt -cert /etc/kubernetes/pki/etcd/peer.crt -key /etc/kubernetes/pki/etcd/peer.key ${HOSTNAME}:2380 list
```

```
{"level":"warn","ts":"2023-12-21T02:56:29.148Z","caller":"embed/config_logging.go:169","msg":"rejected connection","remote-addr":"$IP:$PORT","server-name":"","error":"tls: first record does not look like a TLS handshake"}
{"level":"warn","ts":"2023-12-21T02:56:30.150Z","caller":"embed/config_logging.go:169","msg":"rejected connection","remote-addr":"$IP:$PORT","server-name":"","error":"tls: first record does not look like a TLS handshake"}
{"level":"warn","ts":"2023-12-21T02:56:31.480Z","caller":"embed/config_logging.go:169","msg":"rejected connection","remote-addr":"$IP:$PORT","server-name":"","error":"tls: first record does not look like a TLS handshake"}
{"level":"warn","ts":"2023-12-21T02:56:33.865Z","caller":"embed/config_logging.go:169","msg":"rejected connection","remote-addr":"$IP:$PORT","server-name":"","error":"tls: first record does not look like a TLS handshake"}
{"level":"warn","ts":"2023-12-21T02:56:37.999Z","caller":"embed/config_logging.go:169","msg":"rejected connection","remote-addr":"$IP:$PORT","server-name":"","error":"tls: first record does not look like a TLS handshake"}
```

### Server 는 어떤 인증서를 제시할까?

- [[Security model in etcd - etcd 에서 사용되는 인증서들#Server 는 어떤 인증서를 제시할까?|Client-to-server TLS 실습]] 에서와 마찬가지로, [[openssl - Server 인증서 다운로드 하기|openssl s_client]] 모듈로 Server 가 어떤 인증서를 제시하는지 확인해 보자.

```bash
openssl s_client -showcerts -connect ${HOST_IP}:2380 </dev/null 2>/dev/null \
	| openssl x509 -text -noout
```

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: ### 어쩌고 ###
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = etcd-ca
        Validity
            Not Before: Jan  0 00:00:00 0000 GMT
            Not After : Jan  0 00:00:00 0000 GMT
        Subject: CN = ${HOSTNAME}
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    ### 어쩌고 ###
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Extended Key Usage: 
                TLS Web Server Authentication, TLS Web Client Authentication
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Authority Key Identifier:
                keyid:### 어쩌고 ###
            X509v3 Subject Alternative Name: 
                DNS:${HOSTNAME}, DNS:localhost, IP Address:${HOST_IP}, IP Address:127.0.0.1, IP Address:0:0:0:0:0:0:0:1
    Signature Algorithm: sha256WithRSAEncryption
         ### 어쩌고 ###
```

- 그럼 [[Security model in etcd - etcd 에서 사용되는 인증서들#Server 는 어떤 인증서를 제시할까?|Client-to-server TLS 실습]] 에서와 유사하게, Issuer 는 etcd-ca 이고, x509 key usage 에 Server auth 가 포함되어 있는 인증서인 것을 알 수 있다.
- 그럼 이 인증서는 과연 `--peer-cert-file` 로 설정돼 있는 `/etc/kubernetes/pki/etcd/peer.crt` 와 동일할까? 아래의 명령어로 확인해 보자.

```bash
diff \
	<(openssl s_client -showcerts -connect ${HOST_IP}:2380 </dev/null 2>/dev/null | openssl x509 -outform PEM) \
	/etc/kubernetes/pki/etcd/peer.crt
```

- 실행해보면 마찬가지로 아무것도 출력되지 않는다. 설정한 대로 잘 작동하고 있다는 뜻이다.