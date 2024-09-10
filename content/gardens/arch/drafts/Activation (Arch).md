---
tags:
  - arch
  - story
date: 2024-09-10
aliases:
  - Activation
  - Instance
  - Activation Record
  - Function
---
> [!info]- 참고한 것들
> - [스탠포드 SEE](https://see.stanford.edu/materials/icsppcs107/15-Function-Call-And-Return.pdf)

## Activation = Instance = Function on running

- 우선 함수를 객체지향에서의 비유를 빌려서 설명해 보자면, 함수 (*Function*) 은 template 일 뿐이고, 그것이 호출되면 그때의 실행 흐름은 *Instance* 혹은 *Activation* 이라고 부른다.
- 그럼 이때 함수가 어떤 과정을 거쳐서 실행되고 반환되는지, 즉 *Activation* 의 lifecycle 을 알아보자.

## Activation Lifecycle

> [!tip] Architecture-specific
> - 함수 호출, 종료 과정은 architecture 그리고 compiler 의 종류에 따라 다를 수 있습니다.
> - 여기의 내용은 이것이 정답이라기 보다는 common case 정도로 생각해 주시요.

### Creation

- Activation 이 생성될 때는 다음의 두가지를 고려해야 한다.
	- 일단 activation 에게 어떻게 필요한 정보들을 전달할 것인가? 를 고려해야 하고
		- 즉, 함수 인자 (Parameter) 를 어떻게 전달할 것인가?
	- 그리고 activation 이 종료됐을 때 어디로 돌아와야 하는지 어떻게 명시할까? 도 생각해야 한다.
- 이들을 해결하는 방법은 그 유명한 *Function Call Stack* 이다.
	- 즉, 함수를 호출하고, 그 함수 내에서 또 함수를 호출하고 반환되고, 밥먹고 디저트먹고 하는 이 모든 것이 stack 에서 원소를 빼고 넣고 하는 것과 닮아있기 때문.
- 이 stack 을 이용해 함수를 호출하는 것은 크게 세 단계로 나눌 수 있다.
	1. Parameter 저장
	2. Current context 저장
	3. Local variable 저장

#### 1. Parameter 저장

- 일단 caller 는 parameter 를 stack 에 저장하는데, *Right-to-left* 방식으로 저장한다.
	- 즉, 우리가 함수를 선언할 때는 *left-to-right* 순서로 적는데, 이 순서의 반대로 parameter 가 stack 에 쌓인다는 의미.
	- 다만 이건 C 언어 기준이다. 다른 언어는 그렇지 않을 수도 있음
	- 이건 다양한 이유가 있는데, 그 중 하나는 unknown-parameter 에 접근하기 쉽게 하기 위해서이다. 이와 관련해서는 `printf()` 를 생각해 보면 이해하기 쉽다.
		- `printf()` 에서는 알다시피 첫번째 인자로 format 을 받고, 그 다음에 임의 개수의 format value 들을 받는다.
		- 이때 right-to-left 방식으로 stack 에 쌓게 되면 known-parameter 인 format value 들이 역순으로 쭉 쌓인 뒤 마지막에 unknown-parameter 인 format 이 쌓이게 된다.
			- 여기서 known, unknown 은 쉽게 생각하면 된다. Format value 들은 진짜 "값" 들이고, format 은 이 format value 들을 이용해 완성해야 할 대상이기 때문에, 아직은 unknown 이라고 할 수 있는 것.
		- 그럼 이때 stack pointer (`SP`) 는 format 을 가리키고 있을 것이다. 그럼 stack pointer 가 가리키고 있는 곳에 바로 접근하면 format 을 가져올 수 있기 때문에 추가적인 address calculation 없이도 가능하다.
- 이때는 이 stack 공간에 값들을 "복사" 해놓는다.
	- Parameter mode 와 상관없이 "복사" 된다.
	- 즉, call-by-value 를 위해서는 값 그 자체가 "복사" 되고,
	- Call-by-reference 일 때는 포인터값이 "복사" 되는 것.

> [!tip] Parameter 는 무조건 stack 에 저장될까?
> - 아니다.
> - 생각해 보면 parameter 는 함수 내에서 사용하라고 전달해 주는 값인 만큼 여기에 있는 값들은 높은 확률로 함수 실행 직후 사용된다.
> - 그럼 굳이 느린 메모리 상에 저장할 이유가 있을까? 그래서 RISC 와 같은 architecture 에서는 parameter 를 register 에 저장하고, parameter 가 너무 많아 register 가 부족할 때만 남는애들을 stack 에 저장한다.

#### 2. Current context 저장

- 함수가 종료되고 다시 원래대로 돌아왔을 때, 실행되기 전과 동일한 상태로 실행되어야 한다.
- 그래서 현재의 register 값들 또한 stack 에 저장하는데, 이때 중요한 것은 [[Program Counter, PC (Arch)|program counter]] (`PC`) 값을 저장한다는 것이다.
	- 이것이 바로 return address 가 된다; 즉, 함수가 종료되었을 때 돌아와야할 주소는, 함수 호출 직전의 `PC` 값이기 떄문.
- 참고로 모든 register 값을 저장하지는 않는다. 일단은 필요한 값들 (특히 `PC`) 만 저장한다고 생각하자.
- 그리고 여기까지 한 다음에 함수 코드로 점프하게 된다.
- 이 register 를 저장하고 점프하는 것은 많은 architecture 에서 shortcut instruction 으로 제공한다.
	- 그건 아래 tip 에서 확인한다.

> [!tip] 이것도 무조건 stack 에 저장할까?
> - 아니다. Architecture 별로 다르다.
> - [[Reduced Instruction Set Computer, RISC (Arch)|RISC]] 계열에서는 보통 register 에 저장한다.
> 	- MIPS 에서는 `JAL` (Jump and Link) instruction 이고, `$ra` register 에 저장한다.
> 	- ARM 에서는 `BL` (Branch with Link) instruction 이고, `r14` register 에 저장한다.
> - X86 에서는 stack 에 저장한다. (Instruction 이름은 `CALL` 이다.)

#### 3. Local variable 저장

- 이제 