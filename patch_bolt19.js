const fs = require('fs');
let content = fs.readFileSync('.jules/bolt.md', 'utf8');

const search = `<<<<<<< HEAD
## 2024-10-24 - Optimize array allocations when processing raw GTFS sets
**Learning:** Chaining \`.filter().map()\` inside array to \`Set\` instantiations in data ingest paths (like \`rail-ingest.ts\`) causes the engine to allocate intermediate array structures. A standard \`for\` loop pushing directly to the \`Set\` reduces execution time and garbage collection pressure on large datasets.
**Action:** Replace functional \`.filter().map()\` chains with standard \`for\` loops when instantiating \`Set\` objects from large arrays.

## 2024-09-12 - String Sorting Optimization
**Learning:** Using \`String.prototype.localeCompare\` to sort strictly formatted ASCII strings (like "HH:MM:SS") applies complex I18N collation rules that add noticeable performance overhead.
**Action:** Use simple lexicographical comparison operators (\`a < b ? -1 : a > b ? 1 : 0\`) for much faster sorting when dealing with strictly formatted time strings.

## 2025-05-23 - Optimize array allocations when processing raw GTFS sets in rail ingestion
**Learning:** Chaining \`.filter().map()\` inside large array ingestion paths (like \`rail-ingest.ts\`) causes the engine to allocate massive intermediate array structures before mapping, increasing memory pressure and GC spikes. A standard \`for\` loop pushing directly to the target array executes the filtering/mapping logic in a single fast pass per dataset.
**Action:** Replace functional \`.filter().map()\` chains with standard \`for\` loops when parsing large CSV raw outputs in data ingestion scripts.
=======
## 2026-07-28 - [Refactor] 🧹 Extracted helper functions in sampling.ts
**Learning:** Functions doing complex DB operations combined with in-memory transformations can quickly become unwieldy (like \`aggregateTravelTimes\`). Extracting the distinct logical steps (fetching, grouping, transforming, upserting) into smaller, exported helper functions makes the main function a readable orchestrator.
**Action:** Used \`sed\` or node string replacement via patch file to carefully extract logical blocks while preserving exactly the same logic and tests.
>>>>>>> 0e82328 (🧹 [Refactor] Extract helper functions to simplify aggregateTravelTimes)`;

const replace = `## 2024-10-24 - Optimize array allocations when processing raw GTFS sets
**Learning:** Chaining \`.filter().map()\` inside array to \`Set\` instantiations in data ingest paths (like \`rail-ingest.ts\`) causes the engine to allocate intermediate array structures. A standard \`for\` loop pushing directly to the \`Set\` reduces execution time and garbage collection pressure on large datasets.
**Action:** Replace functional \`.filter().map()\` chains with standard \`for\` loops when instantiating \`Set\` objects from large arrays.

## 2024-09-12 - String Sorting Optimization
**Learning:** Using \`String.prototype.localeCompare\` to sort strictly formatted ASCII strings (like "HH:MM:SS") applies complex I18N collation rules that add noticeable performance overhead.
**Action:** Use simple lexicographical comparison operators (\`a < b ? -1 : a > b ? 1 : 0\`) for much faster sorting when dealing with strictly formatted time strings.

## 2025-05-23 - Optimize array allocations when processing raw GTFS sets in rail ingestion
**Learning:** Chaining \`.filter().map()\` inside large array ingestion paths (like \`rail-ingest.ts\`) causes the engine to allocate massive intermediate array structures before mapping, increasing memory pressure and GC spikes. A standard \`for\` loop pushing directly to the target array executes the filtering/mapping logic in a single fast pass per dataset.
**Action:** Replace functional \`.filter().map()\` chains with standard \`for\` loops when parsing large CSV raw outputs in data ingestion scripts.

## 2026-07-28 - [Refactor] 🧹 Extracted helper functions in sampling.ts
**Learning:** Functions doing complex DB operations combined with in-memory transformations can quickly become unwieldy (like \`aggregateTravelTimes\`). Extracting the distinct logical steps (fetching, grouping, transforming, upserting) into smaller, exported helper functions makes the main function a readable orchestrator.
**Action:** Used \`sed\` or node string replacement via patch file to carefully extract logical blocks while preserving exactly the same logic and tests.`;

if (!content.includes(search)) {
  console.error("Search string not found!");
  process.exit(1);
}

content = content.replace(search, replace);
fs.writeFileSync('.jules/bolt.md', content);
console.log("Resolved conflicts in .jules/bolt.md!");
