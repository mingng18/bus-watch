## 2025-03-02 - Optimize route lookups in bus tracking

**Learning:** When retrieving bus trip progress and matching routes via `vehicle?.routeId` inside heavily called functions (`getBusTripProgress`), using `Array.prototype.find()` incurs an O(N) penalty (where N is number of routes). Since the routes rarely change per API invocation, precomputing a `Map<string, Route>` outside the function enables O(1) lookups and significantly reduces request latency.

**Action:** Before passing large arrays into frequently called processing functions to perform `.find()`, convert them to a `Map` indexed by the search key for O(1) lookups.
