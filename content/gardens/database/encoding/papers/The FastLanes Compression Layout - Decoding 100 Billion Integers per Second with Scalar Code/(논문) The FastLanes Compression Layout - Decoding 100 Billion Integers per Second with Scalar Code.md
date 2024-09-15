---
tags:
  - database
  - db-encoding
date: 2024-08-21
---
> [!info] FastLanes 링크
> - [논문](https://dl.acm.org/doi/10.14778/3598581.3598587)
> - [GitHub 코드](https://github.com/cwida/FastLanes)
> - [주인장 논문 발표 자료 (Haeram Kim, 2024-09-14, SNU)]([FastLanes.haeramkim.2024-09-14.pdf](https://1drv.ms/b/s!AnQMW732rqISg-lz0idcPfIPVeRrnw?e=0ypNrU))

## 개요

![[Pasted image 20240821110052.png]]

- VLDB (Very Large Database) 2023 년도에 소개된 FastLanes 논문을 읽고 정리해 보자.

## Abstract

- 이 논문은 [Parquet](https://parquet.apache.org/) 나 [ORC](https://orc.apache.org/) 등의 big data 혹은 columnar data 의 format 을 decompression 속도를 줄임으로서 개선하고자 하고 있다.
- 이때의 핵심 아이디어는:
	1. *Value interleaving* 기술을 확장해 이것을 [[Bit Packing, BP (Encoding)|bit packing (+unpacking)]] 의 기본적인 operation 에서도 사용할 수 있게 하였다.
	2. [[Relation (Relational Model)|Table]] 에서의 tuple 을 0-4-2-6-1-5-3-7 순서로 *Reordering* 해 independency 를 극대화 하여 parallel 하게 실행될 수 있도록 했다고 한다.
		- 저 순서는 논문 저술 시점에 가능한 모든 [[Single Instruction Multiple Data, SIMD (Arch)|SIMD]] lane width 를 고려하여 나온 것이다.
- 이를 위해 1024-bit 의 가상 instruction set (*Virtual 1024-bits instruction set*) 을 정의해 CPU architecture 와 무관하게 성능 향상이 있음을 보였다.
	- 즉, 정의한 instruction 들은 여러 CPU architecture 들이 공통적으로 제공하는 일반 instruction set + SIMD instruction set 들이다.
- 그 결과 SIMD 를 사용하지 않은 (= scalar code) 상황에서도 성능 향상이 있었을 뿐 아니라, scalar version 또한 modern compiler 에 의해 자동으로 SIMD 가 적용될 수 있게 하여 특정 platform 이나 SIMD intrinsic 에 구애받지 않도록 구현했다.
	- 거진 40개 이상의 값들을 1 CPU cycle 로 decoding 이 가능하다.

## 목차

- [[1. Introduction (FastLanes, VLDB 23)|1. Introduction]]
- [[2. FastLanes (FastLanes, VLDB 23)|2. FastLanes]]
- [[3. Evaluation (FastLanes, VLDB 23)|3. Evaluation]]
- [[4. Related Work (FastLanes, VLDB 23)|4. Related Work]]
- [[5. Conclusion and Future Work (FastLanes, VLDB 23)|5. Conclusion and Future Work]]