
## 2024-06-02 - Bulk operations in Cloudflare D1
**Learning:** Cloudflare D1 efficiently handles multiple independent queries in a single network roundtrip using \`db.batch(statements)\`. It's an excellent way to replace N+1 nested loop queries with a single batch request without having to use complex SQL \`IN\` clauses or temporary tables.
**Action:** When extracting data in a loop where multiple parameters vary (e.g. \`route\` and \`stopId\`), aggregate the parameters, deduplicate them into an array, and prepare a statement for each using \`db.prepare(...).bind(...)\`. Pass the array of statements to \`db.batch()\`. This massively reduces latency.
