🎯 **What:** The testing gap addressed
This PR introduces the missing test suite for `expandTripsForStop` in `backend/src/frequency.ts`. Currently, the function is implemented as a stub returning an empty array `[]`.

📊 **Coverage:** What scenarios are now tested
The test suite now verifies that the function correctly behaves as a placeholder/stub:
1. Returns an empty array `[]` when called initially as intended by the stub.
2. Safely handles empty arrays and objects as input variables without crashing.
3. Successfully accepts standard mocked objects mimicking real-world transit data, ensuring the API stub gracefully receives them without errors.

✨ **Result:** The improvement in test coverage
Test coverage across the backend has improved. `backend/test/frequency.test.ts` was added and tests pass successfully alongside the pre-existing test suite with zero regressions. Future refactoring and full implementations of `expandTripsForStop` now have a safe foundation to work from.
