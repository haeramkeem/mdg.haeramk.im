---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-07-05
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/excel-sheet-column-title)

> [!tip] 요약
> - 규칙을 고민해보자.

## 최종

> [!info]- 결과
> ![[Pasted image 20260705090907.png]]

> [!info] 분류
> - 이 문제도 brute force 라고 하긴 뭐하지만 어디 분류할곳이 없어서 그냥 brute force 에 넣어두었다.

- 규칙만 확실히 수립하면 푸는건 쉽다. 근데 그 규칙이 좀 시행착오를 겪어야 한다.
- Excel 의 알파벳 규칙을 생각해보면 다음과 같이 된다는 것을 알 수 있다.

$$
Col = 26^{n} \times i_{n} + 26^{n - 1} \times i_{n - 1} + ... + 26^{1} \times i_{1} + 26^{0} \times i_{0}
$$

- 다만, 여기서 문제는 저 $i_{n}$ 가 1 ~ 26 이라는 것이다.
- 가령 `columnNumber` 52 의 경우에는 다음과 같이 된다:

$$
52 = 26^{1} \times 1 + 26^{0} \times 26
$$

- 그래서 `1: 'A'`, `26: 'Z'` 라서 `"AZ"` 가 된다.
- 위의 수식에서 만약에 $i_{n}$ 가 0 ~ 25 면 간단하다. 그냥 26 으로 modulo 해서 $i_{0}$ 알아내고, $Col \div 26$ 한 다음에 다시 26 으로 modulo 해서 $i_{1}$ 알아내는 것을 반복하면 된다.
- 그렇다면, $i_{n}$ 가 1 ~ 26 이면 어떻게 하면 좋을까? 이건 26으로 modulo 했을 때 0 이 되면 그것을 26으로 바꿔주기만 하면 된다.
- 가령 위의 52 예시를 생각해보자. 아래의 수식에서 $i_{1}$ 와 $i_{0}$ 를 구해야 한다.

$$
52 = 26^{1} \times i_{1} + 26^{0} \times i_{0}
$$

- 우선 $52 \mod{26} = 0$ 이다. 따라서 0 이 나왔기 때문에, 26으로 바꿔주면 $i_{0}$ 이 26 이 된다.

$$
52 = 26^{1} \times i_{1} + 26^{0} \times 26
$$

- 이제 $26^{0} \times 26$ 을 좌변으로 옮기고, 양변을 26으로 나눠준다.

$$
1 = 26^{0} \times i_{1}
$$

- 우리는 물론 위 수식만 봐도 $i_{1}$ 을 알 수 있다. 하지만 알고리즘을 완결시켜보자. 다시 26 으로 modulo 해준다. 그럼 $1 \mod{26} = 1$ 이고, 0이 아니기 때문에 그냥 $i_{1}$ 은 1이 된다.
- 마찬가지로 $26^{0} \times 1$ 을 좌변으로 옮기고, 양변을 26으로 나눠준다.

$$
0 = 0
$$

- 여기서 멈춘다. 좌변이 0이 됐기 때문.
- 이 방식으로 하면 $i_{0}$, $i_{1}$, ... 순서로 알아내게 된다. 하지만 정답은 역순이기 때문에, 마지막에 `reverse()` 만 해주면 된다.
- 그래서 코드는 다음과 같다:

```cpp
#define NUM_ALPHA ('Z' - 'A' + 1)

class Solution {
public:
	string convertToTitle(int columnNumber) {
		string ret = "";

		while (columnNumber) {
			int idx = (columnNumber % NUM_ALPHA);
			if (!idx) {
				idx = 26;
			}
			columnNumber = (columnNumber - idx) / NUM_ALPHA;
			ret += 'A' + idx - 1;
		}

		reverse(ret.begin(), ret.end());

		return ret;
	}
};
```
