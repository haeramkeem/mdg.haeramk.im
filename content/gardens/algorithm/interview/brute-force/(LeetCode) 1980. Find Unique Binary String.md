---
tags:
  - mdg
  - algorithm
  - interview
  - brute-force
date: 2026-03-08
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/find-unique-binary-string)

> [!tip] 요약
> - Brute force 로 굴려도 성능 잘 나온다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260308112411.png]]

- 이 문제에 대해 brute force 로 가능할 것 같다고 생각한 이유는:
	- String size 가 $N$ 일 때, 입력 string 의 개수도 $N$ 이다. 즉, 가능한 정답의 개수는 $2^N - N$ 개 이므로 전체 집합 중에서 정답이 차지하는 비중이 엄청나게 크다. 따라서 그냥 최대값 ($2^N - 1$) 부터 1씩 감소시키며 정답인지 아닌지 판단해주는 것만으로도 금방 정답을 찾을 수 있을 것이라 생각했다.
- 그래서 아래처럼 짜면 된다.

```c
#define N_MAX (16)

int strToBMS(char *str_num, int str_len)
{
	int res = 0;

	for (int i = 0; i < str_len; i++)
		res |= (str_num[i] - '0') << i;

	return res;
}

void BMSToStr(char *dst, int src, int num_bits)
{
	for (int i = 0; i < num_bits; i++)
		dst[i] = ((src >> i) & 0x1) + '0';

	dst[num_bits] = '\0';
}

bool isNotExist(int *nums_bms, int num_bms, int len_nums_bms)
{
	for (int i = 0; i < len_nums_bms; i++)
		if (nums_bms[i] == num_bms)
			return false;
	
	return true;
}

char* findDifferentBinaryString(char** nums, int numsSize)
{
	int nums_bms[N_MAX];
	int res_bms;
	char *res;

	// Pack to bitmapset (BMS)
	for (int i = 0; i < numsSize; i++)
		nums_bms[i] = strToBMS(nums[i], numsSize);

	// Find noext
	res_bms = (1 << numsSize) - 1;
	for (; res_bms > 0; res_bms--)
		if (isNotExist(nums_bms, res_bms, numsSize))
			break;

	// Unpack to string
	res = malloc(sizeof(char) * numsSize + 1);
	BMSToStr(res, res_bms, numsSize);

	return res;
}
```

- 위 코드에서 들어간 유일한 최적화는:
	- String 비교는 느리기 때문에 이것을 integer type 의 bitmapset (BMS) 로 변환시켜서 비교했다.
	- Bitmapset 으로 바꾸는 함수가 `strToBMS` 이고 반대로 string 으로 바꾸는 함수가 `BMSToStr` 이다.

### Future plan

- 위 코드에서 가장 비효율적인 부분은 `isNotExist` 함수이다. 단순하게 array 의 모든 entry 랑 비교하기 때문.
- [[Bloom Filter (Data Structure)|Bloom filter]] 처럼 bitmapset operation 으로 좀 더 최적화할 수 있을 것 같은데 일단 이정도로도 빠르게 작동하므로 나중에 해보자.