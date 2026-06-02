🎯 **What:**
Added a missing test file for the `findNearbyRoutes` function located in `backend/src/routes.ts`. This fills a testing gap to ensure the route discovery logic for nearby stops behaves correctly.

📊 **Coverage:**
The tests cover the following scenarios:
- **Nearby Routes Found**: Verify it successfully returns routes that serve stops within the specified radius.
- **No Stops in Radius**: Verify it returns an empty array when no stops are within the specified radius.
- **Empty Inputs**: Ensure the function handles empty stops, routes, or trips gracefully.
- **Route Type Mapping**: Check that the function correctly maps route types 0, 1, 2 to `'rail'` and all other types to `'bus'`.
- **Deduplication**: Assert that the returned array contains unique routes even if a single route serves multiple nearby stops.

✨ **Result:**
The `findNearbyRoutes` logic is now fully tested with proper mocked inputs. This ensures we can confidently rely on the function and safely refactor it without worrying about regressions.
