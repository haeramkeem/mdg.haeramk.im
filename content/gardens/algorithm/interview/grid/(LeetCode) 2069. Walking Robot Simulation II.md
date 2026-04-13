---
tags:
  - mdg
  - algorithm
  - interview
  - grid
date: 2026-04-07
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/walking-robot-simulation-ii)

> [!tip] 요약
> - 무지성으로 짜면 timeout 나는 문제.

## 최종

> [!info]- 결과
> ![[Pasted image 20260407195207.png]]

- 결과는 좀 느린데, 다른사람들 정답 보니까 접근 자체에는 문제가 없는 것 같아서 그냥 이대로 결정
	- 통과했자나 한잔해

```cpp {71-75}
#define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))
#define AROUND(w, h) (((w) - 1) * 2 + ((h) - 1) * 2)

#define DIR_EAST	(0)
#define DIR_NORTH   (1)
#define DIR_WEST	(2)
#define DIR_SOUTH   (3)

class Robot {
private:
	static constexpr string dir_str[4] = {"East", "North", "West", "South"};
	static constexpr int dir_arr[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

	int width;
	int height;
	vector<int> pos;
	int dir;
public:
	Robot(int width, int height) {
		this->width = width;
		this->height = height;
		this->pos = vector<int>(2, 0);
		this->dir = DIR_EAST;
	}
	
	void step(int num) {
		int next[2];
		int rem = num;

		while (rem > 0) {
			next[0] = pos[0] + dir_arr[dir][0] * rem;
			next[1] = pos[1] + dir_arr[dir][1] * rem;

			if (0 <= next[0] && next[0] < width && 0 <= next[1] && next[1] < height) {
				pos[0] = next[0];
				pos[1] = next[1];
				return;
			}

			if (0 > next[0]) {
				rem = -next[0];

				pos[0] = 0;
				pos[1] = next[1];
			}

			if (next[0] >= width) {
				rem = next[0] - width + 1;

				pos[0] = width - 1;
				pos[1] = next[1];
			}

			if (0 > next[1]) {
				rem = -next[1];

				pos[0] = next[0];
				pos[1] = 0;
			}

			if (next[1] >= height) {
				rem = next[1] - height + 1;

				pos[0] = next[0];
				pos[1] = height - 1;
			}

			if (rem > AROUND(width, height)) {
				rem %= AROUND(width, height);
			} else {
				dir = (dir + 1) & 0x3;
			}
		}
	}
	
	vector<int> getPos() {
		return this->pos;
	}
	
	string getDir() {
		return dir_str[dir];
	}
};

/**
 * Your Robot object will be instantiated and called as such:
 * Robot* obj = new Robot(width, height);
 * obj->step(num);
 * vector<int> param_2 = obj->getPos();
 * string param_3 = obj->getDir();
 */
```

- Highlight 된 부분이 핵심이다.
	- 우선, grid의 둘레 길이만큼 움직이면, 결국에는 제자리로 돌아온다. 그래서 둘레의 길이를 이용해 mod 연산을 때려서 이렇게 뱅글뱅글 도는 것을 생략한다.

### 삽질 기록

> [!info]- 결과
> ```cpp
> #define ABS_DIFF(a, b) ((a) > (b) ? (a) - (b) : (b) - (a))
>
> #define DIR_EAST	(0)
> #define DIR_NORTH   (1)
> #define DIR_WEST	(2)
> #define DIR_SOUTH   (3)
>
> class Robot {
> private:
>	 static constexpr string dir_str[4] = {"East", "North", "West", "South"};
>	 static constexpr int dir_arr[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};
>
>	 int width;
>	 int height;
>	 vector<int> pos;
>	 int dir;
> public:
>	 Robot(int width, int height) {
>		 this->width = width;
>		 this->height = height;
>		 this->pos = vector<int>(2, 0);
>		 this->dir = DIR_EAST;
>	 }
>
>	 void step(int num) {
>		 int next[2];
>		 int rem = num;
>
>		 while (rem > 0) {
>			 next[0] = pos[0] + dir_arr[dir][0] * rem;
>			 next[1] = pos[1] + dir_arr[dir][1] * rem;
>
>			 if (0 <= next[0] && next[0] < width && 0 <= next[1] && next[1] < height) {
>				 pos[0] = next[0];
>				 pos[1] = next[1];
>				 return;
>			 }
>
>			 dir = (dir + 1) & 0x3;
>
>			 if (0 > next[0]) {
>				 rem = -next[0];
>
>				 pos[0] = 0;
>				 pos[1] = next[1];
>			 }
>
>			 if (next[0] >= width) {
>				 rem = next[0] - width + 1;
>
>				 pos[0] = width - 1;
>				 pos[1] = next[1];
>			 }
>
>			 if (0 > next[1]) {
>				 rem = -next[1];
>
>				 pos[0] = next[0];
>				 pos[1] = 0;
>			 }
>
>			 if (next[1] >= height) {
>				 rem = next[1] - height + 1;
>
>				 pos[0] = next[0];
>				 pos[1] = height - 1;
>			 }
>		 }
>	 }
>
>	 vector<int> getPos() {
>		 return this->pos;
>	 }
>
>	 string getDir() {
>		 return dir_str[dir];
>	 }
> };
>
> /**
>  * Your Robot object will be instantiated and called as such:
>  * Robot* obj = new Robot(width, height);
>  * obj->step(num);
>  * vector<int> param_2 = obj->getPos();
>  * string param_3 = obj->getDir();
>  */
> ```

- [[#최종|위]] 에서의 최적화 없이 그냥 뱅글뱅글 돌리는 방식으로 구현하면, timeout이 난다.