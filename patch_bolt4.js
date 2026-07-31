const fs = require('fs');
let content = fs.readFileSync('.jules/bolt.md', 'utf8');

const search = `<<<<<<< HEAD
## 2024-07-29 - [Performance] ⚡ Optimize Map allocation and garbage collection
**Learning:** Reconstructing GTFS shapes using chained methods like \`Array.from(new Set(arr.map(...)))\` and \`Array.from(groups.entries()).filter().map()\` inside heavily accessed endpoints causes severe CPU and memory allocation overhead.
**Action:** Replace functional array chaining with standard \`for\` loops inside endpoints rendering complex GTFS relationships (like \`shapes\` extraction). Pre-instantiate target result arrays and push directly to them.
=======
## 2026-07-28 - [Refactor] 🧹 Extracted helper functions in sampling.ts
**Learning:** Functions doing complex DB operations combined with in-memory transformations can quickly become unwieldy (like \`aggregateTravelTimes\`). Extracting the distinct logical steps (fetching, grouping, transforming, upserting) into smaller, exported helper functions makes the main function a readable orchestrator.
**Action:** Used \`sed\` or node string replacement via patch file to carefully extract logical blocks while preserving exactly the same logic and tests.
>>>>>>> 60f0bfd (🧹 [Refactor] Extract helper functions to simplify aggregateTravelTimes)`;

const replace = `## 2024-07-29 - [Performance] ⚡ Optimize Map allocation and garbage collection
**Learning:** Reconstructing GTFS shapes using chained methods like \`Array.from(new Set(arr.map(...)))\` and \`Array.from(groups.entries()).filter().map()\` inside heavily accessed endpoints causes severe CPU and memory allocation overhead.
**Action:** Replace functional array chaining with standard \`for\` loops inside endpoints rendering complex GTFS relationships (like \`shapes\` extraction). Pre-instantiate target result arrays and push directly to them.

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
