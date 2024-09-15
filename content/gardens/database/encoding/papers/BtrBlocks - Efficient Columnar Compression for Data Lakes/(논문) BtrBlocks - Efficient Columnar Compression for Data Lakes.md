---
tags:
  - database
  - db-encoding
date: 2024-08-09
---
> [!info] BtrBlocks 링크
> - [논문](https://dl.acm.org/doi/10.1145/3589263)
> - [GitHub](https://github.com/maxi-k/btrblocks)
> - [주인장 논문 발표 영상 (Haeram Kim, Aug 10, 2024)](https://www.youtube.com/watch?v=WrKEhlzo3kU)
> - [주인장 논문 발표 자료 (Haeram Kim, Aug 10, 2024, SNU)]([BtrBlocks.haeramkim.2024-08-10.pdf](https://1drv.ms/b/s!AnQMW732rqISkzjzrm8y8LHWUhW9?e=fYUdsW))

## 개요

![[Pasted image 20240809101447.png]]

- SIGMOD (Proc. Mgmt. of Data) 2023 년도에 소개된 BtrBlock 논문을 읽고 정리해 보자.
- 핵심 로직만 짚은 버전은 [[BtrBlocks (Encoding)|여기]] 에 있다.

## 목차

- [[1. Abstract, Intro (BtrBlocks, SIGMOD 23)|1. Abstract, Intro]]
- [[2. Background (BtrBlocks, SIGMOD 23)|2. Background]]
- [[3. Scheme selection and compression (BtrBlocks, SIGMOD 23)|3. Scheme selection and compression]]
- [[4. Pseudodecimal encoding (BtrBlocks, SIGMOD 23)|4. Pseudodecimal encoding]]
- [[5. Fast decompression (BtrBlocks, SIGMOD 23)|5. Fast decompression]]
- [[6. Evaluation (BtrBlocks, SIGMOD 23)|6. Evaluation]]
- [[7. Related work and conclusion (BtrBlocks, SIGMOD 23)|7. Related work and conclusion]]