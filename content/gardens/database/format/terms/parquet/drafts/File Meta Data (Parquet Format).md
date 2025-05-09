---
tags:
  - database
  - db-format
  - db-parquet
  - draft
aliases:
  - FileMetaData
  - File Meta Data
---
> [!info] 코드 위치
> - Line: `1106`
> - Link: [struct FileMetaData](https://github.com/apache/parquet-format/blob/apache-parquet-format-2.10.0/src/main/thrift/parquet.thrift#L1103-L1163)

## Structure

```c
/**
 * Description for file metadata
 */
struct FileMetaData {
	/** Version of this file **/
	1: required i32 version

	/** Parquet schema for this file.  This schema contains metadata for all the columns.
	* The schema is represented as a tree with a single root.  The nodes of the tree
	* are flattened to a list by doing a depth-first traversal.
	* The column metadata contains the path in the schema for that column which can be
	* used to map columns to nodes in the schema.
	* The first element is the root **/
	2: required list<SchemaElement> schema;

	/** Number of rows in this file **/
	3: required i64 num_rows

	/** Row groups in this file **/
	4: required list<RowGroup> row_groups

	/** Optional key/value metadata **/
	5: optional list<KeyValue> key_value_metadata

	/** String for application that wrote this file.  This should be in the format
	* <Application> version <App Version> (build <App Build Hash>).
	* e.g. impala version 1.0 (build 6cf94d29b2b7115df4de2c06e2ab4326d721eb55)
	**/
	6: optional string created_by

	/**
	* Sort order used for the min_value and max_value fields in the Statistics
	* objects and the min_values and max_values fields in the ColumnIndex
	* objects of each column in this file. Sort orders are listed in the order
	* matching the columns in the schema. The indexes are not necessary the same
	* though, because only leaf nodes of the schema are represented in the list
	* of sort orders.
	*
	* Without column_orders, the meaning of the min_value and max_value fields
	* in the Statistics object and the ColumnIndex object is undefined. To ensure
	* well-defined behaviour, if these fields are written to a Parquet file,
	* column_orders must be written as well.
	*
	* The obsolete min and max fields in the Statistics object are always sorted
	* by signed comparison regardless of column_orders.
	*/
	7: optional list<ColumnOrder> column_orders

	/** 
	* Encryption algorithm. This field is set only in encrypted files
	* with plaintext footer. Files with encrypted footer store algorithm id
	* in FileCryptoMetaData structure.
	*/
	8: optional EncryptionAlgorithm encryption_algorithm

	/** 
	* Retrieval metadata of key used for signing the footer. 
	* Used only in encrypted files with plaintext footer. 
	*/ 
	9: optional binary footer_signing_key_metadata
}
```

- `version`: File 의 버전
- `schema`
- `row_groups`
- `key_value_metadata`
- `created_by`
- `column_orders`
- `encryption_algorithm`
- `footer_signing_key_metadata`