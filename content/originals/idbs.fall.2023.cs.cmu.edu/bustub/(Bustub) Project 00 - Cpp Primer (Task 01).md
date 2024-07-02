---
tags:
  - CMU-15445
  - Database
  - Bustub
date: 2024-07-01
---
> [!info]- 참고한 것들
> - [가이드](https://15445.courses.cs.cmu.edu/fall2023/project0/)

> [!info]- CodeRef (인데 private 이라 주인장만 볼 수 있음)
> - [Github](https://github.com/haeramkeem/bustub-private.idbs.fall.2023.cs.cmu.edu/pull/1)

## `Trie::Get`

### 구현

- `this->GetRoot()` 로 초기화한 iterator 를 하나 선언하고
- `key` 에 대해 반복문을 돌리면서 iterator 를 원하는 노드까지 옮겨놓은 다음
- 해당 노드를 `dynamic_cast` 를 이용해 `TrieNode` 에서 `TrieNodeWithValue` 로 downcast 한 뒤 value 를 꺼내 반환하면 끗

### 예외처리

- `this->GetRoot()` 가 `nullptr` 라면 반복문을 도는 것이 불가능하다; 따라서 이때는 `nullptr` 반환
- 원하는 key 에 대한 node 가 없다면 당연히 iterator 를 옮기는 과정에서 `std::map.at()` 이 에러가 난다; 따라서 이때도 `nullptr` 반환
- 올바르지 않은 downcast 의 경우에는 `dynamic_cast` 이 `nullptr` 를 반환한다; 따라서 이때도 `nullptr` 반환

## `Trie::Put`

### 구현

- 일단 CoW 를 위한 요구사항을 좀 분석해야 했다.
	- Node 를 찾아가는 경로상에 있는 애들은 무조건 Clone 되어야 한다.
		- 처음에는 그냥 이렇게 policy 를 잡고 구현했는데, 나중에 보니 무조건 이렇게 해야된다는 것을 알았지 뭐얌
		- 왜냐면 어떤 node 하나가 변경되면 주소값이 바뀌기 때문에, 그것의 parent node 도 바뀌어야 하기 때문
			- CoW 를 위해 `Trie::Put` 함수를 `const` 로 선언해놓았고, 따라서 member field 들을 변경할 수 가 없다.
				- 그래서 member `map` field 도 `.at()` 이나 `.size()` 같은 RO 함수들만 사용할 수 있고
				- `.insert()` 나 `.emplace()` 같은애들은 사용 못함
				- 결국에는 바뀐 자식의 주소를 부모의 `map` 에 overwrite 할 수가 없어 부모도 clone 되어야 하는 사태가 벌어진다.
		- 즉, root 까지 이 변경사항이 propagation 되기 때문에 어쩔 수 없이 경로상에 있는 모든 애들이 clone 되어야 한다.
		- 이때 root 는 반드시 경로에 포함되므로 예외 없이 clone 되어야 한다.
	- 나머지 애들은 Reuse 한다.
- 이것을 위해 택한 방법은 DFS 식 접근이다.
	- 일단 경로를 쭉 따라가면서 경로들의 node 를 stack 에 차곡차곡 넣고
	- Stack 에서 두개를 빼면 첫번째 놈이 자식일거고 두번째 놈이 부모일테니
	- 부모의 `children_` map 을 복사해 와 자식의 주소를 넣어주고
	- 이 map 을 이용해 새로운 부모를 만든 다음 그것을 stack 에 넣어주는 식으로 합치기
	- 이때 Stack 의 원소가 1개가 되면 이놈이 root 이기 때문에 이놈을 새로 생성한 `Trie` 의 `root_` 로 지정해주면 끝날 일이다.

### 삽질

- Stack 을 비우는 과정에서 문제가 좀 있었다.
	- 부모를 새로 만들 때, 만약 부모가 `TrieNodeWithValue` 형이라면, `TrieNode` 에서 downcast 를 하여 `value_` field 를 살려야 경로상에 있던 value 들이 지워지지 않는다.
	- 이것을 위해 `is_value_node_` field 로 분기문 처리를 했는데, 이 값이 `true` 여도 `dynamic_cast` 가 되지 않는 문제가 있었다.
	- 솔직히 이건 지금도 왜이런지 모름
		- 똑같은 코드를 `Trie::Get` 함수에서 돌리면 정상적으로 되는데 여기에서만 안되고
		- Child 가 `std::map` 에 저장되어 이리저리 옮겨다니며 object slicing 이 발생했나 싶다가도 여기에 object 가 직접 들어가는 것도 아니고 `shared_ptr` 가 저장되는데 왜때문에 이렇게 되는지 알 방법이 없었다
	- 그래서 type 에 따라 다르게 행동하게 하기 위해 polymorphism 을 활용했다.
		- 기존에는 자신과 똑같은 놈을 만들어주는 `.Clone()` 함수만 있었다면,
		- 자식을 주입해 복제하는 `.Clone(std::map<char, std::shared_ptr<const TrieNode>>)` 를 `TrieNode` 에 정의하고 `TrieNodeWithValue` 에는 이걸 override 해서 `value_` 가 자동으로 복사될 수 있도록 함
	- 이렇게 하니까 잘 되긴 하는데, 뭔가 좀 찝찝하다.
		- Testcase 를 수정해 `test-int:233`, `test-int2:23333` 을 트라이에 넣고
		- 뒤이어 이 둘을 조회하는 testcase 를 넣어봤는데
		- 이때도 동일하게 `dynamic_cast` 가 안되는 문제가 있었다.
		- 일단 기본 제공되는 testcase 들이 다 통과했으니까 넘어갔음

### 예외처리

- `this->GetRoot()` 가 `nullptr` 면 iterator 에 빈 `TrieNode` 를 넣어줘 iteration 이 시작될 수 있게 했다.
- Iteration 도중 child 가 없는 경우에도, stack 에 빈 `TrieNode` 를 넣어주고 iterator 를 그리 옮겨 key 의 모든 문자들을 돌 때까지 문제 없게 했다.
- Value node 가 아닌데 children 이 없을 때는 해당 node 를 지워야 한다;
	- 따라서 stack 을 비우는 과정에서 이 경우에는 child 를 `std::map` 에 추가하는게 아니라 지워버리도록 함으로써 해당 child 가 GC 될 수 있게 했다.

## `Trie::Remove`

### 구현

- 얘는 `Trie::Put` 이랑 거의 동일하다.
	- `Trie::Put` 에서는 target node 를 `TrieNode` 에서 `TrieNodeWithValue` 로 바꿨다면,
	- `Trie::Remove` 에서는 반대로 target node 를 `TrieNodeWithValue` 에서 `TrieNode` 로 바꾸는 것으로 끗

### 예외처리

- `Trie::Put` 과 동일한데, 추가적으로 하나가 더 들어갔음:
- 만일 Trie 의 모든 값이 지워지면 root 는 `nullptr` 가 되어야 한다.
- `Trie::Put` 에서는 이럴 일이 없으니까 신경 안썼지만, `Trie::Remove` 에서는 발생할 수 있기 때문에 stack 을 비우고 남은 node 가 값도 없고 자식도 없는 경우에는 그냥 `root_` 를 `nullptr` 로 만들어 버렸다.

## 그리고 몇가지 C++ 관련 Troubleshoot 들

- [[Cpp - map 원소 존재여부 검사하기]]
- [[Cpp - 형변환 (dynamic_cast)]]
- [[Cpp - smart pointer 생성하기 (make_, use_count)]]
- [[Cpp - smart pointer 소유권 (move)]]
- [[Cpp - smart pointer 일반 포인터로 바꾸기 (get)]]