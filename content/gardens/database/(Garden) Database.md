---
date: 2024-07-29
---
## 개요

- 주인장 김해람씨는 2024년 3월 11일 중대한 과오를 저질러 Cloud Engineer 에서 DB 분야로 전직하게 된다. 그 결과 [돌](https://github.com/facebook/rocksdb) 을 [굴리게 되는데..](https://en.wikipedia.org/wiki/The_Myth_of_Sisyphus)

## 작물들

### 오리지널 시리즈

- [[(CMU 15-445) Intro. to Database Systems]]
- [[(CMU 15-721) Advanced Database Systems]]
- [[(SNU GSDS) Bigdata and Knowledge Management Systems 1]]
- [[(SNU GSDS) Bigdata and Knowledge Management Systems 2]]

### Common

- 스토리
	- [[Database - 어떤 언어가 하탈까?]]
- 용어집
	- [[Database Management System, DBMS (Database)|Database Management System]]

### Benchmark

- TPC
	- [[TPC-C (Database Benchmark)|TPC-C]]
	- [[TPC-H (Database Benchmark)|TPC-H]]

### Data Model

- [[Data Model (Database)|Data Model]]
- 용어집
	- [[Cluster, Database (Data Model)|Cluster, Database]]
	- [[Data Manipulation Language, DML (Data Model)|Data Manipulation Language, DML]]
	- [[Schema, Namespace (Data Model)|Schema, Namespace]]
	- [[Document Data Model (Data Model)|Document Data Model]]
	- [[Multi-Dimensional Data Model (Data Model)|Multi-Dimensional Data Model]]
		- [[Cube (Multi-dimensional Model)|Cube]]
		- [[Dimension, Dimension Table (Multi-dimensional Model)|Dimension, Dimension Table]]
		- [[Measure, Fact Table (Multi-dimensional Model)|Measure, Fact Table]]
		- [[Snowflake Schema (Multi-dimensional Model)|Snowflake Schema]]
		- [[Star Schema (Multi-dimensional Model)|Star Schema]]
	- [[Relational Data Model (Data Model)|Relational Data Model]]
		- [[Foreign Key, FK (Relational Model)|Foreign Key, FK]]
		- [[Private Key, PK (Relational Model)|Private Key, PK]]
		- [[Record (Relational Model)|Record]]
		- [[Relation (Relational Model)|Relation]]

### Encoding

- 용어집
	- [[Bit Packing, BP (Encoding)|Bit Packing, BP]]
	- [[Bitmap (Encoding)|Bitmap]]
	- [[Delta Coding (Encoding)|Delta Coding]]
	- [[Dictionary Encoding (Encoding)|Dictionary Encoding]]
	- [[Elias Gamma Coding (Encoding)|Elias Gamma Coding]]
	- [[Fast Static Symbol Table, FSST (Encoding)|Fast Static Symbol Table, FSST]]
	- [[FastLanes (Encoding)|FastLanes]]
	- [[Frame Of Reference, FOR (Encoding)|Frame Of Reference, FOR]]
	- [[Huffman Coding (Encoding)|Huffman Coding]]
	- [[Interleaved Bit-Packing (Encoding)|Interleaved Bit-Packing]]
	- [[Little Endian Base 128, LEB128 (Encoding)|Little Endian Base 128, LEB128]]
	- [[Patching, Mostly Encoding (Encoding)|Patching, Mostly Encoding]]
	- [[4. Pseudodecimal encoding (BtrBlocks, SIGMOD 23)|Pseudodecimal Encoding, PDE]] (redirect [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes|BtrBlocks]])
	- [[Prefix Code (Encoding)|Prefix Code]]
	- [[Roaring Bitmap (Encoding)|Roaring Bitmap]]
	- [[Run Length Encoding, RLE (Encoding)|Run Length Encoding, RLE]]
	- [[Zig-Zag (Encoding)|Zig-Zag Encoding]]
- 논문들
	- [[(논문) The FastLanes Compression Layout - Decoding 100 Billion Integers per Second with Scalar Code|The FastLanes Compression Layout - Decoding 100 Billion Integers per Second with Scalar Code (VLDB'23)]]

### Format

- 용어집
	- [[BtrBlocks (Database Format)|BtrBlocks]]
	- [[4. Nested Columnar Storage (Dremel, VLDB 10)|Definition Level]] (redirect [[(논문) Dremel - Interactive Analysis of Web-Scale Datasets|Dremel]])
	- [[Partition Attribute Across, PAX (Database Format)|Partition Attribute Across, PAX]]
	- [[Parquet (Database Format)|Parquet]]
	- [[4. Nested Columnar Storage (Dremel, VLDB 10)|Repetition Level]] (redirect [[(논문) Dremel - Interactive Analysis of Web-Scale Datasets|Dremel]])
- 논문들
	- [[(논문) BtrBlocks - Efficient Columnar Compression for Data Lakes|BtrBlocks - Efficient Columnar Compression for Data Lakes (SIGMOD'23)]]
	- [[(논문) Dremel - Interactive Analysis of Web-Scale Datasets|Dremel - Interactive Analysis of Web-Scale Datasets (VLDB'10)]]

### Index

- 용어들
	- [[2. Bw-Tree Essentials (OpenBwTree, SIGMOD 18)|Buzz Word Tree, Bw-Tree]] (redirect [[(논문) Building a Bw-Tree Takes More Than Just Buzz Words|OpenBwTree]])
- 논문들
	- [[(논문) Building a Bw-Tree Takes More Than Just Buzz Words|Building a Bw-Tree Takes More Than Just Buzz Words (SIGMOD'18)]]

### Modern

- 용어집
	- [[Data Cube (Modern Database)|Data Cube]]
	- [[Data Lake, Data Lakehouse (Modern Database)|Data Lake, Data Lakehouse]]
	- [[Data Warehouse (Modern Database)|Data Warehouse]]
	- [[Extract-Transform-Load, ETL (Modern Database)|Extract-Transform-Load, ETL]]
	- [[Hybrid Transactional and Analytical Processing, HTAP (Modern Database)|Hybrid Transactional and Analytical Processing, HTAP]]
	- [[On-Line Analytical Processing, OLAP (Modern Database)|On-Line Analytical Processing, OLAP]]
	- [[On-Line Transactional Processing, OLTP (Modern Database)|On-Line Transactional Processing, OLTP]]

### Query Plan

- 논문들
	- [[(논문) Rethink Query Optimization in HTAP Databases|Rethink Query Optimization in HTAP Databases (SIGMOD'24)]]

### Recovery

- 용어집
	- [[Algorithms for Recovery and Isolation Exploiting Semantics, ARIES (Database Recovery)|Algorithms for Recovery and Isolation Exploiting Semantics, ARIES]]
	- [[Compensation Log Record, CLR (Database Recovery)|Compensation Log Record, CLR]]
	- [[FORCE, NO_FORCE Policy (Database Recovery)|FORCE, NO_FORCE Policy]]
	- [[Log (Database Recovery)|Log]]
	- [[Log Message Schemes (Database Recovery)|Physiological Logging]]
	- [[STEAL, NO_STEAL Policy (Database Recovery)|STEAL, NO_STEAL Policy]]
	- [[Write Ahead Log, WAL (Database Recovery)|Write Ahead Log, WAL]]
- 논문들
	- [[Border-Collie - A Wait-free, Read-optimal Algorithm for Database Logging on Multicore Hardware (SIGMOD'19)]]
	- [[Scalable Database Logging for Multicores (VLDB'18)]]

### Transaction

- 용어집
	- [[Transaction, ACID (Database)|Transaction, ACID]]
	- [[Multiversion Concurrency Control, MVCC (Database Transaction)|Multiversion Concurrency Control, MVCC]]
- 논문들
	- [[DIVA - Making MVCC Systems HTAP-Friendly (SIGMOD'22)|DIVA - Making MVCC Systems HTAP-Friendly (SIGMOD'22)]]
	- [[A Scalable Lock Manager for Multicores (SIGMOD'13)]]

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

- [[Postgres Code Reference|Code reference]]
- 스토리
	- [[Postgres with Parquet - Postgres 에서 Parquet 사용해보기|Postgres 에서 Parquet 사용해보기]]
	- [[PostgreSQL Build from Source Guide - PostgreSQL 디버깅을 위한 소스코드 빌드 가이드|PostgreSQL 디버깅을 위한 소스코드 빌드 가이드]]
- 용어집
	- [[Background Writer (PostgreSQL)|Background Writer]]
	- [[Postgres Server, Postmaster (PostgreSQL)|Postgres Server, Postmaster]]
	- [[Shared Buffer (PostgreSQL)|Shared Buffer]]
	- [[Tablespace (PostgreSQL)|Tablespace]]

#### RocksDB

- 용어집
	- [[Leveled Compaction (RocksDB)|Leveled Compaction]]
	- [[LSM Tree (RocksDB)|LSM Tree]]
	- [[Memtable (RocksDB)|Memtable]]
	- [[Static Sorted Table, SST (RocksDB)|Static Sorted Table, SST]]
