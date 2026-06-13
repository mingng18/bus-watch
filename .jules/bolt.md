## 2025-06-11 - Fast CSV Parsing
**Learning:** Manual index-based parsing (`indexOf` and `substring`) inside `csv-parser` provides a significant performance boost over regular expression or character-by-character loops, particularly for unquoted CSV fields, as it avoids generating numerous intermediate objects and multiple memory allocations.
**Action:** When parsing large repetitive datasets, implement a fast-path that leverages native string searching before falling back to full structural parsing.
