import Foundation

var content = try! String(contentsOfFile: "watch-app/BusWatch/Services/APIClient.swift")
content = content.replacingOccurrences(of: """
    init(baseURL: String = "https://bus-watch.nggihming123.workers.dev", session: URLSession = .shared) {
        self.session = session
    private init(baseURL: String = "https://bus-watch.nggihming123.workers.dev") {
        self.baseURL = baseURL
    }
""", with: """
    init(baseURL: String = "https://bus-watch.nggihming123.workers.dev", session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }
""")
try! content.write(toFile: "watch-app/BusWatch/Services/APIClient.swift", atomically: true, encoding: .utf8)
