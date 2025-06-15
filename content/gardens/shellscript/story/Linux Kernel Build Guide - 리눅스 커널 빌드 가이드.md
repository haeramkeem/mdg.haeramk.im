---
tags:
  - shellscript
  - story
date: 2025-06-07
---
> [!info]- 참고한 것들
> - [어떤 가이드](https://phoenixnap.com/kb/build-linux-kernel)

## TL;DR

- 일단 원하는 linux kernel source code 는 이미 다운로드 받아서 해당 디렉토리에 들어갔다는 전제 하에,
- 일단 필요한 패키지들부터 설치

```bash
sudo apt-get install -y git fakeroot build-essential ncurses-dev xz-utils libssl-dev bc flex libelf-dev bison
```

- 기존의 boot config 을 복사해오고,

```bash
cp -v /boot/config-$(uname -r) .config
```

- 아래 명령어로 기본 설정을 해줄 수 있다.
	- 간단한 조작 방법은
		- 방향키 위아래로 submenu 를 움직일 수 있고, 선택은 스페이스바로 하면 된다.
		- 그리고 방향키 양옆으로 `Save`, `Exit`, ... 등을 움직일 수 있고, 이 선택은 엔터로 하면 된다.
	- 모르겠으면 그냥 `Save` + `Exit` 을 하면 된다.

```bash
make menuconfig
```

- 그리고 Ubuntu 의 경우에는 높은 확률로 `No rule to make target 'debian/canonical-certs.pem'` 라는 에러를 만나게 되는데, 이걸 방지하기 위해 아래의 명령어로 관련 설정을 disable 해준다.

```bash
scripts/config --disable SYSTEM_TRUSTED_KEYS
scripts/config --disable SYSTEM_REVOCATION_KEYS
```

- 그리고 compile 시작
	- 여기서 뭐 선택하는게 나오면 그냥 엔터눌러서 넘기면 된다.

```bash
make -j`nproc`
```

- 환경에 따라 다르겠지만, 보통 compile 에는 아주 오랜 시간이 걸린다. 어쨋든 이게 끝나고 난 다음에는 아래의 명령어로 모듈을 설치해주고,

```bash
sudo make modules_install
```

- `make install` 을 해주면 compile 한 커널이 설치된다.

```bash
sudo make install
```

- 그리고 재부팅 후 커널 버전을 확인해보면 바뀐 것을 알 수 있을것이야.

```bash
# sudo reboot
uname -mrs
```