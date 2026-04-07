---
tags:
  - mdg
  - algorithm
  - interview
  - grid
date: 2026-04-06
---
> [!info] 문제 링크
> - [LeetCode](https://leetcode.com/problems/walking-robot-simulation)

> [!tip] 요약
> - 그냥 좌표를 하나하나 따라가는게 더 나을 수도 있다.

## 최종

> [!info]- 결과
> ![[Pasted image 20260406164354.png]]

- [[#삽질 기록|여기]] 에서는 움직이는 범위를 이용해 이 안에 obstacle 이 있나 찾는 방법으로 접근했는데, 해보니 통과되긴 하지만 너무 느리다.
- 그래서 다른사람 solution 을 보니 그냥 좌표를 1씩 움직이길래 그렇게하는게 더 빠른가 싶어서 해봤더니 확실히 더 낫긴 하다.
- 코드는:

```cpp
#define PACK(x, y) (((x) << 16) | ((y) & 0xFFFF))
#define EUCLID(pos) ((pos)[0] * (pos)[0] + (pos)[1] * (pos)[1])
#define MAX(a, b) ((a) > (b) ? (a) : (b))

#define DIR_UP      (0)
#define DIR_RIGHT   (1)
#define DIR_DOWN    (2)
#define DIR_LEFT    (3)

class Solution {
private:
	static constexpr int direction_map[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

	int pos[2];
	int direction;
	int max_distance;
	set<int> obstacles;

	void init(vector<vector<int>> &obstacles) {
		pos[0] = 0;
		pos[1] = 0;
		direction = DIR_UP;
		max_distance = 0;
		
		for (auto &o : obstacles) {
			this->obstacles.insert(PACK(o[0], o[1]));
		}
	}

	void turnRight() {
		direction = (direction + 1) & 0x3;
	}

	void turnLeft() {
		direction = (direction - 1) & 0x3;
	}

	void move(int distance) {
		for (int i = 0; i < distance; i++) {
			int next[2];

			next[0] = pos[0] + direction_map[direction][0];
			next[1] = pos[1] + direction_map[direction][1];

			if (obstacles.find(PACK(next[0], next[1])) != obstacles.end()) {
				break;
			}

			pos[0] = next[0];
			pos[1] = next[1];
		}

		max_distance = MAX(max_distance, EUCLID(pos));
	}

	void act(int command) {
		switch (command) {
		case -2: turnLeft(); break;
		case -1: turnRight(); break;
		default: move(command); break;
		}
	}
public:
	int robotSim(vector<int>& commands, vector<vector<int>>& obstacles) {
		init(obstacles);

		for (auto c : commands) {
			act(c);
		}

		return max_distance;
	}
};
```

### 삽질 기록

> [!info]- 결과
> ![[Pasted image 20260406154447.png]]

> [!info]- 코드
> ```cpp
> #define DISTANCE(pos) ((pos)[0] * (pos)[0] + (pos)[1] * (pos)[1])
> #define MAX(a, b) (a > b ? a : b)
> 
> #define DIR_UP      (0)
> #define DIR_RIGHT   (1)
> #define DIR_DOWN    (2)
> #define DIR_LEFT    (3)
> 
> #define INVALID   (0x7FFFFFFF)
> 
> class Solution {
> private:
> 	int pos[2];
> 	int direction;
> 	int max_distance;
> 	map<int, vector<int>> obstacles_xmap;
> 	map<int, vector<int>> obstacles_ymap;
> 
> 	void init(vector<vector<int>> &obstacles) {
> 		pos[0] = 0;
> 		pos[1] = 0;
> 		direction = DIR_UP;
> 		max_distance = 0;
> 		
> 		obstacles_xmap.clear();
> 		for (auto &o : obstacles) {
> 			if (obstacles_xmap.find(o[0]) == obstacles_xmap.end()) {
> 				obstacles_xmap.emplace(o[0], vector<int>());
> 			}
> 
> 			obstacles_xmap[o[0]].push_back(o[1]);
> 		}
> 
> 		for (auto &o : obstacles_xmap) {
> 			sort(o.second.begin(), o.second.end());
> 		}
> 
> 		obstacles_ymap.clear();
> 		for (auto &o : obstacles) {
> 			if (obstacles_ymap.find(o[1]) == obstacles_ymap.end()) {
> 				obstacles_ymap.emplace(o[1], vector<int>());
> 			}
> 
> 			obstacles_ymap[o[1]].push_back(o[0]);
> 		}
> 
> 		for (auto &o : obstacles_ymap) {
> 			sort(o.second.begin(), o.second.end());
> 		}
> 	}
> 
> 	void turnLeft() {
> 		direction = (direction - 1) & 0x3;
> 	}
> 
> 	void turnRight() {
> 		direction = (direction + 1) & 0x3;
> 	}
> 
> 	int findMinInRange(vector<int> &sorted, int from, int to) {
> 		int target = INVALID;
> 
> 		for (int s : sorted) {
> 			if (from <= s && s <= to) {
> 				target = s;
> 				break;
> 			}
> 		}
> 
> 		return target;
> 	}
> 
> 	int findMaxInRange(vector<int> &sorted, int from, int to) {
> 		int target = INVALID;
> 		
> 		for (int i = sorted.size() - 1; i >= 0; i--) {
> 			if (from <= sorted[i] && sorted[i] <= to) {
> 				target = sorted[i];
> 				break;
> 			}
> 		}
> 
> 		return target;
> 	}
> 
> 	void forward(int unit) {
> 		switch (direction) {
> 		case DIR_UP: {
> 			int obstacle = findMinInRange(obstacles_xmap[pos[0]], pos[1], pos[1] + unit);
> 			cout << obstacle << endl;
> 
> 			if (obstacle != INVALID) {
> 				if (pos[0] == 0 && pos[1] == 0 && obstacle == 0) {
> 					pos[1] += unit;
> 				} else {
> 					pos[1] = obstacle - 1;
> 				}
> 			} else {
> 				pos[1] += unit;
> 			}
> 		}
> 		break;
> 		case DIR_RIGHT: {
> 			int obstacle = findMinInRange(obstacles_ymap[pos[1]], pos[0], pos[0] + unit);
> 
> 			if (obstacle != INVALID) {
> 				if (pos[0] == 0 && pos[1] == 0 && obstacle == 0) {
> 					pos[0] += unit;
> 				} else {
> 					pos[0] = obstacle - 1;
> 				}
> 			} else {
> 				pos[0] += unit;
> 			}
> 		}
> 		break;
> 		case DIR_DOWN: {
> 			int obstacle = findMaxInRange(obstacles_xmap[pos[0]], pos[1] - unit, pos[1]);
> 
> 			if (obstacle != INVALID) {
> 				if (pos[0] == 0 && pos[1] == 0 && obstacle == 0) {
> 					pos[1] -= unit;
> 				} else {
> 					pos[1] = obstacle + 1;
> 				}
> 			} else {
> 				pos[1] -= unit;
> 			}
> 		}
> 		break;
> 		case DIR_LEFT: {
> 			int obstacle = findMaxInRange(obstacles_ymap[pos[1]], pos[0] - unit, pos[0]);
> 
> 			if (obstacle != INVALID) {
> 				if (pos[0] == 0 && pos[1] == 0 && obstacle == 0) {
> 					pos[0] -= unit;
> 				} else {
> 					pos[0] = obstacle + 1;
> 				}
> 			} else {
> 				pos[0] -= unit;
> 			}
> 		}
> 		break;
> 		}
> 
> 		max_distance = MAX(max_distance, DISTANCE(pos));
> 	}
> 
> 	void act(int command) {
> 		switch (command) {
> 		case -2: turnLeft(); break;
> 		case -1: turnRight(); break;
> 		default: forward(command);
> 		}
> 	}
> public:
> 	int robotSim(vector<int>& commands, vector<vector<int>>& obstacles) {		
> 		init(obstacles);
> 
> 		for (int c : commands) {
> 			act(c);
> 		}
> 
> 		return max_distance;
> 	}
> };
> ```

- 위에서 말한 그 느린 코드.