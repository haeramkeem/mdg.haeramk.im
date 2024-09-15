---
tags:
  - database
  - db-encoding
date: 2024-09-15
aliases:
  - Interleaved Bit-Packing
  - K-Way Bit-Packing
---
> [!info]- 참고한 것들
> [[(논문) The FastLanes Compression Layout - Decoding 100 Billion Integers per Second with Scalar Code]]
> - [Decoding billions of integers per second through vectorization](https://onlinelibrary.wiley.com/doi/full/10.1002/spe.2203)

## 란?

- [[Bit Packing, BP (Encoding)|BP]] 를 할 때, 기존에는 [[Patching (Encoding)|Horizontal Bit-packing]] 방식으로 저장하던 것을 [[Single Instruction Multiple Data, SIMD (Arch)|SIMD]] 를 적용하기 쉽도록 layout 을 바꾼 것이다.

## Layout

![[fl_ibp_pack.png]]

- 그래서 bit 를 저장할 때는 위와 같이 저장한다.
- 솔직히 이거 그림만 보면 이해되는 간단한 것이긴 함; 다음의 방식으로 저장된다고 생각하면 된다.
	- Lane 에 align 되도록 bit 들을 저장하기 시작해서
	- 이전에 저장된 bit 옆에다가 저장하되
	- 만약 Lane 에 공간이 부족하면 넘치는 만큼 다음 word 로 넘기기