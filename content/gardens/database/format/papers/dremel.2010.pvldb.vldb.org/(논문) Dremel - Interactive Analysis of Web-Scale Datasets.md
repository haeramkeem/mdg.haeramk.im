---
tags:
  - database
  - db-format
date: 2025-01-09
aliases:
  - Dremel
---
> [!info] Dremel 링크
> - [논문](https://dl.acm.org/doi/10.14778/1920841.1920886)

## 개요

![[Pasted image 20250109155201.png]]

- VLDB 2010 에 소개된 Dremel 논문을 읽고 정리해 보자.

## Abstract

- *Dremel* 은 Google 에서 사용하는 query engine 으로, read-only nested data 에 대한 분석을 위해 설계된 시스템이다.
	- 여기서 *nested data* 라는 것은 JSON 마냥 schema 의 attribute 안에 또 다른 schema 가 존재하는 형태의 [[Data Model (Database)|Data Model]] 이라고 생각하면 된다.
- 특징은 execution tree 와 columnar data layout 을 결합하여 조단위의 (trillion) row 를 가지는 data 에 대한 aggregation query 를 수 초내에 처리한다고 한다.
- 또한 다수의 CPU 들과 petabyte 단위의 대량의 data 들을 처리할 수 있을 정도로의 scalability 를 가지고, (당시 기준) 많은 Google 의 서비스에서 사용되며 아주 많은 사용자들로부터 검증된 시스템이라고 한다.
- 본 논문에서는 이 *Dremel* 시스템에 대한 architecture 와 implementation 을 소개하고, 이러한 design 이 어떻게 Map-reduce 의 단점을 보완하는지에 대해 설명한다.
- 또한 이러한 시스템을 위한 data format 에 대해 소개하고, 다양한 evaluation 도 수행하여 공개한다.

## 목차

> [!fail] #draft Partial-ready 상태입니다.

- [[3. Data Model (Dremel, VLDB 10)|3. Data Model]]
- [[4. Nested Columnar Storage (Dremel, VLDB 10)|4. Nested Columnar Storage]]