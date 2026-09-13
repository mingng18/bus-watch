sed -i 's/const railRouteIds = new Set<string>();/const railRouteIds = new Set<string>();\n    for (const r of rawRoutes) {\n      if (r.route_type === '"'"'0'"'"' || r.route_type === '"'"'1'"'"' || r.route_type === '"'"'2'"'"') {\n        railRouteIds.add(r.route_id);\n      }\n    }/' backend/src/rail-ingest.ts

# Wait, it looks like `master` already has some optimizations. Let me check the actual file on `master` first to avoid messing up.
