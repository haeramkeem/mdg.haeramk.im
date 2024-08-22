---
tags:
  - os
  - 논문
  - SNU_CSE_MS_AOS24S
---
> [!info] 본 글은 Bell Labs 의 Dennis M. Ritchie 의 논문 [The Evolution of the Unix Time-sharing System](https://www.bell-labs.com/usr/dmr/www/hist.html) 를 읽고 정리한 글입니다.

> [!warning] 주인장의 실력이 미천하기에 다소 잘못된 내용이 포함되어 있을 수 있습니다.

## Introduction

- AT&T 의 Bell Labs 에서 만든 UNIX 운영체제에 대한 간략한 역사와 발전 과정을 서술했다고 한다.
- UNIX 는 1969 년에 제작되었고, 1974 년에 처음으로 [논문](https://dl.acm.org/doi/10.1145/361011.361061) 으로 발표됐으며 본 논문은 1979 년에 발표되었다고 한다. UNIX 시스템에 대한 그간의 발전 과정은 많은 교훈을 주기에 본 논문을 저술했다고 하더라.

## Origins - UNIX 가 발명되기까지 (~1969년) 의 Bell Labs 의 상황

- 1968-1969 까지의 AT&T 의 Bell Labs 의 상황은 다소 어수선했다고 한다.
	- 기존에 진행하던 [Multics](https://en.wikipedia.org/wiki/Multics) 운영체제 프로젝트가 점점 망해가고 있었고
	- Bell Labs 의 컴퓨터 센터 (Murray Hil Computer Center) 는 [GE645](https://en.wikipedia.org/wiki/Multics) 를 운용중이었는데, [GE635](https://en.wikipedia.org/wiki/GE-600_series) 에서 Multics 를 지원하기 위한 이 컴퓨터는 부족한 점이 많았으며
	- 연구소가 "Computing Service" 와 "Computing Research" 두 분야로 조직개편을 했다고 한다.
- 저자 및 그의 동료들 ([Thompson](https://en.wikipedia.org/wiki/Ken_Thompson), [Ritchie](https://en.wikipedia.org/wiki/Dennis_Ritchie), [Ossanna](https://en.wikipedia.org/wiki/Joe_Ossanna) 등) 은 Multics 에 대해 마지막까지 희망의 끈을 놓지 않고 있었다.
	- 하지만 Multics 가 제공하기로 한 편리한 사용 환경은 나중에 보니 아주 제한된 사용자들에게만 (아마 저자 및 그의 동료들에게만?) 편리한 기능이었고
	- 이외 여러 문제가 있어서 Multics 프로젝트가 엎어진듯..
- 결국에는 Multics 를 대체하기 위한 다른 것을 찾아야 했다고 한다. 이를 위해 여러 컴퓨팅 장비들을 물색해야만 했고 그것들을 구매하기 위해 노력을 많이 했으나 결국에는 기각되었다.
	- 이것은 그들이 회상해 봤을 때 너무나 많은 돈을 너무나 소규모의 조직에 쏟아 붓기를 제안했기 때문이었다.
	- 또한 연구소 입장에서는 운영체제 개발은 더이상 흥미가 느껴지지 않는 분야였고 연구소 내부에 computing center 를 더이상 운용하고 싶어했지 않았다.
	- 따라서 이런 장비를 구입하는 것은 연구소가 보기에 Multics 와 같은 또 다른 실패작을 만들어 낼 것이라고 생각했고 성공적인 무언가를 만들어낸다 하더라도 computing center 를 계속 운용해야 했기에 부담이 있었을 것이라고 했다.
- 그럼에도 불구하고 1969년에는 여러 기술적인 진보가 있었는데..
	- UNIX 파일시스템의 기본적인 설계를 스케치 했었고
	- 스케치한 파일시스템의 성능을 시뮬레이션하기도 했으며
	- GE645 를 위한 새로운 운영체제를 기초적인 부분까지 완성했었다고 한다.
		- 웰컴메세지를 출력하는 기능까지 개발이 되었으나, GE645 의 수명이 몇달 안남았다고 결론이 났기에 여기까지만 하고 중단되었다.
- 또한 1969년에 사용자가 우주선을 태양계의 이곳 저곳으로 움직이며 플레이하는 Space Travel 이란 게임을 만들었다.
	- 처음에는 Fortran 언어를 사용해 [GECOS](https://en.wikipedia.org/wiki/General_Comprehensive_Operating_System) (GE635 에서 사용하는 운영체제) 에서 작동하도록 개발되었으나
	- 조작이 불편했고 GE635 를 사용할 경우 시간당 $75 의 금액이 부과되었기에 [PDP-7](https://en.wikipedia.org/wiki/PDP-7) 머신으로 갈아타게 되었다.
	- PDP-7 용의 버전은 기존의 GECOS 용 버전에서 플로팅 포인트 사칙연산 패키지나 디버깅 시스템 등 많은 부분을 개선했다고 한다.
	- 개발은 GECOS 에서 PDP-7 용으로 cross-assembly 하는 방식으로 진행됐다고 한다.
- Space Travel 은 단순한 게임일 뿐이었지만, PDP-7 용 운영체제를 위한 많은 개념들을 제시해 주었다고 한다.
	- 이전에 스케치한 파일시스템을 실제로 구현했고
	- 파일시스템이 실제로 실행될 수 있도록 프로세스의 개념을 추가했으며
	- 복사 붙여넣기, 쉘 등의 사용자를 위한 유틸리티들이 추가되었다.
- 여기까지 온 뒤에는 더이상 GECOS 에서 cross-assembly 하기 보다는 PDP-7 에서 직접 assembly 하는 것이 가능해졌고, 이후에 [Brian Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan) 이 "UNIX" 란 이름을 붙이며 우리에게 널리 알려진 UNIX 운영체제가 탄생하게 되었다.

## PDP-7 UNIX File System

### 현재 UNIX File System 과의 공통점과 차이점

- 구조적으로 볼때, PDP-7 UNIX File System 은 지금의 파일시스템과 거의 동일하다:
	- 파일시스템은 *i-node* 로 구성된 배열인 *i-list* 자료구조 형태이다:
		- 파일의 권한, 사이즈, 디스크에의 저장 위치 (list of physical blocks) 의 정보를 담은 *i-node*
		- i-node 들의 배열인 *i-list*
	- 그리고 파일은 일반적인 텍스트 파일 이외에도 다음의 두 종류의 파일이 더 존재한다:
		- 파일들의 *i-number* (i-node 의 ID) 와 파일들의 이름을 저장하고 있는 특별한 파일인 *directory*
		- Device 를 대변하는 특별한 파일
			- 이것은 특정 i-number 는 특정 device 를 의미하는 것으로 구현되어 있다
			- 약간 fd/0 이 stdin 인 것과 유사한 느낌인듯
	- Read, Write, Open, Create 와 같은 Syscall 도 PDP-7 에도 마찬가지로 구현되어 있었다.
- 지금의 파일시스템과 다른점은 아래와 같다:
	- PDP-7 은 word-addressed machine 이기에 (이 말인 즉슨, 모든 instruction 이 고정된 크기를 가진다는 소리이다. 이 고정크기의 단위로 *word* 란 표현을 쓰는 것) IO 의 단위도 byte 가 아니라 word 이다.
	- Erase 와 Kill 기능이 터미널에 없다고 한다. Erase 는 파일을 지우는 것 일거 같은데 Kill 은 모르겠네
	- 또한 path name 이 없었다고 한다. (!!)
		- 모든 파일은 "`/`" 없이 현재 디렉토리를 기준으로 한 상대 위치를 통해 접근할 수 있다고 한다.

### 현재 디렉토리 바꾸기 (`chdir`)

- 그럼 다른 디렉토리의 파일은 어떻게 접근하냐: `dd` 라는 특별한 디렉토리를 통해 접근할 수 있다.
	- `dd` 에는 각 사용자들이 사용하는 디렉토리들이 모여있다: 약간 지금의 `/home` 과 비슷한 놈이라고 생각해도 될 것 같다.
	- 따라서 만약 kim 사용자의 디렉토리로 현재 디렉토리를 변경하고 싶다면, 다음과 같이 하면 된다.

```
chdir dd kim
```

- 당시의 `chdir` 는 지금의 `chdir` 와는 좀 다르다: 이 명령어는 인자를 여러개 받을 수 있고, 명시한 순서대로 디렉토리에 접근하게 된다.
	- 즉, 위의 명령어는 지금의 chdir 로 따지면 아래와 같다.

```
chdir dd
chdir kim
```

### Link (Symlink)

- Link 기능도 초기 UNIX 에 포함되어 있었다고 한다. 문법은 다음과 같다:
	- `dir` 은 현재 디렉토리 내의 디렉토리 이름
	- `file` 은 `dir` 디렉토리 내의 파일
	- `newname` 은 현재 디렉토리에 생성할 link 파일의 이름

```
link(dir, file, newname)
```

- 현재의 UNIX 에는 directory 를 link 하는 것은 금지되어 있었지만, 초기에는 가능했다고 한다.
- 위의 `dd` 를 이용해 좀 복잡한 사용 예시를 들어보면, kim 이란 사용자의 디렉토리 내의 파일 x 를 현재 디렉토리에 link 거는 것은 다음처럼 할 수 있다:

```
ln dd kim kim
ln kim x x
rm kim
```

### 단점들

- 상상이 잘 안되겠지만, directory 와 device 는 disk 가 재생성될 때에만 생성될 수 있다고 한다.
	- 따라서 subdirectory 는 실생활에서는 거의 사용되지 않았으며
	- Device 를 추가하는 것 또한 매우 힘든 작업이었고
	- Removable disk pack (USB 같은?) 것은 꿈도 못꾸는 것이었다고 한다.
- 초기의 UNIX 은 현재의 UNIX 시스템에 비하면 당연히 아주 단순화된 모습이었다.
	- 그의 일례로, Multi-programming 을 지원하지 않았기에 디스크에서 데이터를 읽어올 때에는 다른 작업이 불가능 했다.
		- 사용자에게로 control 이 전환되지 않는 것은 물론이고, 시스템 코드도 작동하지 않았다고 한다.
		- 지금의 버퍼링 시스템의 전신이 구현돼 있긴 했지만, Disk IO 와 CPU 연산 작업이 동시에 이루어지지는 않았다고 한다..

## Process Control

### 초기와 현대의 UNIX Process Control 방식 차이

- File system 의 경우에는 핵심적인 구조는 이전이나 지금이나 크게 바뀌지 않았지만, Process control 의 경우에는 많은 것이 바뀌었다.
- 지금의 UNIX 운영체제는 다음과 같이 프로세스들을 실행한다:
	1. Shell 은 terminal 로부터 command line 을 파일로 읽어들인다.
	2. Shell 이 *fork* 을 해 *child process* 를 만든다.
	3. Child process 는 파일에 있던 command 를 *exec* 한다.
	4. 그동안은 *parent process* (shell) 은 child process 가 *exit* 을 하여 종료될 때까지 *wait* 한다.
	5. 1번 과정을 반복한다.
- 하지만 초기의 UNIX 운영체제에는 Process 의 개념은 있었지만 *fork*, *wait*, *exec* 은 없었고 *exit* 도 지금과는 살짝 달랐다.
- 초기의 UNIX 운영체제는 다음과 같이 작동하였다.
	1. Shell 은 기존에 open 되어 있던 파일들을 전부 close 하고, stdin 과 stdout 두개의 파일을 연다.
	2. Shell 은 terminal 로부터 command line 을 파일로 읽어들인다.
	3. Shell 은 command 파일을 열고, 메모리 상단에 자그마한 *bootstrap program* 을 적재한 후, bootstrap program 으로 점프한다. 이 boottrap program 은 command 파일의 내용을 shell code 위에 overwrite 하고, 그쪽으로 jump 를 해 command 를 실행한다.
	4. Command 가 완료된 다음 exit 을 호출하면, os 가 command code 위에 새로운 shell code 를 overwrite 하고, 실행시킨다.
- 위의 초기 UNIX 구현에서 짚고 넘어가야 할 것은 추후에 추가되어야 할 기능들이 어느정도 예측되어서 구현에 반영되었다는 것이다.
	- 백그라운드 프로세스나 파이프 등이 구현되어 있지는 않았지만,
	- IO redirection 은 stdout 과 stdin 을 그냥 다른 파일로 대체하면 된다는 점에서 어렵지 않게 구현될 수 있었고
	- Shell 을 kernel 의 일부가 아닌 user level program 으로 구현하는 것도 가능하게 했다.
- 따라서 parent/child process 같은 개념이 없었기 때문에, terminal 당 process 는 1개였다.
	- 그리고 초기의 UNIX 는 terminal 을 2개 지원했기에, 총 두개의 프로세스가 작동된다고 할 수 있다.
	- 이것은 UNIX 이전의 Multics 나 [CTSS](https://en.wikipedia.org/wiki/Compatible_Time-Sharing_System) 같은 운영체제의 영향을 받은 것이었다.
- Terminal 당 process 가 하나인 것은 여러모로 문제를 일으켰다.
	- Shell 이 매번 실행될 때마다 모든 파일을 닫았기에, stdin 과 stdout 은 매번 다시 열어줘야 했다.
	- 매번 fresh shell process 가 실행되었기에, command 실행 간에 메모리 상태를 유지하는 것도 불가능 했다.
	- 또한 각 디렉토리에 *tty* 라는 특별한 파일을 가지는 것이 요구되었다.
		- 이 파일은 디렉토리를 연 터미널을 참조하도록 되어 있고 만일 이 파일이 없다면 shell 은 무한루프에 빠지게 된다... 왜그런지는 모르겠다.

### 초기 UNIX 에서의 개선 과정

#### `fork` 와 `exec` 구현하기

- 놀라운 점은 기존의 Process control 지금의 그것 (fork 를 활용하는) 것으로 개선하는 것은 설계와 구현까지 단 며칠밖에 걸리지 않았다는 점이다.
- 이것은 아래의 세가지 사실을 적절히 활용한 것이라 생각할 수 있을 것이다:
	1. 앞에서도 언급했다시피, 하나의 process 에서 code 만 바꿔 프로그램을 exec 하는 것은 당시에는 흔한 방법이었다.
	2. Thompson 은 이미 기존의 [Berkeley Time-sharing System](https://en.wikipedia.org/wiki/Berkeley_Timesharing_System) 에서 fork 와 exec 을 분리하여 프로세스를 관리한다는 것을 잘 알고 있었다.
	3. 기존의 UNIX 에서는 이미 두개의 터미널에서 각각 프로세스를 돌리고 있었기 때문에 프로세스를 여러개 돌리는 것에 대비가 되어 있었던 상황이었다.
- 따라서 이것은 이렇게 활용될 수 있었다:
	- (2) 번을 이용해 Process 관리에 fork 와 exec 을 분리하는 아이디어를 얻고
	- (3) 번에서 2개의 프로세스를 실행시키는 것을 그보다 더 많은 프로세스를 실행시키는 것으로 확장하여 fork 를 구현했으며
	- fork 를 통해 parent process 와 동일한 process 를 생성한 뒤에 (1) 번에서 했던 것처럼 code 만 바꿔 프로그램을 실행하는 식으로 exec 을 구현했다.
	- 즉, fork 를 구현할 때에는 다음의 두 가지만 요구되었었다.
		1. 기존의 Process table 을 확장하고
		2. 기존의 swap IO 방식 (두 개의 process 를 와리가리하기 위해 swapping 하던 것) 을 그대로 사용해 현재의 process 를 disk swap area 에 복사하고 process table 을 수정하는 방식으로 fork 함수를 구현하는 것
- 위와 같은 방법으로 단 27줄의 assembly code 만을 추가해 fork-exec 기능을 구현해 냈다.

#### `exit` 구현하기

- 이전에는 새 shell code 를 현재 process code 에 overwrite 하는 방식이었다면,
- 새로운 exit 을 구현하는 것은 보다 더 단순했다:
	- 그냥 Process table entry 를 비워버리고,
	- CPU 점유를 포기해 버리면 되었기 때문

#### `wait` 구현하기

- 초기 UNIX 에는 다음의 두 함수가 있었다:
	- `smes(pid, message)`: 이것은 특정 `pid` 에 `message` 를 보내고 수신자가 메세지를 읽을 때까지 기다린다.
	- `(pid, message) = rmes()`: 메세지가 올때가지 기다리고, 메세지가 오면 해당 메세지의 송신자 (`pid`) 와 내용 (`message`) 를 반환한다.
- 따라서 `smes` 을 이용하면 wait 은 다음과 같은 방식으로 구현될 수 있었다:
	1. Parent process 가 child process 를 fork 한다.
	2. Parent process 에서 실행한 fork 함수는 child process 의 pid 를 반환하고, parent process 는 이 pid 와 `smes` 를 이용해 child process 에게 메세지를 보낸다.
	3. Child process 는 이 메세지를 읽지 않고 command 를 실행한 뒤, 종료된다.
	4. 그럼 parent process 의 입장에서는 child process 가 실행되던 중에는 계속 대기하다가, child process 가 종료되면 process 를 찾을 수 없다는 에러를 반환한다.
	5. Parent process 가 기다리게 하기 위해 child process 에서 의도적으로 메세지를 읽지 않은 것이기 때문에, 위의 에러는 무시한다.
- `rmes` 를 이용하면 init process 의 wait 과정도 구현할 수 있다:
	1. Init process 는 터미널 당 두개의 shell process 를 생성한다.
	2. 그리고 `rmes` 를 걸어 놓는다.
	3. 각 shell 은 명령어 file 을 실행한 뒤에, init process 에게 `I am terminating` 이라는 메세지를 `smes` 로 보낸다.
		- Init process 의 pid 는 무조건 `1` 이기 때문에, shell 은 init process 의 pid 를 알아내야할 필요가 없다.
	4. Init process 는 메세지를 받은 후 대기가 풀리고, 다시 해당 터미널에 대해 shell 프로세스를 실행하고 2번 과정을 반복한다.
- `smes` 와 `rmes` 가 더 범용적인 기능을 제공하기는 하지만, 지금은 wait 만 있고 이 두 기능은 사라졌다.
	- 왜냐면 `smes` 와 `rmes` 가 이 wait 기능을 구현하는 것 이외에로는 사용되지 않았기에, 덜 범용적이지만 목적이 확실한 wait 로 인터페이스를 축소시키는 것이 좋았고
		- 아마 wait 을 구현하는 데에는 사용되지만 process 에서 `smes`, `rmes` 를 syscall 같은 것으로 호출하지는 못한다 정도의 의미인 것 같다.
	- Shell 이 smes 로 child process 를 기다리고 있었는데, child process 에서 어떤 이유로든 rmes 를 사용하면 smes 로 보낸 메세지가 읽히기 때문에 shell 이 다른 command 를 읽어 들여 child process 가 비정상적으로 종료되는 문제가 있기 때문이다.
- 이런 wait 구현 방식은 background process 등의 기능도 아주 손쉽게 구현할 수 있도록 해주었다고 한다.

### Aftereffects: 구현 이후의 부작용들

#### `chdir` 문제

- Process control 방식을 바꾼 뒤 발견한 첫번째 문제는 `chdir` 명령어를 실행해도 현재 디렉토리가 바뀌지 않는다는 것이었다.
- 이것은 좀만 생각해 보면 당연한 일이다:
	- `chdir` 을 실행할 때 child process 가 fork 될 것이고
	- 해당 프로세스는 현재 문맥에서 디렉토리를 변경하기 때문에
	- `chdir` 을 실행한 parent process 에서는 디렉토리가 변경되지 않는다.
- 따라서 이와 비슷한 현상을 보이는 명령어들은 새로운 프로세스가 fork 되지 않고 shell 내부에서 처리되도록 변경되었다고 한다.

#### I/O redirection 문제

- 두번째로 발견한 문제는, 여러개의 command 들을 파일에 작성해서 실행시키고, 그 결과를 redirect 할 때 stdout 이 씹히는 것이었다.
- 가령, 다음과 같은 script (파일 이름: `comfile`) 를 작성했다고 해보자.

```bash
ls
who
```

- 이때, 다음과 같이 실행할 경우 `ls` 의 결과가 `output` 파일에 저장되지 않는 문제가 있었다.

```bash
sh comfile > output
```

- 문제의 원인은 파일을 열었을 때 파일에 대한 read/write pointer 가 파일을 연 프로세스에 귀속된다는 것이었다.
- 문제의 원인은 다음과 같았다:
	1. 메인 shell 은 child process (1) 을 생성한다.
		- Child process (1) 은 `comfile` 이 실행되는 shell process 이다.
	2. Child process (1) 는 stdout 을 리다이렉트하기 위해 `outfile` 을 open 한다.
		- 즉, `outfile` 에 대한 r/w pointer 는 child process (1) 에 귀속된다.
	3. Child process (1) 은 새로운 child process (2) 를 fork 한다.
		- Child process (2) 는 `ls` process 이다.
	4. Child process (2) 는 child process (1) 로 부터 r/w pointer 를 상속받아 `outfile` 에 결과를 입력한 뒤, 종료된다.
	5. Child process (1) 은 새로운 child process (3) 을 fork 한다.
		- Child process (3) 은 `who` process 이다.
	6. 마찬가지로 child process (3) 도 child process (1) 로 부터 r/w pointer 를 상속받아 `outfile` 에 결과를 입력해야 하는데 이런 시상에! child process (3) 의 결과는 child process (2) 의 결과를 덮어쓰게 된다.
		- 이것은 child process (2) 가 `outfile` 에 입력하며 write pointer 를 옮겼지만, child process (1) 한테는 반영이 안되기 때문에, child process (3) 은 옮겨지지 않은 write pointer 를 상속받았기 때문이다.
- 따라서 위와 같은 문제를 해결하기 위해 r/w pointer 를 파일을 open 한 프로세스에 귀속시키지 않고 system level 에서 관리하기 위해 IO pointer 들을 담은 system table 을 추가했다고 한다.

## I/O Redirection

- `>` 와 `<` 를 사용한 I/O redirection 은 초기에는 UNIX 에 존재하지 않았지만, 머지않아 개발되었다고 한다.
- 일단 I/O redirection 의 아이디어는 Multics 에서 가져온 것이다.
	- Multics 에서는 named I/O redirection 을 지원하는 더 범용적인 기능이 있었다고 한다.
- 간단히 UNIX 와 Multics 에서의 I/O redirection 방식을 비교해 보자면,
- UNIX 에서 다음과 같은 명령어가

```bash
ls > xx
```

- Multics 에서는 다음과 같이 사용했어야 했다.

```bash
iocall attach user_output file xx
list
iocall attach user_output syn user_i/o
```

- 논문에서는 간단하게 이놈과 관련된 썰을 하나 풀고 간다:
- Multics 에서는 이 `iocall` 이 자주 사용되었음에도 불구하고, 이 기능을 shell 에 통합시킬 생각을 아무도 하지 못했다고 한다.
	- 왜냐면 Multics 의 IO system 은 Bell Labs 에서 만들었고, Shell 은 MIT 에서 만들었기 때문.
	- 코드의 주인이 저자가 아니었기 때문에 저자는 이것을 shell 에 통합시킬 생각을 못했고, MIT 에서는 이 기능을 많이 사용하는지 알지 못했기 때문에 shell 에 이러한 기능이 통합되지 않았다고 하더라.
- 근데 UNIX 의 IO system 과 shell 모두 Thompson 의 손바닥 안이었기 때문에, UNIX 에서는 이 기능이 shell 에 아주 사용하기 편한 방식으로 제공되게 되었다.

## The advent of the PDP-11, and the first PDP-11 system

- 1970 년이 되자 PDP-7 UNIX 는 대체제가 없긴 했지만 PDP-7 머신이 점점 낡아져 감에 따라 저자는 새로은 PDP-11 을 사달라고 졸랐다고 한다.
- 이번의 조름은 이전의 징징보다 두가지 관점에서 달랐다고 한다.
	- 일단 PDP-11 은 이전에 사달라고 했던 것보다 가격이 훨씬 저렴했다.
	- 또한 장비의 구매 목적을 그냥 알수 없는 OS 개발이 아닌 워드프로세서 개발로 특정했다.
- 처음에는 연구소에서 탐탁치 않게 여겼지만, 결국에는 구매하게 되어 1971년 5월에 입고되게 된다.
	- 다만, 너무 최신의 컴퓨터라 이에 맞는 디스크가 시장에 존재하지 않았고, 저자와 친구들은 12월까지 기다려야 했다고 한다.
- PDP-11 에서 처음에 새로운 UNIX 를 실행했을 때에는 첫번째 버전과 성능 차이가 별로 나지 않았다고 한다.
- 하지만 파일의 full path name 을 표시하고, 새로운 방식의 exec 과 wait 이 들어갔으며, 텍스트 출력 면에서 여러가지 개선이 이루어 졌고
- 결과적으로는 미 특허청에 납품되어 성공을 이루게 되었다는 감동실화

## Pipes

### 초기 구상

- Pipeline 은 coroutine 의 특별한 형태일 뿐, UNIX 에서 처음으로 도입한 것은 아니었다.
	- [Dartmouth Time-sharing System](https://en.wikipedia.org/wiki/Dartmouth_Time_Sharing_System) 에서도 "Communication Files" 이란 이름으로 지금의 UNIX pipe 와 거의 유사한 기능을 제공해 주긴 했다.
	- 다만 이것을 제대로 제공해 주지는 못했고, 따라서 UNIX 에서 `|` 의 문법을 이용한 간편한 사용법으로 널리 알려지게 된듯
- Pipe 는 [매클로이 아저씨](https://en.wikipedia.org/wiki/Douglas_McIlroy) 의 아이디어었는데, 그는 명령어가 마치 이항연산자처럼 명령어의 input 이 왼쪽에 output 이 오른쪽에 들어가야 한다고 제안했다고 한다.
- 즉, 어떤 `input` 을 정렬 (`sort`) 한다음, 페이지를 매기고 (paginate - `pr`), 프린트를 하는 것 (offline-print - `opr`) 은 다음과 같이 쓸 수 있을 것이다.

```bash
input sort pr opr
```

- 위는 지금의 UNIX 표현으로 하자면 다음과 같다:

```bash
sort input | pr | opr
```

- 이 아이디어는 좋았지만 바로 구현에 들어가지는 못했다고 한다:
	- `command input output` 의 형태 (마치 `cp x y` 처럼) 에 너무 익숙해져 있었고
	- 이게 command arg 인지 input 혹은 output 인지 구분하는 게 힘들었기 때문
- 하지만 시간이 좀 흐른 후, 매클로이 아저씨가 이것을 구현하여 UNIX 에 포함시키게 되었다.
- 처음의 pipeline 은 지금의 `|` 가 아닌 I/O redirect 와 동일한 `>` 를 사용했다고 한다.
- 즉, 위의 예시는 다음처럼 표현되게 된다:

```bash
sort input >pr>opr>
```

- 따라서 위와 같은 구현에서는, `>` 가 두가지의 역할을 하게 된다:
	1. 명령어의 stdout 을 `>` 뒤에 나오는 파일로 redirect 하거나,
	2. 명령어의 stdout 을 `>` 뒤에 나오는 command 로 pipe 하거나.
- 위 구문에서 맨 마지막에 `>` 가 붙는지 의아할 수 있는데, 이것은 `opr` 이 명령어임을 나타낸다.
	- 즉, `opr` 뒤에 `>` 를 붙이지 않았다면, `pr` 의 stdout 이 "`opr`" 란 이름의 파일에 저장될 것이기 때문.

### 개선 1 - Quote 활용

- 이러한 용법이 나온 이후에, 여러가지 개선이 이루어 졌는데, 이루어진 첫번째 개선은 whitespace 에 관한 것이었다.
	- `>` 뒤에서는 whitespace 를 기준으로 command string 으로 잘라 처리하게 되는데, command arg 또한 whitespace 를 이용해 구분짓기 때문에, 혼동이 오는 것.
- 가령 위의 예시에서 `pr` 명령어에 `-2` 옵션을 주고자 아래와 같이 사용하면:

```bash
sort input >pr -2>opr>
```

- `-2` 를 명령어로 인식해 이러한 명령어는 없다고 징징댈 것이다.
- 이를 개선하기 위해, 이런 경우에는 큰따옴표를 이용해 하나의 명령어로 인식하도록 했다.
	- 즉, 아래와 같이 하면 정상적으로 작동하게 된다.

```bash
sort input >"pr -2">opr>
```

### 개선 2 - `>` 뿐 아니라 `<` 도 지원하기

- 조금 더 문법을 확장하고자, 왼쪽에서 오른쪽으로 진행해 가는 `>` 에 추가적으로 반대방향인 `<` 도 추가되었다.
- 즉, 위에서의 예시는 다음과 같이 표현할 수도 있었다:

```bash
 opr <"pr -2"<"sort input"<
```

- `"sort input"` 뒤에 `<` 이 붙는 것도 해당 문자열을 파일이 아닌 명령어로 받아들이게 하기 위함이다.
- `>` 와 `<` 를 섞어 사용하면 아래와 같이 사용하는 것도 가능하다:

```bash
pr <"sort input"< >opr>
```

- 이것은 차근차근 읽어보면 다음과 같다:
	- `sort input` 의 결과를 (`"sort input"<`)
	- `pr` 로 보내고, (`pr <"sort input"<`)
	- 또 그 결과를 `opr` 로 보낸 뒤 그 결과는 그냥 stdout 으로 보내는 것 (`pr <"sort input"< >opr>`)

### 개선 3 - `|` 이용하기

- 위와 같은 `>`, `<` 식의 표현은 얼마 간은 지속됐지만 결국에는 현재의 `|` 방식으로 굳어졌다고 한다.
- 물론 `|` 를 사용하는 방식이 문제가 없는 것은 아니다.
	- 가령 여러개의 stream 에서 input 을 받으려고 할 때는, stdout-stdin 을 다이렉트로 연결짓는 `|` 방식으로는 불가능하기 때문.

### Multics 의 redirection 과의 차이점은?

- Multics 에서도 IO stream 을 process 로 전달하는 redirection 이 가능했기에, UNIX pipe 가 이것의 개선버전이라고 생각할 수 있지만,
- 저자는 그렇게 생각하지 않는다고 한다:
	- Multics 에서의 IO stream 은 program 이 IO stream 을 지원하기 위한 방식으로만 코드가 작성되어야 하지만
	- UNIX pipe 는 stdin 과 stdout 을 이용하기에 코드에 큰 변화를 주지 않아도 된다는 의미인듯

## High-level languages

### B Programming Language

- 처음의 PDP-7 에서의 UNIX 는 날것의 assembly 언어로 되어 있었다고 한다.
- 그러다가 나중에는 매클로이 아저씨가 [TMG](https://en.wikipedia.org/wiki/TMG_(language)) 라는 컴파일러를 UNIX 에서 작동하도록 만들었는데
- 똠쓴씨가 Fortran 을 TMG 로 컴파일하도록 일주일정도 노력했지만 결과적으로는 이것은 B 언어의 탄생으로 이어졌다.
	- B 언어는 인터프리팅 방식이어서 다소 느리긴 했지만, 그래도 개발이 더 편해졌다고 하더라
	- 또한 syscall 을 호출하는 인터페이스도 추가돼서 system programming 도 가능해 졌다 하더라
- 추후에는 PDP-7 에서 PDP-11 을 개발하기 위한 cross-compiler 도 B 로 개발되었고 TMG 를 대체할 PDP-7 에서의 B compiler 도 B 로 개발되었다.

### C Programming Language

- 하지만 PDP-11 UNIX 혹은 유틸리티들을 B 로 작성하는 것은 고려되긴 했지만 실제로 수행되지는 않았다.
	- 왜냐면 B 는 인터프리팅 언어이기에 다소 느렸기 때문.
- 따라서 이러한 문제를 해결하기 위해 C 언어가 개발되었다.
- 1973년에 이르러서는 UNIX 의 커널도 C로 다시 개발되며 현대적인 형태를 갖추게 되었다.
	- Multi-programming 도 도입되었고
	- 내부 시스템의 구조도 더 다듬어졌다고 한다.
- 현재에는 assembler 이외에는 UNIX 의 커널 및 유틸리티 거의 전부가 C 로 개발되어 있다고 한다.