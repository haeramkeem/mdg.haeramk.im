---
tags:
  - database
  - db-index
date: 2025-11-17
title: "(논문) B-Trees Are Back: Engineering Fast and Pageable NodeLayouts"
---
> [!info] B-Trees Are Back 링크
> - [논문](https://dl.acm.org/doi/10.1145/3709664)
> - [주인장 논문 발표 자료 (Haeram Kim, Nov 21 2025, SNU)](https://1drv.ms/b/c/12a2aef6bd5b0c74/IQBPwWCJGUUXQYNBNGASn29cAZNyYtY1ooQ_tfBAFVO7viA?e=Cz6K6a)

## 개요

![[Pasted image 20251117142013.png]]

- SIGMOD (Proc. Mgmt. of Data) 2025 년도에 소개된 B-Trees Are Back 논문을 읽고 정리해 보자.

## Abstract

- Main memory 의 크기와 dataset 의 크기가 점점 커지면서, 대부분의 [[Transaction (Database)|transaction]] 들은 memory 에서 처리하되, memory 가 부족해지면 flash storage 로 swap 하는 디자인이 힘을 얻고 있다.
- 따라서 이런 hybrid 한 구조에서는 [[Slotted Page (Database Format)|page layout]] 를 사용하는 [[B+ Tree (Database Index)|B+ Tree]] 가 적합하다.
- 이러한 B+ Tree 는 지금까지 연구가 많이 되어 왔지만, 대부분의 연구들은 record 가 fixed-size 라고 가정하고 진행되어 왔다.
	- 이러한 가정은, 당연하게도, 실제 production 환경이랑은 많이 다르다.
- 이 논문에서는 일단 variable-sized 를 지원하는 page 와 관련된 6개의 optimization 에 대해 소개하고, evaluation 을 통해 이들을 어떻게 적용해야 하는지에 대한 guide 를 제공한다.
- 또한, 이런 page layout 들을 adaptive 하게 선택하는 새로운 알고리즘에 대해 소개하고, 이 알고리즘을 적용한 B+ Tree 는 in-memory optimized index 에 비해 경쟁력이 있다는 것도 보여준다.
- 즉, 이 논문에서는 optimization 이 잘 된 B+ Tree 는 in-memory index 와 유사한 성능을 보여주면서도 out-of-memory 로도 사용할 수 있다는 것을 보여준다.

## 목차

> [!fail] #draft 나중에 정리할 예정입니다.