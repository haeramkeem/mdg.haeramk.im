---
tags:
  - OS
  - 논문
  - SNU_CSE_MS_AOS24S
date: 2024-05-13
---
> [!info] 본 글은 Juan Navarro 의 논문 [Practical, Transparent Operating System Support for Superpages (OSDI'02)](https://www.usenix.org/conference/osdi-02/practical-transparent-operating-system-support-superpages) 를 읽고 정리한 글입니다.

> [!info] 본 글의 사진은 별도의 명시가 없는 한 상기 논문에서 가져왔습니다.

> [!fail] 본 글은 아직 #draft 상태입니다.

## 1. Abstract & Introduction

### TLB, TLB coverage

- 대부분의 운영체제에서는 메모리의 Virtual addr -> Physical addr 전환을 빠르게 하기 위해 [[Translation Lookaside Buffer, TLB (Memory)|TLB]] 라는 캐시를 사용한다.
- 하지만 메모리 사이즈는 나날이 증가하는데, 이 TLB 의 사이즈는 잘 늘어나지 않았다.
	- 왜? 비싸니깐은
- 이러한 간극을 잘 보여줄 수 있는 수치가 *TLB coverage* 이다.
	- TLB 로 접근할 수 있는 메모리 공간을 *TLB coverage* 라고 한다.
		- 간단하게 생각하면 된다; 만약 page 사이즈가 512byte 고 TLB 의 entry 개수가 100 개라면, TLB 를 활용해 접근할 수 있는 메모리 공간의 크기는 $512 * 100$ byte, 즉 50Kb 이다.
	- 당시에는 page 의 사이즈가 작아서 이 TLB coverage 가 메가바이트 단위도 안됐다고 하고, 이것은 당시의 메모리 사이즈를 기준으로 생각해도 현저히 작았다고 한다.
- TLB coverage 가 작다는 것은 TLB 로 빠르게 주소 변환을 해서 접근할 수 있는 공간이 적다는 뜻이고, 반대로 말하면 메모리의 상당 부분에 대해 TLB cache miss 가 나 주소 계산 과정을 수행하는 오버헤드가 추가된다는 의미가 된다.

### Superpage

- 따라서 이와 같은 문제를 해결하기 위해 나온 개념이 *Superpage* 이다.
- 이것은 기존의 page 사이즈보다 더 큰 사이즈를 사용하는 page 를 일컫는다.
	- 즉, 위에서 TLB coverage 를 계산할 때 $pageSize * TLBEntryCount$ 를 했는데
	- $TLBEntryCount$ 를 늘리기에는 아무래도,, 총알이 부족하기 때문에
	- $pageSize$ 를 늘려버린 것.

### Superpage 의 단점, 완화책, 이 완화책의 단점

- 하지만 이런 superpage 를 잘못 사용하면
	- Application footprint [^application-footprint] 가 증가하고
	- 따라서 Physical memory 가 더욱 더 필요해 지며
	- Paging traffic [^paging-traffic] 도 증가한다고 한다.
- 위와 같은 단점은 TLB miss 를 줄이기 위해 기울였던 모든 최적화를 씹어먹을 만큼 치명적이었기 때문에,
- 여러 사이즈의 page 를 제공하는 방향으로도 연구가 수행되었다.
- 하지만 이 방법 또한 문제가 있었는데...
	- 아무래도 page 사이즈가 일정하지 않다 보니
	- 작은 사이즈의 page 가 빠지고 나면 여기에는 이 것보다 더 큰 사이즈의 page 가 들어올 수 없으니 [[External Fragment (OS)|외부 단편화]] 문제가 생기게 되고
	- 결과적으로 큰 사이즈의 page 가 할당될 수 있는 기회를 놓치게 된다.
		- 만약 그 빈공간이 합쳐져 있었으면 superpage 를 할당할 수 있었을 텐데 이놈들이 전부 찢겨져 있기 때문에 superpage 가 할당될 수 없는 흔한 단편화 문제가 발생한다는 것.
- 따라서 많은 OS 에서는 이러한 superpage 기능을 비활성화시켜놓거나 제한적으로만 사용할 수 있도록 해놓은게 대부분이었다고 한다.

## Practical, transparent superpage

- 이 지점이 이 논문이 해결하려고 하는 pain point 이다.
- Superpage 를 사용하는 것과 사용하지 않는 것에 대한 trade-off 의 중간 타협점을 찾아 성능을 올리면서도 pathological situation [^pathological-situation] 에 대한 성능 저하는 최소화시켰다고 한다.
- 간략하게 요약하면 다음과 같다고 한다.
	- 우선 process 에 메모리 공간이 할당되면, 큰 연속된 공간을 같이 예약해 (Reservation) 놓는다.
	- 그리고 process 가 이 공간을 필요로 하게 되면, 증가하는 크기의 superpage 들로 이 연속된 공간을 쪼개어 process 에게 할당한다 [^increasing-size-superpage].
	- 만약 시스템에 메모리가 부족해지면, 이 연속된 공간 중 일부를 뺏게 되고
	- 만약 이 연속된 공간이 전부 빼앗기게 되면, 다른 연속된 공간을 disk 로 내려보내 ([[Page Replacement (Memory)|Page replacement]]) 연속된 공간을 확보한다.
- 뭐 FreeBSD 에서 실험한 결과 좋았다고 한다. 이것은 [[#6. Evaluation|섹션 6]] 에서 자세히 보도록 하자.

### Contribution

- 본 논문은 대략 다음과 같은 contribution 이 있다고 한다.
1. 기존에 제시되었던 Reservation 기반의 superpage 방법을 확장해 여러 사이즈의 superpage 를 제공하고, 추후에도 사이즈를 더 늘릴 수 있는 방법을 제시함
2. ...그리고 이 방법에 대한 장점을 실험으로 보여줌
3. 이런 연속된 메모리 공간에 대한 새로운 Page replacement 알고리즘을 제시함
4. 솔루션을 효율적으로 만들기 위해 그간은 간과되었지만 해결해야 할 문제들 해결

## 2. The superpage problem

- 위에서 설명한 것처럼, 그동안 메인메모리의 사이즈는 지수적으로 증가하는 반면 TLB 의 사이즈는 증가하지 않고 있었다.
- 주인장은 그냥 돈아끼려고 그런 줄 알았는데, 이것에 대해서 논문에서는 다음과 같은 변명을 댄다:
	- TLB cache 는 모든 메모리 접근에 참조되는 요소이기에, fully associative [^tlb-fully-associative] 하고 접근시간이 매우 짧아야 한다. 이 때문에 TLB 사이즈는 작게 유지되어야 한다고 한다. [^tlb-size-lag]
- 그래서 TLB 는 128 entry 정도로 유지되었고 따라서 coverage 는 1 메가바이트 언저리 수준으로 나온다고 한다.
- 이에 관해서는 다음의 그래프를 보면 확연히 알 수 있다.

![[Pasted image 20240513194021.png]]

- 위 그래프가 의미하는 바를 살펴보자.
	- 가로축은 시간 (년), 세로축은 메모리 사이즈 대비 TLB coverage 비율이다.
	- 그리고 년도별로 출시된 workstation 들에 대해 TLB coverage 를 계산하여 그래프로 나타낸 것이 위처럼 나타나는 것이다.
	- 보면 처음에는 10% 에 달했던 것이 '02 년도에 와서는 거진 0.01% 아래로 떨어졌다는 것을 알 수 있다.
	- 즉, 메모리 사이즈는 늘어나지만 TLB 사이즈는 거의 변하지 않아 이런일이 벌어지게 된 것.
- 추가적으로 [[#6.3. Best-case benefits due to superpages|섹션 6.3]] 에서 더 자세히 살펴보겠지만, 이러한 현상은 현대의 대부분 application 들에 대해 성능 저하를 야기한다.
	- Application 이 한번에 접근하는 메모리 공간의 사이즈는 이미 이 TLB coverage 를 초과했고,
	- 따라서 '80 년대에는 4~5%, '90 년대에는 5~10% 정도였던 성능 저하가 현대에 이르러서는 30% 에서 60% 까지 나오기도 한다고 한다.
- 또 다른 성능저하의 원인으로 추가적인 cache 가 보드에 내장되어 출시된다는 점을 짚는다.
	- TLB coverage 보다도 더 큰 cache 가 이미 보드에 장착되어 출시되는데,
	- TLB miss 가 나게 되면 이 cache 에 있는 데이터에 대한 주소를 얻기 위해 메모리에 들러야 하는 상황이 올 수도 있게 된다 [^tlb-miss-expense].
	- 따라서 데이터가 cache 에 이미 있는데도 메모리에 접근하게 되어 이 cache 를 최대로 활용하지 못하는 상황이 된다.
- 따라서 그냥 단순하게 이 page 의 사이즈를 늘려버리면 TLB coverage 가 늘어나 이러한 문제점들이 해결될 것이라 생각할 수 있다.
	- 하지만 이것은 그만큼이나 메모리를 필요로 하지 않는 application 의 경우에는 무히려 [[Internal Fragment (OS)|내부단편화]] 를 늘리는 효과를 가져와 메모리를 비효율적으로 사용하게 만든다.
	- 결과적으로 이것은 메모리 pressure 을 늘려 page replacement 를 더 빈번하게 일어나게 만들어 성능이 안좋아지는 효과를 가져온다.
- 이에 대한 하이브리드 솔루션으로 page 사이즈를 다양하게 사용하는 방법이 제시되는데
	- 근데 이것 또한 문제점이 있다. 이제 이 문제점들에 대해 아라보자.

### 2.2. Hardware-imposed constraints

- TLB 는 기본적으로 HW 이고, 이 HW 의 디테일한 내용은 CPU 종류에 따라 다르다. 따라서 이런 차이점들이 superpage 를 설계하는 데에 제약사항으로 다가오게 된다.
1. 우선, 사용 가능한 superpage 사이즈는 내 맘대로 할 수 있는 것이 아니라 "CPU 에서 어떤 사이즈들을 제공해 주느냐" 에 따라 달렸다
	- 가령, 논문에서 실험에 사용한 Alpha CPU 의 경우에는 base page (가장 작은 page 단위) 가 8KB 이고 64KB, 512KB, 4MB superpage 들을 제공한다.
	- 또한 amd x86_64 의 전신인 i386 의 경우에는 4KB 와 4MB page 를 제공한다.
2. Superpage 는 virtual 뿐 아니라 physical 공간 상에서도 연속된 공간이어야 한다. 즉, 하나의 덩어리어야 한다는 마리야
3. 또한, superpage 의 physical 및 virtual address 시작 주소는 최대 superpage 사이즈의 배수여야 한다.
	- 이게 잘 이해되지 않을 수도 있는데, 이것은 가장 큰 superpage 들이 address space 내에 빈 공간 없이 쓱 들어갈 수 있게 하기 위함이다.
	- 가령, i386 의 경우에는 4MB, 8MB, 12MB 이런식으로 시작 주소가 설정되어야 한다.
	- 만약 superpage 의 시작주소가 1MB 라면, 이 1MB 공간에는 superpage 가 들어가지 못하기 때문에 비기 때문.
4. 마지막으로 TLB 는 각각의 base page 에 대한 metadata [^tlb-metadata] 를 저장하는 것이 아닌 superpage 단위로 이것을 저장한다는 것이다.
	- 이 metadata 에는 reference bit (최근에 참조되었는지 여부 - TLB 에 계속 냅둘 것인지를 결정하는데에 사용된다), dirty bit (주소의 validity 를 나타냄), 그리고 address space protection 을 위한 attribute 들이 포함된다.
	- 이것은 base page 각각에 대한 섬세한 control 이 HW 적으로 불가능하다는 것을 나타낸다.

### 2.3. Issues and trade-offs

- Superpage 를 관리하는 것은 여러 단계로 쪼갤 수 있고, 이 각 단계는 저마다의 issue 와 trade-off 를 가지고 있다. 이들을 하나씩 톺아보자.
- 일단 들어가기에 앞어, *Virtual memory object* 라는 것이 나오는데,
	- 이것은 Virtual memory space 내의 연속된 덩어리로써, application-specific 한 데이터를 담고 있다.
	- ...라고 이해하는 것 보다는 이것의 예시를 보는 것이 더 감이 잘 올 것이다: MMAP 에 사용되는 file, process 의 code, data, stack, heap 등이 각각 하나의 virtual memory object 이다.
- 그리고 이 virtual memory object 에 대한 physical memory page 는 process 가 이 공간에 처음으로 접근했을 때에 할당된다.

#### Allocation

- 처음에 process 가 virtual address page 에 접근하면, 여기에 physical address page frame 이 할당되고, page table 에 이 translation 이 저장된다.
- 여기까지는 좋은데, page 를 superpage 로 바꾸려면 좀 고려할 것이 생긴다.
- 일단 superpage 도 page 이기 때문에 다음과 같은 조건을 만족해야 한다.
	1. *Contiguity constraint*: 연속된 공간 이어야 함
	2. *Alignment constraint*: max superpage size 의 배수의 시작주소 를 가져야 함
- 만일 OS 가 어떤 page 들을 묶어 superpage 로 바꾸고자 한다면, 위와 같은 조건을 맞추기 위해 둘 중 하나의 전략을 취하게 된다.
	1. Relocation-based: 이것은 superpage 로 만드려고 하는 base page 들을 위와 같은 조건을 맞추는 공간으로 복사해 넣는 것이다.
		- 물론 이러한 복사하는 과정이 overhead 로 작용하기 때문에, busy system 에서는 사용하기 힘들다.
	2. Reservation-based: 이것은 위와 같은 조건에 맞는 공간을 미리 예약 (Reserve) 해놓고, 이 예약된 공간 내의 base page 들을 할당해 주는 것이다.
		- 그러고 나중에 이 공간을 superpage 로 변환하고자 할 때에는, (이미 조건이 갖춰져 있기 때문에) 그냥 Page table 이랑 TLB entry 를 바꿔주는 등의 작업만 하면 되는 것.

> [!fail] 중간 생략... #draft 

## 4. Design

### 4.1. Reservation-based allocation

- 기본적인 page frame allocation 의 원리는 다음과 같다:
	- 일단 application 이 어떤 virtual address 공간에 진입했을 때, 해당 공간이 page table 에 없는 경우 (physical memory 공간에 올라오지 않았다는 의미이므로) page fault 가 발생하며 handler 가 작동한다.
	- 이때 해당 공간이 disk 에 swap 된 경우라면 disk 에서 가져오고, 그렇지 않다면 사용할 수 있는 page frame 을 0으로 채워서 할당하게 된다.
	- 그러고 해당 virtual - physical address mapping 을 page table 에 채워넣는 식으로 allocation 이 수행된다.
- 본 시스템에서는 하나의 page frame 을 할당하는 대신, reserve 공간을 생성하여 할당되게 되는데 그 과정은 구체적으로 다음과 같다.
	- 일단 이때의 선호하는 superpage 의 크기가 선택된다.
		- 이 "선호하는 크기" 는 [[#4.2. Preferred superpage size policy|섹션 4.2]] 에서 자세히 설명된다.
	- 그리고 해당 크기 만큼의 공간이 Buddy allocator 에 의해 reserve 된다
		- 이 공간은 당연히 연속된 공간이고 (contiguous constraint) 시작 주소는 fault page 의 address 와 align 되게 된다 [^fault-page-alignment] (alignment constraint).
	- 마지막으로 해당 공간이 reservation list [^reservation-list] 에 들어가고 page table 에 등록되게 된다.
- 이후로는 이 공간에 대한 page fault 가 발생하면, 그냥 할당해주고 page table 에 등록해 주는 것으로 마무리 된다.

### 4.2. Preferred superpage size policy

- 일반적으로 이런 reservation 작업은 process 의 실행 초기에 일어난다고 한다.
	- 뭐 아마 처음에는 아무것도 메모리에 올라와있지 않을 테니 page fault 가 쭉 발생하기 때문이겠지
- 그래서 미래에 어떻게 될 지 알 수 없기 때문에 virtual memory object 의 특성에 따라 superpage size 를 정하게 된다.
- 이 "특성" 이라는 것은 해당 virtual memory object 가 fixed size 인지 dynamic size 인지를 일컫는 것이다.
- 만약에 fixed size 라면 (즉, 뭐 code 나 MMAP file 등 execution time 에 크기가 바뀔 일이 없는 놈)
	- 일단 alignment constraint 를 만족해야 하고
	- fault page 를 포함하는 공간이어야 하며
	- 기존의 reserve 공간을 침해하면 안되고
	- object 사이즈보다 크면 안되는 [^reach-beyond-object-end]
	- 가장 큰 supersize 크기를 선택한다.
- 하지만 dynamic size 라면 (즉, stack 이나 heap 공간)
	- Fixed 일 때의 조건과 동일하나 이것들은 사이즈가 변할 수 있기 때문에 "object 사이즈보다 크면 안된다" 라는 제약조건이 빠지게 된다.
	- 다만, 작은 사이즈의 object 의 경우에는 너무 많은 공간을 reserve 하는 것을 방지하기 위해 해당 object 의 크기로 superpage 의 크기가 제한된다 [^small-objects].
		- 즉, 이러한 사이즈 제한은 이미 큰 사이즈를 차지하고 있는 object 들에게 최대의 reserve 공간을 제공해 주는 것이다.
- 위 내용을 보면 대부분 최대의 reserve 공간을 제공해 준다는 것을 알 수 있는데, 이 시스템의 기본적인 아이디어는 "최대로 준 다음 나중에 빼앗자" 이다.
	- 물론 경우에 따라서 reserve 공간이 부족할 수도 있다. 이때는 reallocation 으로 새로운 reserve 공간으로 page 들을 옮기는 방법으로 해결한다.

> [!fail] 이후 생략... #draft 

### 4.8. Multi-list reservation scheme

## 6. Evaluation

### 6.3. Best-case benefits due to superpages

---
[^application-footprint]: 가 뭔지 모르겠다.
[^paging-traffic]: 도 뭔지 모르겠다.
[^pathological-situation]: 이 뭔지 모르겠다.
[^increasing-size-superpage]: Introduction 만 읽었을 때에는 이 부분이 다소 모호하게 느껴진다. 이 공간을 쪼개어 주는 것인지, 이 공간의 page 를 필요로 한다는 것 (touches pages in this region) 이 무슨 의미인지 명확하지가 않기 때문.
[^tlb-fully-associative]: 가 뭘까?
[^tlb-size-lag]: 물론 빠른 접근 시간을 위해서는 사이즈가 작게 유지되어야 한다는 맞는 말이다. 하지만 기술이 발전하며 접근 시간을 유지하며 사이즈를 늘릴 수 있었을 텐데 그러한 부분은 왜 설명되어 있지 않는지 의문.
[^tlb-miss-expense]: 아마 이 cache 는 physical addr - data 매핑일 것이다. (특정 process 에서만 사용하는 cache 가 아닐 것이기 때문에 당연히 virtual addr 를 사용하지는 못한다.) 따라서 이미 데이터 자체는 cache 에 올라와 있어 빠르게 가져올 수 있지만 physical 주소를 모르는 것 때문에 결국에는 메모리에 접근해야 되는 상황이 되는 것.
[^tlb-metadata]: 공식적인 용어는 아니다. 주인장이 붙인 용어임.
[^fault-page-alignment]: 구체적인 예시가 있어야 좀 더 이해하기 쉬울듯.
[^reservation-list]: 아마 [[#4.8. Multi-list reservation scheme|섹션 4.8]] 에서 말하는 multi list 를 의미할 것이다.
[^reach-beyond-object-end]: 이게 뭔 뜻인지 잘 감이 안온다.
[^small-objects]: 어떤 기준으로 small object 를 나누는지 모르겠다.