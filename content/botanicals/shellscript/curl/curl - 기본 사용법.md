---
tags:
  - 쉘스크립트
  - bash-curl
date: 2024-01-30
---
> [!info] [cURL 공홈](https://curl.se/)
## 개요

- 뭐 이런것까지 포스팅하냐.. 싶겠지만
- 그냥 cURL 소개 페이지라고 생각해주라

## cURL?

- URL 을 이용해 데이터를 주고 받는 CLI 툴 이라고 한다.
- 1998년부터 개발되어 왔다고 한다. 와우
- 소스코드는 [깃허브](https://github.com/curl/curl) 에서 관리되고 있는 것 같다 (미러가 아닌 것 같음).
	- 2024-01-29 기준, 거의 매일 commit 이 되고 있다.

## 사용법

- 별거 없다; URL 만 적으면 된다.

```bash
curl www.example.com
```

- `-v`: 근데 이제 좀 더 자세한 정보를 곁들인
	- 이 Verbose 옵션을 이용해 HTTP 상태, 헤더, TLS 처리 상태 등을 확인할 수 있다.

```bash
curl -v www.example.com
```