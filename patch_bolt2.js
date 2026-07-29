const fs = require('fs');
let content = fs.readFileSync('.jules/bolt.md', 'utf8');

const search = `<<<<<<< HEAD
## 2026-07-28 - [Refactor] 🧹 Extracted helper functions in sampling.ts
**Learning:** Functions doing complex DB operations combined with in-memory transformations can quickly become unwieldy (like \`aggregateTravelTimes\`). Extracting the distinct logical steps (fetching, grouping, transforming, upserting) into smaller, exported helper functions makes the main function a readable orchestrator.
**Action:** Used \`sed\` or node string replacement via patch file to carefully extract logical blocks while preserving exactly the same logic and tests.
=======
## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for Haversine Calculations
**Learning:** In Cloudflare Workers where execution time and CPU cycles are highly constrained, large loops (e.g., iterating through thousands of bus stops or vehicles) that calculate geographic distance using the Haversine formula can be a significant bottleneck due to expensive trigonometric math (\`Math.sin\`, \`Math.cos\`, \`Math.atan2\`).
**Action:** When filtering objects by geographic radius, implement a spatial pre-filter using a fast bounding box approximation before invoking the precise distance calculation. Use simple float comparisons (\`<\`, \`>\`) to aggressively prune out-of-bounds coordinates early, drastically reducing trigonometric overhead.

## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for inner loops
**Learning:** Even if a bounding box pre-filter is applied in outer functions or loops, failing to apply it inside inner nested loops over large datasets (like checking every \`vehicle\` position for every nearby \`stop\`) can reintroduce the trigonometric bottleneck of \`haversineDistance\`.
**Action:** When iterating over coordinates in hot nested loops, ensure bounding box pre-filtering using \`getBoundingBox\` and arithmetic checks are applied directly inside the tightest loop where the geographic comparison occurs, effectively bypassing \`haversineDistance\` entirely for out-of-bounds items.
>>>>>>> 2733ba9 (Update bolt.md)`;

const replace = `## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for Haversine Calculations
**Learning:** In Cloudflare Workers where execution time and CPU cycles are highly constrained, large loops (e.g., iterating through thousands of bus stops or vehicles) that calculate geographic distance using the Haversine formula can be a significant bottleneck due to expensive trigonometric math (\`Math.sin\`, \`Math.cos\`, \`Math.atan2\`).
**Action:** When filtering objects by geographic radius, implement a spatial pre-filter using a fast bounding box approximation before invoking the precise distance calculation. Use simple float comparisons (\`<\`, \`>\`) to aggressively prune out-of-bounds coordinates early, drastically reducing trigonometric overhead.

## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for inner loops
**Learning:** Even if a bounding box pre-filter is applied in outer functions or loops, failing to apply it inside inner nested loops over large datasets (like checking every \`vehicle\` position for every nearby \`stop\`) can reintroduce the trigonometric bottleneck of \`haversineDistance\`.
**Action:** When iterating over coordinates in hot nested loops, ensure bounding box pre-filtering using \`getBoundingBox\` and arithmetic checks are applied directly inside the tightest loop where the geographic comparison occurs, effectively bypassing \`haversineDistance\` entirely for out-of-bounds items.

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
