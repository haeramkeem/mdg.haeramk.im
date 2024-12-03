---
tags:
  - database
  - db-format
  - terms
  - db-parquet
aliases:
  - Parquet
date: 2024-12-03
---
> [!info]- 참고한 것들
> - [공홈](https://parquet.apache.org/docs/)

## 파티 퀘스트

![[Pasted image 20241203105916.png]]

- 한동안 Parquet file format 을 보다보니 광고도 이런게 뜬다.
- Parquet 는 파티 퀘스트가 아니고 Apache 에서 관리하는 [[Partition Attribute Across, PAX (Database Format)|PAX]] 데이터 포맷을 일컫는다.
	- 즉, 몇개의 row 들을 모아 row group 을 만들고, 그 안에서는 columnar 로 저장되는 형식인 것.
- PAX 인 만큼 columnar layout 의 이점을 누릴 수 있다.
	- [[Run Length Encoding, RLE (Encoding)|RLE]] 나 [[Dictionary Encoding (Encoding)|DICT]] 같은 encoding 으로 파일 크기를 크게 줄여주기도 하고
	- [[On-Line Analytical Processing, OLAP (Modern Database)|OLAP]] query 에서 원하는 column 들만 읽어갈 수 있게 해준다.
- 여기서는 전체적인 layout 만 살펴보고, 구체적인 spec 은 아래 작물들에서 다룬다.
	- [[struct ColumnChunk (Parquet Format)]]
	- [[struct FileMetaData (Parquet Format)]]
	- [[struct RowGroup (Parquet Format)]]

## Layout Overview

![[Pasted image 20241203110305.png]]

- 왼쪽이 table 을 나타낸 것이고, 오른쪽은 이런 table 이 저장되는 Parquet file format 을 보여준다.
- 여기서 몇개의 row 들을 묶어 [[struct RowGroup (Parquet Format)|struct RowGroup (Parquet Format)]] 이라는 logical unit 으로 묶는다.
	- "몇개" 인지는 명확한 기준은 없다. 데이터의 크기에 따라 몇개의 row 가 담길지 결정되는데, 이 *Row Group* 의 크기는 configurable 하다.
	- 대략 1GB 를 권장한다고 한다.
- 그리고 그 안에서는 column 별로 [[struct ColumnChunk (Parquet Format)|struct ColumnChunk (Parquet Format)]] 라는 logical unit 단위로 묶이게 된다.
	- 이놈 단위로 파일에 sequential 하게 저장된다.
	- 즉, 한 *Row Group* 에 대한 첫번째 column 의 *Column Chunk* 가 sequential 하게 저장되고, 두번째 column 의 *Column Chunk* 가 저장되는 형식인 것.
- *Column Chunk* 들의 뒤에는 file 의 전체 metadata ([[struct FileMetaData (Parquet Format)|struct FileMetaData (Parquet Format)]]) 가 달리고, 그 뒤에 이 metada 의 크기가 담기며, 이 묶음 앞뒤로 Magic number (*MG*) 가 담기게 된다.