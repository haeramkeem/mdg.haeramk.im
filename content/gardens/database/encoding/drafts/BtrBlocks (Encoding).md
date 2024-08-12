---
tags:
  - Database
  - db-encoding
---
> [!fail]- 본 글은 #draft 상태입니다.
> - [ ] 내용 정리

- PDE:
	- [isUsable](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/double/Pseudodecimal.cpp#L476-L483)
		- Unique < 10%
- FSST:
	- [isUsable](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/string/Fsst.cpp#L119-L129)
		- Unique < 50% (of not NULL)
		- Total length > FSST_CONFIG_THRESHOLD
	- [expectedCompressionRatio](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/string/Fsst.cpp#L10-L15)
		- `1`
- StringDynDict
	- [isUsable](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/scheme/string/DynamicDictionary.cpp#L586-L605)
		- When FSST is not available
		- Unique < 50% (of not NULL)
- isUsable is called at ([SchemePicker](https://github.com/maxi-k/btrblocks/blob/master/btrblocks/compression/SchemePicker.hpp#L49-L51))

```cpp
  virtual u32 compress(const DOUBLE* src,
                       const BITMAP* nullmap,
                       u8* dest,
                       DoubleStats& stats,
                       u8 allowed_cascading_level) = 0;
```