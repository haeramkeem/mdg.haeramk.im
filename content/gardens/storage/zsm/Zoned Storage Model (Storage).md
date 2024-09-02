---
tags:
  - terms
  - storage
date: 2024-05-26
---
> [!info]- 참고 한 것들
> - [ZNS: Avoiding the Block Interface Tax for Flash-based SSDs (ATC '21) 섹션 2.3 내용](https://www.usenix.org/system/files/atc21-bjorling.pdf)
> - [Zoned Storage Initiative 문서](https://zonedstorage.io/docs/introduction/zoned-storage)

## 이건 뭔가

- 이것은 다음과 같은 특성을 가지는 디바이스 (대표적으로 [[Multi-stream SSD (Storage)|SSD]] 와 [[Shingled Magnetic Recording HDD, SMR HDD (Storage)|SMR HDD]] 가 있다.) 를 위한 표준이다.
	- Random read 가능
	- In-place update 불가능; Read-modify-write 방식으로 데이터 수정
- 이러한 디바이스들은 기존의 [[Conventional Magnetic Recording, CMR HDD (Storage)|HDD]] 와는 근본적인 작동 방식이 다르기 때문에, backward-compatibility 를 어느정도 포기하고 대신 다음과 같은 이점을 가져왔다고 한다:
	- [[Write Amplification, WA and Write Amplication Factor, WAF (Storage)|WAF]] 감소
	- 예측가능한 성능
- 얘는 인터페이스별로 다음과 같이 구현되었다:
	- [[Parallel ATA, AT Attachment, Integrated Drive Electronics, PATA, ATA, IDE (Storage)|SATA]] 를 위한 [[Zoned Device ATA Command Set, ZAC (Storage)|ZAC]]
	- [[Small Computer Systems Interface, SCSI (Storage)|SAS]] 위한 [[Zoned Block Commands, ZBC (Storage)|ZBC]]
	- [[Non-Volatile Memory Express, NVMe (NVMe)|NVMe]] 를 위한 [[Zoned Namespaces, ZNS (Storage)|ZNS]]

## 구조, 작동 원리

### Zone, Sequential Write Constraint

- 이 모델에서는 [[Logical Block Addressing, LBA (Storage)|LBA]] 공간을 동일한 크기의 *Zone* 이라는 것으로 나눈다.
- Zone 은 다음과 같은 특성을 가진다. - 이것을 *Sequential Write Contstraint* 라고 한다.
	- Random read 가능
	- Sequential write 만 가능
	- 용량이 다 차서 새로 write 하기 위해서는, zone 전체에 대해 명시적으로 reset 을 수행
- Zone 의 이러한 특성은 State machine 과 Write pointer 로 작동 방식이 구현된다.

### State Machine

- Zone 의 State machine 은 다음과 같이 상태가 전이된다:

![[Pasted image 20240322112327.png]]
> 출처: 주인장 그림솜씨

- 처음에는 *EMPTY* 상태이고, zone 에 write 하거나 명시적으로  `OPEN ZONE` 명령어를 사용하면 *OPEN* 상태가 되며 zone 이 다 차거나 명시적으로 `FINISH ZONE` 명령어를 사용하면 *FULL* 상태가 된다.
- Device 는 *OPEN* 상태의 zone 개수에 제한을 걸어둘 수 있다. ([[#Zone Limits]] 섹션 참고)
	- 만약 이 개수 제한에 미치지 않았을 때에는, 추가적인 zone 을 맘대로 *OPEN* 상태로 바꿀 수 있다.
	- 하지만 이 개수 제한에 걸리게 되면, 어떤 *OPEN* zone 은 *CLOSE* 상태로 바꿔야만 다른 zone 을 *OPEN* 할 수 있다.
		- 이것은 `CLOSE ZONE` 명령어를 사용하면 된다.
		- zone 을 *CLOSE* 하게 되면, write buffer 와 같은 자원들을 정리하게 되고 다시 *OPEN* 되기 전까지는 write 할 수 없다.
- *OPEN*, *CLOSE*, *FULL* 상태에서는 reset (`RESET ZONE WRITE POINTER` 명령어) 을 통해 다시 *EMPTY* 로 바꿀 수 있다.
- 즉, 상태들은 다음과 같이 표로 정리해볼 수 있다:

| STATE   | DESCRIPTION                                               |
| ------- | --------------------------------------------------------- |
| *EMPTY* | 초기 상태                                                     |
| *OPEN*  | 데이터를 write 할 수 있는 상태 (자원 할당)                              |
| *CLOSE* | 데이터를 write 할 수는 없지만, OPEN 상태로 바꾸면 write 할 수 있는 상태 (자원 반환) |
| *FULL*  | Zone 의 용량이 다 차서 더 이상 write 하지 못하는 상태                      |

- 또한 Command 들을 표로 정리하면 다음과 같다:

| OPERATION                  | DESCRIPTION                                |
| -------------------------- | ------------------------------------------ |
| `OPEN ZONE`                | Zone 을 *OPEN* 상태로 바꾸고 자원을 할당함              |
| `CLOSE ZONE`               | Zone 을 *CLOSE* 상태로 바꾸고 자원을 해제함             |
| `FINISH ZONE`              | Zone 을 *FULL* 상태로 바꿈                       |
| `RESET ZONE WRITE POINTER` | Zone 을 *EMPRY* 상태로 바꾸고 zone 의 데이터를 erase 함 |

- 다만 [Official doc 의 State machine](https://zonedstorage.io/docs/introduction/zoned-storage#zone-states-and-state-transitions) 은 위에 설명한 것과 (뼈대는 비슷하지만) 디테일한 부분에서 약간 차이가 있다.
	- `write` 에 의한 *OPEN* zone 과 `open` 에 의한 *OPEN* zone 을 구분짓는다 (*IMPLICIT OPEN*, *EXPLICIT OPEN*)
	- Device 에서 event 를 보내 특정 zone 을 특수한 상태로 바꿀 수 있다:
		- *READ ONLY*: 말그대로 zone 이 읽기만 가능한 상태
			- 그냥 맘대로 바꿀 수 있는 것은 아니고, 보통 문제상황 - SMR HDD 의 write head 가 망가지는 등 - 에서만 이 상태로 바뀐다고 한다.
		- *OFFLINE*: zone 이 망가져서 작동하지 않는 상태
	- 왜인지는 모르겠지만 공식문서에서는 *CLOSE* 상태에서 `write` 를 통해 *FULL* 로 바뀔 수 있다고 되어 있다.

### Write pointer

- Write pointer 는 처음에는 zone LBA 공간의 시작점에서 시작해서
- Write 작업이 이루어짐에 따라 점점 뒤로 밀리다가
- `RESET ZONE WRITE POINTER` 명령어를 사용하면 write pointer 를 zone 의 처음으로 (zone 의 첫 LBA 로) 쭉 땡기고 zone 전체를 erase 한다.
- 만일 write pointer 가 가리키는 위치에 write 를 하지 않거나 *FULL* 상태인 zone 에 write 를 하려할 경우에는 실패한다.

### Zone Size, Zone Capacity

![[Pasted image 20240322115818.png]]
> 출처: [공식문서](https://zonedstorage.io/docs/introduction/zoned-storage#zone-size-and-zone-capacity)

- *Zone Size* 는 말 그대로 Zone 의 크기이다: 전체 LBA 공간을 동일한 개수의 block 으로 나누는 것.
	- *Zone Size* 는 SSD/HDD 제조과정에서 픽스되어서 나오고, 사용자가 임의로 바꿀 수 없다.
- *Zone Capacity* 는 Zone 내에서 실제로 사용할 수 있는 공간이다.
	- 따라서 당연히 *Zone Size* 보다는 작다.
- *Zone Size* 와 *Zone Capacity* 의 사이즈를 다르게 하는것은 Device 에서 바라보는 zone 의 크기는 모든 zone 에 걸쳐 동일하게 유지하되, Host 에서 바라보는 zone 의 크기는 media 의 특성에 맞게 최적화할 수 있게 하기 위함이라 한다...
	- [[Flash Memory, SSD (Storage)|Flash device]] 의 경우에는 이를 통해 erase block 의 사이즈에 맞게 *Zone Capacity* 를 조정할 수 있게 해준다
	- ~~고 하는데 잘 모르겠다 - 어차피 Zone 이 block 의 집합이면 이런 것이 왜 필요한지~~

### Zone Limits

- Write buffer 와 같은 내부 자원들이 한정되어 있어서, 그리고 기타 여러 Device media 들의 특징에 따라 zone 의 개수를 한정해야 할 수도 있다.
	- 이것은 Zone 을 *OPEN*/*CLOSE* 하는 것이 Host 에 의해서 이루어 지기 때문에 더욱이 필요하다.
	- Host 는 위와 같은 Device 측면에서의 제약사항을 알지 못하기 때문에, 무분별하게 zone 을 *OPEN* 할 경우 성능 저하가 발생할 수도 있기 때문.
- 하지만 이 제한은 Read 에는 아무 영향도 주지 않는다. Data read 는 항상 모든 zone 에 대해 가능하다. (뭐 물론 *OFFLINE* 이 아니고 data 가 존재한다는 전제 하에.)

#### Open Zone Limit

- [[#State Machine|여기]] 에서 잠깐 언급한 내용이다: Write buffer 가 모자라거나 Device 의 parallel 능력이 부족한 경우를 위해 Writable zone (= Open zone) 의 개수를 제한하는 것이다.
	- 즉, *EXPLITIT OPEN* zone 개수 + *IMPLICIT OPEN* zone 개수
- 이 한계치에 다다르게 되면 새로운 zone 에 write 하거나 `OPEN ZONE` 명령어를 실행하기 위해서는 어떤 *OPEN* zone 은 그 전에 *CLOSE* 상태가 되어야 하고, 그렇지 않다면 에러가 난다.

#### Active Zones Limit

- Host 가 data 를 write 하려고 할 때, 선택할 수 있는 zone 의 개수를 제한하는 기능이다.
- *OPEN* zone 과 *CLOSE* zone 을 합친 개수를 제한하는 것이다.
	- 뭐 더 정확하게 말하자면 *EXPLICIT OPEN* + *IMPLICIT OPEN* + *CLOSE* zone 개수이다.
	- ~~근데 *EMPTY* 에도 write 할 수 있는데 (물론 이후에 OPEN 으로 변경되지만) *EMPTY* zone 의 개수는 왜 빠지는지 모르겠다.~~
- 이 한계치에 다다르게 되면 어떤 zone 은 `FINISH ZONE` 으로 *FULL* 상태로 만들거나 `RESET ZONE WRITE POINTER` 로 *EMPTY* 상태로 만들어야 한다.
- ~~솔직히 용례가 없어서 이것이 왜 필요한지 감이 안오긴 한다.~~

## Backward-compatibility

- 여기까지 보면 Zoned Storage Model 은 Regular Block Model 을 따르는 기존의 디바이스들과 호환되지 않는 것처럼 보이고, 실제로 호환되지 않는다
- 따라서 이러한 호환성을 위해 몇개의 방안들이 준비되어 있는데, 정리해 보면 아래와 같다.

| MODEL                   | DESCRIPTION                                  | USED ZONE TYPE                      | BACKWARD-COMPATIBILITY |
| ----------------------- | -------------------------------------------- | ----------------------------------- | ---------------------- |
| [[#Host-Managed Model]] | Sequential Write Constraint 가 강제됨            | [[#Sequential-write-required Zone]] | NO                     |
| [[#Host-Aware Model]]   | Sequential Write Constraint 를 선택적으로 이용할 수 있음 | [[#Sequential-write-prefered Zone]] | YES                    |

### Zone Models

- Zoned Storage Model 을 사용하는 방법을 *Model* 이라고 하는데, 두 가지로 나눌 수 있다.

#### Host-Managed Model

- 이것은 Zoned Storage Model 을 Host 에 강제하는 방법이다.
- 따라서 [[#Zone, Sequential Write Constraint|Sequential Write Constraint]] 에 따라 write 작업을 수행하도록 Host level 의 변경이 필요하다.

#### Host-Aware Model

- 이것은 Backward-compatibility 를 위한 방법으로, 약간 하이브리드라고 생각하면 된다.
- 즉, Random write 등의 Regular Block Model 의 기능을 사용할 수 있고
- Sequential Write Constraint 를 위한 Zoned Storage Model Command 들을 사용할 수도 있다.

## Zone Types

- Zone 들은 아래와 같은 타입을 가질 수 있다고 한다.
### Conventional Zone

- 여기는 기존의 Reguar Block Model 처럼 사용할 수 있는 Zone이다.
	- 즉, Sequential Write Constraint 없이, Random Write 밖에 지원되지 않는다는 것.
- 일반적인 용도 (데이터 저장) 보다는 Metadata 저장 등의 용도로 사용한다고 하며, 전체 Device 내에서 아주 작은 부분을 차지한다고 한다.

### Sequential-write-required Zone

- 여기는 Host-Managed Model 을 위한 곳으로, Sequential Write Constriaint 가 빡세게 적용된다.

### Sequential-write-preferred Zone

- 여기는 Host-Aware Model 을 위한 곳이라고 생각하면 된다.
- 즉, Random write 도 되고, Zoned Storage Model command 들도 사용할 수 있는 공간이다.

## Zone Append

### 필요성

- 일반적으로는, host 가 보낸 write command 의 순서와 device 에 도착해서 처리되는 순서는 동일해야 하고, 변경되어서는 안된다.
	- 만일 그렇지 않다면, 데이터가 sequential 하게 저장된 것이 아니기에 sequential write constraint 에 위반되어 에러가 발생한다.
- 하지만 실제로는 이것을 지키는 것이 쉬운 일은 아니다.
	- Host 의 IO stack 이 복잡하기도 하고
	- Storage adapter 혹은 command transport 가 순서를 보장해주지 않을 수도 있기 때문.
- 따라서 이 문제를 해결하기 위해 host 에서 zone 당 한번에 1개의 command 만 실행되게 제한을 걸 수도 있지만, 이렇게 하면 병렬처리가 안되기 때문에 성능이 저하될 수 있다.
- 정리해 보면, 다음과 같은 필요성에 의해 Zone Append 가 나오게 되었다.
	- Write command 순서가 예기치 않게 꼬여도 문제가 생기지 않게 하기 위해
	- Write command 들을 동시에 사용하기 위해
### Zone Append 명령어

- Zone Append 명령어는 한마디로 정리하면 **"host 가 write 명령을 순서에 대한 고려 없이 동시에 device 에게 보낼 수 있게 하는 것"** 이다.
- 구체적인 작동 과정은 다음과 같다:
	1. 이 명령어는 기본적으로는 write 명령어와 동일한데, 다만 저장 위치를 write pointer 의 위치가 아닌 zone 의 첫 LBA 에 write 하라고 지시한다.
	2. Device 에서 이 명령어들을 처리할 때에는, 데이터를 효과적으로 저장할 수 있는 순서로 재배치 하여 write pointer 의 위치부터 데이터를 저장하게 된다.
	3. 처리가 완료된 뒤에는 device 가 host 에게 데이터들이 어떤 순서로 어디에 저장되었는지 host 에게 알려주게 된다.
- 아래의 예시를 참고하면 감이 올 것이니라

### 작동 예시

- 세 데이터를 write 하려 한다고 해보자:
	- W0: A (4K 데이터) write
	- W1: B (8K 데이터) write
	- W2: C (16K 데이터) write
- 그럼 일반적인 write (regular write) 의 경우에는 다음처럼 처리된다.

![[image 6.png]]

1. W0 가 처리되며 A 를 write 하고, WP(Write Pointer) 가 WP0 위치로 움직인다.
2. 이후 W1 가 처리되며 WP0 위치에 B 를 write 하고, WP 가 WP1로 움직인다.
3. 마찬가지로 W2 가 처리되며 WP1 위치에 C 를 write 하고, WP 는 최종적으로 WP2 로 움직인다.

- 하지만 Zone Append 명령어를 사용할 경우, 다음처럼 처리된다.

![[image 7.png]]

1. W0, W1, W2 모두 저장 위치를 zone 시작점으로 하여 명령어가 수신된다.
2. Device 는 나름의 알고리즘에 따라 A -> C -> B 순서로 data 를 write 하기로 결정하고, 해당 순서대로 sequential write 를 수행한다.
3. 작업 수행 뒤 Host 에게 A, B, C 가 어디에 저장되었는지 알리게 된다.

- 위의 두 과정 모두 WP 는 동일한 위치로 옮겨진다 - A, B, C 데이터 크기 총합은 결국에는 동일하기 때문에
- 하지만 regular write 에서는 A, B, C 가 순서대로, 앞선 write 가 종료되어야 다음 write 가 시작되기 때문에 다소 느리지만
- Zone append 에서는 A, B, C 가 동시에 처리되기 때문에 더 빠르게 처리된다.