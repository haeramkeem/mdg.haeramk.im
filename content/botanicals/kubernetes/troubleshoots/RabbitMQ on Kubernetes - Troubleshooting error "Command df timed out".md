---
title: "RabbitMQ on Kubernetes - \"Command timed out: 'df -kP ...'\" 에러 해결기"
tags:
  - 삽질록
  - Kubernetes
  - rabbit-mq
date: 2024-01-08
---
## 증상

- 의뢰인인 어떤 백엔드 개고수의 증언에 따르면, Kubernetes 에다가 RabbitMQ 공식 이미지를 이용해 StatefulSet 으로 배포해 잘 사용하던 중에 어느날 파드가 `CrashLoopBackOff` 상태가 되며 작동하지 않았다고 한다.
- 로그를 확인해 보니 다음과 같은 문구가 있었다: Index 들을 rebuilding 한다는 경고 뒤에, `df` 명령어가 시간초과 되었다는 것.

```
0000-00-00 00:00:00.000000+00:00 [warning] <0.527.0> Message store 'something_hashy/msg_store_persistent': rebuilding indices from scratch
0000-00-00 00:00:00.000000+00:00 [error] <0.355.0> Command timed out: '/usr/bin/df -kP /path/to/data'
```

- 이에 [장림 깊은 골로 대한 짐생 내려와](https://namu.wiki/w/%ED%86%A0%EB%81%BC%EC%A0%84) 해결하니...

## 디버깅 기록

### 시간 초과난 명령어(`/usr/bin/df -kP …`) 를 직접 실행해 보자.

- 하지만 `kubectl exec` 으로 직접 실행했을 때에는 그리 오래 걸리지 않았다.

```bash
time kubectl exec -it rabbitmq-0 -- /usr/bin/df -kP /path/to/data
```

```
결과: 에잉 얼마 안걸리지롱
```

### 에러 관련 서칭: `3.10.8` 버전부터 fix 되었다고 한다.

- [RabbitMQ Discussion #4753: Retrieving free disk space on Linux timed out](https://github.com/rabbitmq/rabbitmq-server/discussions/4753)
	- 위의 Discussion 에서 2가지를 알아낼 수 있었다.
		- `df` 명령어는 리소스를 많이 먹는 작업은 아니지만 싱글코어 혹은 많은 작업들이 실행되는 환경에서는 timeout 이 날 수 있다.
		- 이 문제는 `3.10.8` 버전부터 해결되었다. ([관련 PR!](https://github.com/rabbitmq/rabbitmq-server/pull/5726))
- 하지만 container log 를 확인해보면 `3.10.7` 버전인 것을 알 수 있었다.

```bash
kubectl logs rabbitmq-0
```

```
...
  ##  ##	  RabbitMQ 3.10.7
  ##  ##
  ##########  Copyright (c) 2007-2022 VMware, Inc. or its affiliates.
  ######  ##
  ##########  Licensed under the MPL 2.0. Website: <https://rabbitmq.com>

  Erlang:	  25.0.3 [jit]
  TLS Library: OpenSSL - OpenSSL 1.1.1q  5 Jul 2022

  Doc guides:  <https://rabbitmq.com/documentation.html>
  Support:	 <https://rabbitmq.com/contact.html>
  Tutorials:   <https://rabbitmq.com/getstarted.html>
  Monitoring:  <https://rabbitmq.com/monitoring.html>
	
  Logs: /path/to/logs
		<stdout>

  Config file(s): /path/to/configs
...
```

### Image 변경 & LivenessProbe 비활성화 후 pod 실행

- `3.10.8` 버전부터 fix 되었다고 하기에, docker hub 에 올라와 있는 3.10.x 버전인 `3.10.25` 를 사용하기로 결정. ([사용한 이미지](https://hub.docker.com/layers/library/rabbitmq/3.10.25-management/images/sha256-0eb3250acd419f41c6bef4aaad09de73ef4d8afa4bf512368d523c8ae10a5a41?context=explore))
	- 버전업의 Side effect 를 줄이기 위해 patch version 만 업그레이드 했다.
- `kubectl edit` 으로 image tag 를 변경하고, (SIGTERM 방지를 위해) LivenessProbe 도 삭제 후, pod가 정상적으로 실행될 때까지 대기...
- 결과적으로는 Indice rebuild 단계에서만 50분 걸렸다 (!!!!)
	- 아래 로그만 50분동안 쳐다보고 있었다...

```
Message store "something_hashy/msg_store_persistent": rebuilding indices from scratch
```

- 그래도 이정도면 양반인 갑다. 이사람은 1시간 30분 걸렸다 함: ["Google group conversation: msg_store_persistent: rebuilding indices from scratch" is taking a lot of time](https://groups.google.com/g/rabbitmq-users/c/pi-soX7j5EU/m/ASX5svqyUIgJ)

### Rebuild 가 정상적으로 끝났으니, 원래 상태로 되돌려 놓자.

- Indice rebuild 작업이 매번 발생하는 것이 아니고 문제 상황에서만 발생하는 것이니까 원래 이미지 버전으로 되돌려 놔도 rebuild 작업 없이 정상적으로 작동하지 않을까?
- 따라서 원래의 StatefulSet manifest 로 원복시킨 후, 상태 확인 -> 예상대로 rebuilding 작업 없이 정상적으로 작동했다. (LivenessProbe 도 성공)

## 향후 대처 방안

### 문제의 원인: RabbitMQ 가 정상적으로 종료되지 않았을 때 indice 가 깨져 rebuilding 작업이 이루어진다고 한다.

- 여기서 그랬음 - ["Google group conversation: msg_store_persistent: rebuilding indices from scratch" is taking a lot of time](https://groups.google.com/g/rabbitmq-users/c/pi-soX7j5EU/m/ehPgSkJPOcoJ)
	- SIGTERM 이나 SIGKILL 로 강제종료되는 것이 원인
	- pod 가 종료될때는 SIGTERM 을 보내기에, indice 가 깨질 우려가 있다
- 이걸 해결하기 위해 (시간이 부족해 해보진 않았다...) 두가지 정도 시도해 볼 만한 것이 있다.
	- [Kubernetes `preStop` hook](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/) 을 이용해서 종료 전에 정상적으로 cleanup 작업이 이루어 지도록 유도할 수 있지 않을까?
	- 아니면, 그냥 생 StatefulSet 말고 [RabbitMQ operator](https://www.rabbitmq.com/kubernetes/operator/operator-overview.html) 를 사용하면 이런 Lifecycle 을 관리해주지 않을까?
- 또한 여기서는 종료시에 디스크 기록 timeout 시간을 늘려 종료되기 전에 모든 데이터가 정상적으로 종료될 수 있게 해야 한다고 한다.
	- [RabbitMQ Issue #2324: Message indices fail to recover, even if the broker shuts down gracefully with rabbitmqctl](https://github.com/rabbitmq/rabbitmq-server/issues/2324#issuecomment-618912864)

### 만일 그럼에도 불구하고 rebuilding 작업이 수행되어야 할 때는, 이것을 충분히 기다려 주기 위해 StartupProbe 를 활용해 보자.

- `3.10.8` 이전의 버전에서는 프로세스 차원에서 timeout 이 발생하므로 해당 버전 이상의 이미지를 사용해야 하고,
- 또한 rebuild 도중 LivenessProbe 에 의해 종료되는 것을 막기 위해 StartupProbe 를 설정하여 이것을 기다릴 필요가 있다.