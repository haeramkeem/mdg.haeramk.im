---
tags:
  - Database
  - 논문
date: 2024-07-17
---
> [!info] 본 글은 논문 [BtrBlocks - Efficient Columnar Compression for Data Lakes (SIGMOD '23)](https://dl.acm.org/doi/10.1145/3589263) 를 읽고 정리한 글입니다.

> [!info] 별도의 명시가 없는 한, 본 글의 모든 그림은 위 논문에서 가져왔습니다.

> [!info]- 목차 - 진짜 너무 길어서 section 별로 식물을 쪼갰습니다.
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (1. Abstract, Intro)|1. Abstract, Intro]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (2. Background)|2. Background]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (3. Scheme selection and compression)|3. Scheme selection and compression]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (4. Pseudodecimal encoding)|4. Pseudodecimal encoding]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (5. Fast decompression)|5. Fast decompression]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (6. Evaluation)|6. Evaluation]]
> - [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes (7. Related work and conclusion)|7. Related work and conclusion (현재 글)]]

> [!fail] 본 문서는 아직 #draft 상태입니다. 읽을 때 주의해 주세요.