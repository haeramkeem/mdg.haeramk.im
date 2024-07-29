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

## 7. Related Work

### 7.0. *Overview*

> [!tip] [[#7.0. *Overview*|Section 7.0.]] Overview
> - 마찬가지로 논문에는 없는 section 이고, 형식상 주인장이 끼워 넣은 것이다.
> - Column store 과 관련된 것들이 많이 있지만, 여기서는 BtrBlock 과 관련된 애들만 추려서 살펴볼 예정이다.

#### 7.0.1. SQL Server.

#### 7.0.2. DB2 BLU.

#### 7.0.3. SIMD decompression and selective scans.

#### 7.0.4. Compressed data processing in BtrBlocks.

#### 7.0.5. HyPer Data Blocks.

#### 7.0.6. SAP BRPFC.

## 8. Conclusion