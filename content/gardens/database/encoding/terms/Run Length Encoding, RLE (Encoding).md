---
tags:
  - Database
  - db-encoding
date: 2024-07-29
---
> [!info]- 참고한 것들
> - [[2. Background (BtrBlocks, SIGMOD 23)#2.2.2. RLE & One Value.|BtrBlocks - Efficient Columnar Compression for Data Lakes, SIGMOD'23]]
> - [위킥](https://en.wikipedia.org/wiki/Run-length_encoding)

## 달리는 길이 변환?

![[Pasted image 20240729153354.png]]
> [네이버 영어사전](https://en.dict.naver.com/#/entry/enko/45af1090921049289c4e3444897b86a6)

- 여기서 *Run* 은 "동일한 값이 반복되는 sequence" 를 의미한다.
- 즉, *Run Length Encoding* 은 "동일한 값이 반복되는 sequence 의 길이" 로 encoding 하는 것을 의미한다.

## 예시

- 이거봐라:

```
WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW
```

- 이걸 같은애들끼리 묶으면,

```
(WWWWWWWWWWWW)(B)(WWWWWWWWWWWW(BBB)(WWWWWWWWWWWWWWWWWWWWWWWW)(B)(WWWWWWWWWWWWWW)
```

- 그리고 숫자로 바꾸면 된다.

```
12W1B12W3B24W1B14W
```

- 위와 같이 그냥 일렬로 쭉 적거나, 아니면 배열을 두개로 나눌 수도 있다.

```
[W, B, W, B, W, B, W]
[12, 1, 12, 3, 24, 1, 14]
```

## 언제쓰면 좋을까?

- 당연히 어떤 값이 "연속해서 반복적으로" 등장할 때 좋다.
- 따라서 어떤 값이 반복적으로 나오긴 하지만 연속해서 나오지는 않을때 (`WBWBWBWBWBWBWB...`) 와
	- 이 경우 순서를 바꿔도 된다면, 이것을 정렬해버린 다음 encoding 하면 아주 행복할 것이다. (`BBB...WWW...`)
	- 이렇게 정렬해버리는 꼼수를 [[7. Related work and conclusion (BtrBlocks, SIGMOD 23)#7.0.1. SQL Server.|MS SQL Server Columnstore Index]] 에서 사용한다고 한다.
- Unique value 가 너무나 많을 때 (`ABCDEFGHIJK...`) 사용하면 쥐약일 것이다.
	- 이 경우의 대표적인 예가 SQL 에서 [[Private Key, PK (Relational Model)|PK]] 이다.

## One Value

- 만약 모든 값이 하나의 값으로 동일하다면, 당연히 길이는 빼고 그냥 해당 값으로 퉁치면 될 것이다.
- 이러한 특별 케이스의 RLE 를 *One Value* 라고 부르기도 한다.