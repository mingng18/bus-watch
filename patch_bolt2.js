const fs = require('fs');
const file = '.jules/bolt.md';
let code = fs.readFileSync(file, 'utf8');

const search = `<<<<<<< HEAD
## 2026-09-27 - [Performance] ⚡ Eliminate array allocation in .includes() checks
**Learning:** Using \`[...].includes(value)\` to check against a small set of constants creates a new array in memory every time it's evaluated, creating unnecessary garbage collection overhead in hot paths.
**Action:** Replace inline array \`.includes()\` checks with direct equality comparisons (e.g., \`val === "A" || val === "B"\`) or extract the array to a module-level \`Set\` or constant to eliminate per-execution allocation.
=======
## 2025-05-24 - Consolidate multiple Date instantiations
**Learning:** Instantiating \`new Date()\` multiple times within the same function scope (like in \`getDeparturesTowardDestination\` and \`getStationSchedule\`) creates redundant object allocations, GC pressure, and can introduce microscopic time drift between the instantiations if one is used for filtering and another for calculation.
**Action:** When multiple operations in the same scope require the current time, consolidate them by creating a single shared \`const now = new Date();\` variable and passing it to all required functions. This prevents redundant allocations and guarantees time consistency across the operations.

## 2024-09-25 - Avoid Regex extraction loops for large XML parsing
**Learning:** Using \`RegExp.exec()\` combined with \`.slice()\` and \`.toLowerCase()\` inside a loop to extract data from a large string (like a 50k+ node XML sitemap) causes massive intermediate string allocations and severe garbage collection pressure.
**Action:** Convert the entire document to lowercase once outside the loop and use manual \`indexOf\` bounds searching instead of Regex to locate nodes, which reduced processing time by ~45%.
>>>>>>> origin/bolt-alerts-perf-9576834222540883383`;

const replace = `## 2026-09-27 - [Performance] ⚡ Eliminate array allocation in .includes() checks
**Learning:** Using \`[...].includes(value)\` to check against a small set of constants creates a new array in memory every time it's evaluated, creating unnecessary garbage collection overhead in hot paths.
**Action:** Replace inline array \`.includes()\` checks with direct equality comparisons (e.g., \`val === "A" || val === "B"\`) or extract the array to a module-level \`Set\` or constant to eliminate per-execution allocation.

## 2025-05-24 - Consolidate multiple Date instantiations
**Learning:** Instantiating \`new Date()\` multiple times within the same function scope (like in \`getDeparturesTowardDestination\` and \`getStationSchedule\`) creates redundant object allocations, GC pressure, and can introduce microscopic time drift between the instantiations if one is used for filtering and another for calculation.
**Action:** When multiple operations in the same scope require the current time, consolidate them by creating a single shared \`const now = new Date();\` variable and passing it to all required functions. This prevents redundant allocations and guarantees time consistency across the operations.

## 2024-09-25 - Avoid Regex extraction loops for large XML parsing
**Learning:** Using \`RegExp.exec()\` combined with \`.slice()\` and \`.toLowerCase()\` inside a loop to extract data from a large string (like a 50k+ node XML sitemap) causes massive intermediate string allocations and severe garbage collection pressure.
**Action:** Convert the entire document to lowercase once outside the loop and use manual \`indexOf\` bounds searching instead of Regex to locate nodes, which reduced processing time by ~45%.`;

if (code.includes(search)) {
  fs.writeFileSync(file, code.replace(search, replace));
  console.log('Patched bolt.md');
} else {
  console.log('Search string not found in bolt.md');
}
