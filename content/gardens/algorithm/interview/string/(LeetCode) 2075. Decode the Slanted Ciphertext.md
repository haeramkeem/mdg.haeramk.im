---
tags:
  - mdg
  - algorithm
  - interview
  - string
date: 2026-04-04
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/decode-the-slanted-ciphertext)

> [!tip] 요약
> - 하라는대로 하면 풀리는 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260404161055.png]]

- 어려운 문제는 아니다. 하라는대로 하면 풀린다.
- 다만 `encodedText` 가 2차원 matrix 를 1차원으로 flatten 시킨 것이기 때문에, index 계산만 안헷갈리고 해주면 된다.
- 그래서 코드는:

```cpp
#define TO_IDX(x, y, columns) ((y) * (columns) + (x))

class Solution {
private:
	string rtrim(string arg) {
		string ret = "";
		int trim_bound = arg.size() - 1;

		for (; trim_bound >= 0; trim_bound--) {
			if (arg[trim_bound] != ' ')
				break;
		}

		return string(arg.begin(), arg.begin() + trim_bound + 1);
	}
public:
	string decodeCiphertext(string encodedText, int rows) {
		int columns = encodedText.size() / rows;
		string ret = "";

		for (int column = 0; column < columns; column++) {
			int x = column, y = 0;

			while (x < columns && y < rows) {
				ret += encodedText[TO_IDX(x, y, columns)];
				x++;
				y++;
			}
		}

		return rtrim(ret);
	}
};
```

- C++ 로 푼 만큼, trim 함수를 구현해줘야겠다.
	- 상위버전에서는 trim 함수가 지원된다는데 혹시 모르니까 한번쯤 구현해봐도 괜찮을듯.