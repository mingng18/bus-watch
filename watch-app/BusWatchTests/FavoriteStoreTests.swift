import XCTest
@testable import BusWatch

final class FavoriteStoreTests: XCTestCase {

    /// A per-test UserDefaults suite so tests never touch real app storage.
    private func makeDefaults(suite: String = "buswatch.tests.\(UUID().uuidString)") -> UserDefaults {
        let defaults = UserDefaults(suiteName: suite)!
        defaults.removePersistentDomain(forName: suite)
        return defaults
    }

    // MARK: - Add / Remove

    func testAddInsertsStopAndPersists() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)

        XCTAssertTrue(store.add("stop1"))
        XCTAssertTrue(store.contains("stop1"))
        XCTAssertEqual(store.favorites, ["stop1"])

        // Re-adding is a no-op.
        XCTAssertFalse(store.add("stop1"))
    }

    func testRemoveDeletesStopAndPersists() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)
        store.add("stop1")
        store.add("stop2")

        XCTAssertTrue(store.remove("stop1"))
        XCTAssertFalse(store.contains("stop1"))
        XCTAssertTrue(store.contains("stop2"))

        // Removing a non-member is a no-op.
        XCTAssertFalse(store.remove("stop1"))
    }

    // MARK: - Toggle

    func testToggleFlipsMembership() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)

        XCTAssertTrue(store.toggle("stop1"))
        XCTAssertTrue(store.contains("stop1"))

        XCTAssertFalse(store.toggle("stop1"))
        XCTAssertFalse(store.contains("stop1"))
    }

    // MARK: - Home

    func testSetHomeMarksFavoriteAsHome() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)

        store.setHome("stop1")

        XCTAssertTrue(store.contains("stop1"))
        XCTAssertTrue(store.isHome("stop1"))
        XCTAssertEqual(store.homeStopId, "stop1")
    }

    func testSetHomeAutoFavoritesStop() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)

        // Setting home on a non-favorite should add it to favorites too.
        store.setHome("stop1")

        XCTAssertTrue(store.contains("stop1"))
        XCTAssertTrue(store.isHome("stop1"))
    }

    func testToggleHomeTogglesAndPreservesFavorite() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)
        store.add("stop1")

        // Toggle on.
        store.toggleHome("stop1")
        XCTAssertTrue(store.isHome("stop1"))

        // Toggle off — should remain favorited, just not home.
        store.toggleHome("stop1")
        XCTAssertFalse(store.isHome("stop1"))
        XCTAssertTrue(store.contains("stop1"))
        XCTAssertNil(store.homeStopId)
    }

    func testRemoveClearsHomeWhenRemovingHomeStop() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)
        store.setHome("stop1")

        store.remove("stop1")

        XCTAssertFalse(store.contains("stop1"))
        XCTAssertNil(store.homeStopId)
        XCTAssertFalse(store.isHome("stop1"))
    }

    func testClearHomeLeavesFavoriteIntact() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)
        store.setHome("stop1")

        store.clearHome()

        XCTAssertNil(store.homeStopId)
        XCTAssertTrue(store.contains("stop1"))
    }

    // MARK: - sortedFavorites

    func testSortedFavoritesPutsHomeFirst() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)
        store.add("b_stop")
        store.add("a_stop")
        store.setHome("z_stop")

        XCTAssertEqual(store.sortedFavorites, ["z_stop", "a_stop", "b_stop"])
    }

    // MARK: - Persistence

    func testFavoritesPersistAcrossInstances() {
        let suite = "buswatch.tests.persist.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }

        let store1 = FavoriteStore(defaults: defaults)
        store1.add("stop1")
        store1.setHome("stop1")

        // A new store backed by the same defaults should reload the saved state.
        let store2 = FavoriteStore(defaults: defaults)
        XCTAssertTrue(store2.contains("stop1"))
        XCTAssertEqual(store2.homeStopId, "stop1")
    }

    func testInitWithoutStoredDataStartsEmpty() {
        let defaults = makeDefaults()
        let store = FavoriteStore(defaults: defaults)

        XCTAssertTrue(store.favorites.isEmpty)
        XCTAssertNil(store.homeStopId)
    }

    // MARK: - Orphaned home self-heal

    func testHomeNotInFavoritesIsDroppedOnInit() {
        let suite = "buswatch.tests.orphan.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }

        // Write a home stop without any matching favorite entry.
        defaults.set("ghost", forKey: "buswatch.homeStop")

        let store = FavoriteStore(defaults: defaults)
        XCTAssertNil(store.homeStopId)
    }
}
