---
tags:
  - terms
  - security
  - hash
date: 2024-05-28
---
> [!info]- 참고한 것들
> - [[9. CT|서울대 권태경 교수님 컴퓨터네트워크보안특강 강의 (Spring 2024)]]

## 소개

- [[Hash Pointer (Hash)|Hash pointer]] 의 linked list 가 blockchain 이라면, hash pointer 의 binary tree 가 *Merkle tree* 이다.

![[Pasted image 20240528005906.png]]

- 위의 그림처럼, 모든 데이터는 leaf 에 있고 이들을 hash pointer 를 이용해 binary tree 로 만든 것을 *Merkle tree* 라고 한다.
- 여기에서의 root 는 *Root hash* 혹은 *Merkle root* 라고 부른다.

### Data integrity

- 만일 leaf 의 data 가 변경이 되면 그에 따른 hash 값도 바뀔 것이고, 그럼 그 상위 node 의 값이 바뀌어 또 hash 가 변경되는 일이 root hash 에 도달할 때 까지 연쇄적으로 일어날 것이다.
- 따라서 root hash 가 변경되지 않았다면 leaf data 가 전부 변경되지 않았다는 것이 보장된다.

### Membership (inclusion)

![[Pasted image 20240528011324.png]]

- 어떤 data 가 root hash 생성에 반영되어 있다는 것은 다음과 같이 검증할 수 있다.
    - (1) 원하는 데이터와 (2) 해당 데이터가 root hash 까지 올라가는 경로상의 digest 가 주어진다면,
    - `hash(hash(hash(data) + digest1) + digest2)` 뭐 이런식으로 연산한 결과가 root hash 와 같은지 판단해서 root hash 에 해당 data 가 반영되어 있는지 확인할 수 있다.
- 이 과정은 data 가 leaf 에 존재하는가를 확인하는 것이 아님에 주의할 것.

### Growth

- Merkle tree 에서는 항상 leaf node 가 짝수가 되어야 하기에, 이미 leaf node 가 짝수인 merkle tree 에 leaf node 를 추가하기 위해서는 다음과 같은 구현이 가능하다 [^add-leaf-node]:
	- 동일한 leaf node 를 하나 더 추가해서 강제로 짝수로 만드는 방법
- 두 merkle tree 를 merge 할 때는, 두 merkle root 를 hash 해서 새로운 merkle root 를 만드는 방식으로 진행된다.

[^add-leaf-node]: 채찍피티가 준 예시라서 정확하지 않을 수 있다.