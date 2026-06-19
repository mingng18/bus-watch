import { describe, expect, it } from "vitest";
import worker from "../src/index";

describe("CORS policy", () => {
  it("allows requested origin if FRONTEND_URL is set and matches", async () => {
    const mockEnv = { FRONTEND_URL: "https://my-frontend.com" } as any;
    const req = new Request("http://localhost/", {
      headers: { Origin: "https://my-frontend.com" },
    });
    const res = await worker.fetch(req, mockEnv);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://my-frontend.com",
    );
  });

  it("restricts origin to FRONTEND_URL when request comes from unknown origin", async () => {
    const mockEnv = { FRONTEND_URL: "https://my-frontend.com" } as any;
    const req = new Request("http://localhost/", {
      headers: { Origin: "https://attacker.com" },
    });
    const res = await worker.fetch(req, mockEnv);

    // In Hono, if origin doesn't match and function returns a specific string,
    // Hono will set ACAO to that specific string (which means browser will block attacker.com).
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://my-frontend.com",
    );
  });

  it("does not fallback to wildcard when FRONTEND_URL is not set", async () => {
    const mockEnv = {} as any;
    const req = new Request("http://localhost/", {
      headers: { Origin: "https://attacker.com" },
    });
    const res = await worker.fetch(req, mockEnv);

    // It should NOT be '*'
    expect(res.headers.get("Access-Control-Allow-Origin")).not.toBe("*");
  });
});
