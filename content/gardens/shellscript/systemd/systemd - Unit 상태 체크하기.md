---
tags:
  - shellscript
  - bash-systemd
date: 2025-08-11
aliases:
  - systemctl is-active
---
## TL;DR

- Unit 의 상태를 체크하기 위해서는 `is-active` subcommand 를 사용하면 된다.

```bash
sudo systemctl is-active ${Unit 이름}
```

- 물론 그냥 상태를 눈으로 확인하기 위해서는 [[systemd - 세상 간단한 Unit 예시|systemctl status]] 를 사용하면 된다. 이 `is-active` 는 script 에서 유용하게 사용할 수 있다.
- 활성화된 unit 에 대해서는 `active` 메세지가 뜨고 종료상태가 0 이다.

![[Pasted image 20250811083622.png]]

![[Pasted image 20250811083643.png]]

- 하지만 존재하지 않거나 비활성화된 unit 에 대해서는 `inactive` 메세지가 뜨고 0 이 아닌 종료상태를 가진다.

![[Pasted image 20250811083719.png]]

![[Pasted image 20250811083732.png]]