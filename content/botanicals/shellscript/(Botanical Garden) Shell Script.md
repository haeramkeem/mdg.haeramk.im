> Mark Farina - mu.sh room jazz

## 개요

- [쉘 스크립트](https://en.wikipedia.org/wiki/Shell_script) 창고
- 기존에는 [SH-IT!!](https://github.com/haeramkeem/sh-it) 에서 쉘 스크립트 관련 꿀 / 예시들을 저장했는데, 이제 이쪽으로 마이그레이션 하려고 합니당.
	- 물론 깃허브 레포지토리 이름이 맘에 들어서 아쉽긴 하지만.
- 쉘 스크립트 관련 식물들이기에, 아마 짤막짤막한 토막글들로 채워질 것 같습니다.

## 식물들

### 스토리

- [[Shell story - 디스크 마운트하기|새로 구매한 디스크 마운트하기]]

### `bash` 내장 기능

- Alias
	- [[bash - alias 설정|설정]]
	- [[bash - alias 해제|해제하기]]
- 조건문
	- [[bash - 조건문 문법|기본 문법]]
	- [[bash - 조건문으로 파일 혹은 디렉토리 존재 확인하기|파일 혹은 디렉토리 존재 확인하기]]
- 환경 변수
	- [[bash - 파일에서 환경변수 읽어오기|파일에서 환경변수 읽어오기]]
- List
	- [[bash - list 기본 사용법|기본 문법]]
- Substitution
	- [[bash - Substitution 으로 접미어 지우기|접미어 지우기]]
	- [[bash - Substitution 으로 변수 기본값 설정하기|변수 기본값 설정하기]]
	- [[bash - Substitution 으로 변수 미설정 에러 출력하기|변수 미설정 에러 출력하기]]

### 명령어 사용법

- `apt`
	- [[apt - 설치된 패키지 확인하기|설치된 패키지 확인하기]]
	- [[apt - 패키지 깔끔하게 지우기|패키지 깔끔하게 지우기]]
	- [[apt - 패키지 레포지토리 알아내기|패키지 레포지토리 알아내기]]
	- [[apt - 패키지 하나만 버전 업그레이드하기|패키지 하나만 버전 업그레이드하기]]
- `arp`
	- [[arp - ARP 테이블 요소 삭제하기|ARP 테이블 요소 삭제하기]]
	- [[arp - ARP 테이블 확인하기|ARP 테이블 확인하기]]
- `ca-certificates`
	- [[ca-certificates - 인증서 신뢰하기|인증서 신뢰하기]]
- `curl`
	- [[curl - 기본 사용법|기본 사용법]]
	- [[curl - Redirect 하기|Redirect 하기]]
	- [[curl - 타임아웃 설정하기|타임아웃 설정하기]]
	- [[curl - Progress bar 지우기|Progress bar 지우기]]
- `df`
	- [[df - 마운트 현황 출력하기|마운트 현황 출력하기]]
	- [[df - inode 현황 출력하기|inode 현황 출력하기]]
- `expr`
	- [[expr - 사칙연산하기|사칙연산하기]]
- `fdisk`
	- [[fdisk - 디스크 확인하기|디스크 확인하기]]
- `nvme-cli`
	- [[nvme-cli - 디바이스 조회|디바이스 조회]]
	- [[nvme-cli - 로그 보기|로그 보기]]
	- `zns` Subcommand
		- [[nvme-cli - ZNS zone 상태 변경|ZNS zone 상태 변경]]
		- [[nvme-cli - ZNS 디바이스 조회|ZNS 디바이스 조회]]
		- [[nvme-cli - ZNS 입출력|ZNS 입출력]]
- `openssl`
	- [[openssl - Server 인증서 다운로드 하기|Server 인증서 다운로드 하기]]
	- [[openssl - 인증서 상세 정보 확인하기|인증서 상세 정보 확인하기]]
	- [[openssl - 인증서가 어떤 CA 인증서에 의해 서명되었는지 확인하기|인증서가 어떤 CA 인증서에 의해 서명되었는지 확인하기]]
	- [[openssl - 인증서에서 CSR (Certificate Signing Request) 뽑아내기|인증서에서 CSR (Certificate Signing Request) 뽑아내기]]
- `tar`
	- [[TAR vs GZIP - 뭔차이지?]]
	- [[tar - 파일 압축하기|파일 압축하기]]
	- [[tar - 파일 압축 풀기|파일 압축 풀기]]
- `tr`
	- [[tr - 문자 지우기|문자 지우기]]
	- [[tr - 문자 대체하기|문자 대체하기]]
- `tcpdump`
	- [[tcpdump - 인터페이스 지정하기|인터페이스 지정하기]]
	- [[tcpdump - 포트 지정하기|포트 지정하기]]
- `watch`
	- [[watch - 김해람의 꿀조합|기본 사용법]]