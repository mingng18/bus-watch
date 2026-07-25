💡 What
Modified the `GET /bus/trip/:tripId/progress` endpoint in `backend/src/index.ts` to replace sequential `await` calls for `getAllRoutes`, `getRealtimeVehicles`, and `getAllTripStops` with a concurrent fetch using `Promise.all`.

🎯 Why
Previously, the endpoint waited for `getAllRoutes` to finish before fetching `vehicles`, and then waited for the synchronous matching loop before firing off `getAllTripStops`. Since these three data sources from Cloudflare KV are independent, executing them sequentially created an artificial wait cascade, causing unnecessary latency on an API path crucial to presenting real-time vehicle progress to end users.

📊 Impact
Response time is reduced from the sum of the three network IO operations to roughly the duration of the longest single request. Since KV reads typically involve network hops, this removes substantial latency.

🔬 Measurement
A local script mocking 100ms fetches measured the average execution time drop from ~300ms (sequential) to ~100ms (parallel), achieving a roughly 66% time reduction for the data-fetching block of the endpoint.
