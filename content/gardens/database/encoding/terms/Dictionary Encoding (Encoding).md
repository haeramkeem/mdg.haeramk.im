---
tags:
  - Database
  - db-encoding
date: 2024-07-29
---
> [!info]- 참고한 것들
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)#2.2.3. Dictionary|BtrBlocks - Efficient Columnar Compression for Data Lakes, SIGMOD'23]]
> - [위키](https://en.wikipedia.org/wiki/Dictionary_coder)

## 사전

- 메뚜기 종류 200여종을 알고 있는 공익 친구 김x모씨는 [브리태니커 사전](https://en.wikipedia.org/wiki/Encyclop%C3%A6dia_Britannica) 을 달달 외우고 있어서 단어 하나를 말하면 해당 단어가 사전에서 몇번째로 등장하는지 알려주는 아주 신비로운 놈이다.
- 그럼 어떤 책을 encoding 할 때, 여기에 나오는 단어들을 전부 이 친구에게 물어봐 대응되는 숫자로 변환하면 어떨까?
- 단어들은 8byte 문자"들"의 조합이고, 이것을 8byte 숫자 "하나" 로 바꿀 수 있으니 저장공간을 매우 줄일 수 있을 것이다.

## Dictionary Encoding

- 물론 실제로 *Dictionary Encoding* 은 위처럼 무식하게 하지는 않는다.
	- *Dictionary Encoding* 을 하기 위해 브리태니커 백과사전을 메모리상에 올려놓고 사용하는 사람은 없다.
- 어떤 단어 배열을 한번 쭉 훑으며 등장하는 단어들만을 별도의 dictionary 배열에 넣어놓고 단어 배열의 단어들을 dictionary 내에서의 index 로 치환하면 될 것이야.
- 위에서는 "문자들" 을 "숫자 하나" 로 바꾼다고 눈속임을 했지만, 사실은 이 dictionary 도 저장공간을 필요로 하기 때문에 이 *Dictionary Encoding* 이 항상 좋은 것은 아니다.

### 언제 쓸까?

- 위에서 말한 것처럼, dictionary 도 저장공간을 필요로 하기 때문에 "작은 크기의 dictionary" 로 "많은 양의 데이터" 를 감당할 수 있으면 좋을 것이다.
- 즉, 중복된 데이터가 많다면 더 좋다.
	- 위와 같은 점은 [[Run Length Encoding, RLE (Encoding)|RLE]] 와 유사하면서도 구분되는 특징이다.
	- RLE 에서는 저런 중복된 데이터가 "연속" 되어 있어야 하지만, Dictionary 는 그럴 필요가 없기 때문.

### 예시

- 짜잔

```
[USA, USA, USA, USA, Mexico, Canada, Mexico, Mexico, Mexico, Argentina]
```

- 이걸로 dictionary 를 구성하면 다음과 같이 할 수 있을 것이다.

```
[USA, Mexico, Canada, Argentina]
```

- 그리고 이것으로 원본 배열을 치환하면 이렇게 된다.

```
code: [0, 0, 0, 0, 1, 2, 1, 1, 1, 3]
dictionary: [USA, Mexico, Canada, Argentina]
```

> [!tip] *Code*
> - 위의 예시에서 `USA` 가 `0` 으로 치환되었는데,
> - 이때 저 치환값 (`0`) 을 *Code* 라고도 부른다.

## Variant

- 이렇게 dictionary 를 만들어서 치환하는 방법을 통칭해서 *Dictionary Encoding* 이라고 한다.
	- 제곧내; *Substitution Encoding* 라고도 부른다.
- 근데 이 dictionary 가 생각보다 사이즈가 클 수도 있다.
	- [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (7. Related work and conclusion)#7.0.6. SAP BRPFC.|여기]] 에 따르면 SAP HANA 의 전체 메모리 중 28% 를 dictionary string 이 차지하기도 했다고 한다.
- 따라서 많은 최적화된 variant 가 존재한다. 가령,
	- [[Fast Static Symbol Table, FSST (Encoding)]]