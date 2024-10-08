---
date: 2024-07-29
---
## 개요

- 주인장 김해람씨는 2024년 3월 11일 중대한 과오를 저질러 Cloud Engineer 에서 DB 분야로 전직하게 된다. 그 결과 [돌](https://github.com/facebook/rocksdb) 을 [굴리게 되는데..](https://en.wikipedia.org/wiki/The_Myth_of_Sisyphus)

## 작물들

### 오리지널 시리즈

- [[(CMU 15-445) Intro. to Database Systems]]
- [[(CMU 15-721) Advanced Database Systems]]
- [[(SNU GSDS) Bigdata and Knowledge Management Systems 01]]

### Common

- 스토리
	- [[Database - 어떤 언어가 하탈까?]]
- 용어집
	- [[Database Management System, DBMS (Database)|Database Management System]]
	- [[Transaction, ACID (Database)|Transaction, ACID]]

### Concurrency

- 논문들
	- [[(논문) DIVA - Making MVCC Systems HTAP-Friendly|DIVA - Making MVCC Systems HTAP-Friendly (SIGMOD'22)]]

### Benchmark

- TPC
	- [[TPC-C (DB Benchmark)|TPC-C]]
	- [[TPC-H (DB Benchmark)|TPC-H]]

### Data Model

- [[Data Model (Database)|Data Model]]
- 용어집
	- [[Data Manipulation Language, DML (Database)|Data Manipulation Language, DML]]
	- [[Schema (Database)|Schema]]
	- [[Document Data Model (Database)|Document Data Model]]
	- [[Multi-Dimensional Data Model (Database)|Multi-Dimensional Data Model]]
		- [[Cube (Multi-dimensional Model)|Cube]]
		- [[Dimension, Dimension Table (Multi-dimensional Model)|Dimension, Dimension Table]]
		- [[Measure, Fact Table (Multi-dimensional Model)|Measure, Fact Table]]
		- [[Snowflake Schema (Multi-dimensional Model)|Snowflake Schema]]
		- [[Star Schema (Multi-dimensional Model)|Star Schema]]
	- [[Relational Data Model (Database)|Relational Data Model]]
		- [[Foreign Key, FK (Relational Model)|Foreign Key, FK]]
		- [[Private Key, PK (Relational Model)|Private Key, PK]]
		- [[Relation (Relational Model)|Relation]]

### Encoding

- 용어집
	- [[Bit Packing, BP (Encoding)|Bit Packing, BP]]
	- [[Bitmap (Encoding)|Bitmap]]
	- [[BtrBlocks (Encoding)|BtrBlocks]]
	- [[Delta Coding (Encoding)|Delta Coding]]
	- [[Dictionary Encoding (Encoding)|Dictionary Encoding]]
	- [[Elias Gamma Coding (Encoding)|Elias Gamma Coding]]
	- [[Fast Static Symbol Table, FSST (Encoding)|Fast Static Symbol Table, FSST]]
	- [[FastLanes (Encoding)|FastLanes]]
	- [[Frame Of Reference, FOR (Encoding)|Frame Of Reference, FOR]]
	- [[Huffman Coding (Encoding)|Huffman Coding]]
	- [[Interleaved Bit-Packing (Encoding)|Interleaved Bit-Packing]]
	- [[Patching, Mostly Encoding (Encoding)|Patching, Mostly Encoding]]
	- [[4. Pseudodecimal encoding (BtrBlocks, SIGMOD 23)|Pseudodecimal Encoding, PDE]] (redirect [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes|BtrBlocks]])
	- [[Prefix Code (Encoding)|Prefix Code]]
	- [[Roaring Bitmap (Encoding)|Roaring Bitmap]]
	- [[Run Length Encoding, RLE (Encoding)|Run Length Encoding, RLE]]
- 논문들
	- [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes|BtrBlocks - Efficient Columnar Compression for Data Lakes (SIGMOD'23)]]
	- [[(논문) The FastLanes Compression Layout - Decoding 100 Billion Integers per Second with Scalar Code|The FastLanes Compression Layout - Decoding 100 Billion Integers per Second with Scalar Code (VLDB'23)]]

### Index

- 용어들
	- [[2. Bw-Tree Essentials (OpenBwTree, SIGMOD 18)|Buzz Word Tree, Bw-Tree]] (redirect [[(논문) Building a Bw-Tree Takes More Than Just Buzz Words|OpenBwTree]])
	- [[4. Component Optimization (OpenBwTree, SIGMOD 18)|Epoch-based GC]] (redirect [[(논문) Building a Bw-Tree Takes More Than Just Buzz Words|OpenBwTree]])
- 논문들
	- [[(논문) Building a Bw-Tree Takes More Than Just Buzz Words|Building a Bw-Tree Takes More Than Just Buzz Words (SIGMOD'18)]]

### Modern

- 용어집
	- [[Data Cube (Database)|Data Cube]]
	- [[Data Lake, Data Lakehouse (Database)|Data Lake, Data Lakehouse]]
	- [[Data Warehouse (Database)|Data Warehouse]]
	- [[Extract-Transform-Load, ETL (Database)|Extract-Transform-Load, ETL]]
	- [[Hybrid Transactional and Analytical Processing, HTAP (Database)|Hybrid Transactional and Analytical Processing, HTAP]]
	- [[On-Line Analytical Processing, OLAP (Database)|On-Line Analytical Processing, OLAP]]
	- [[On-Line Transactional Processing, OLTP (Database)|On-Line Transactional Processing, OLTP]]

### Recovery

- 용어집
	- [[FORCE, NO_FORCE (Database)|FORCE, NO_FORCE]]
	- [[Logical Logging (Database)|Logical Logging]]
	- [[Physical Logging (Database)|Physical Logging]]
	- [[Physiological Logging (Database)|Physiological Logging]]
	- [[Redo Log (Database)|Redo Log]]
	- [[STEAL, NO_STEAL (Database)|STEAL, NO_STEAL]]
	- [[Undo Log (Database)|Undo Log]]

### DBMS

> [!info] 범위
> - 여기에는 DBMS-specific 한 내용을 담을거임

#### Elasticsearch

- 스토리
	- [[TL;DR ElasticSearch - 엘라스틱서치 간단하게 시작하기|엘라스틱서치 간단하게 시작하기]]
	- [[ElasticSearch Architecture - 엘라스틱서치 아키텍처|엘라스틱서치 아키텍처]]
	- [[Read & Write Operation in ElasticSearch - 엘라스틱서치 RW 과정 정리|엘라스틱서치 RW 과정 정리]]
- 용어집
	- [[_doc (ElasticSearch)|_doc]]
	- [[_id (ElasticSearch)|_id]]
	- [[Apache Lucene|Lucene]]
	- [[Cluster (ElasticSearch)|Cluster]]
	- [[Coordinating Node (ElasticSearch)|Coordinating Node]]
	- [[Data Node (ElaticSearch)|Data Node]]
	- [[Document (ElasticSearch)|Document]]
	- [[Flush (ElasticSearch)|Flush]]
	- [[Index (ElasticSearch)|Index]]
	- [[Indexing (ElasticSearch)|Indexing]]
	- [[Master Node (ElasticSearch)|Master Node]]
	- [[Node (ElasticSearch)|Node]]
	- [[Primary Shard (ElasticSearch)|Primary Shard]]
	- [[Refresh (ElasticSearch)|Refresh]]
	- [[Replication Shard (ElasticSearch)|Replication Shard]]
	- [[Shard (ElasticSearch)|Shard]]
	- [[Type (ElasticSearch)|Type]]
- Lucene
	- [[Segment (Lucene)]]
	- [[Read API (Lucene)]]
	- [[Merge (Lucene)]]
	- [[Index (Lucene)]]
	- [[Flush API (Lucene)]]
	- [[Commit API (Lucene)]]

#### PostgreSQL

- 용어집
	- [[Background Writer (PostgreSQL)|Background Writer]]
	- [[Shared Buffer (PostgreSQL)|Shared Buffer]]

#### RocksDB

- 용어집
	- [[Leveled Compaction (RocksDB)|Leveled Compaction]]
	- [[LSM Tree (RocksDB)|LSM Tree]]
	- [[Memtable (RocksDB)|Memtable]]
	- [[Static Sorted Table, SST (RocksDB)|Static Sorted Table, SST]]
