import { describe, it, expect } from "vitest";
import { parseCsv } from "../src/csv-parser";

describe("parseCsv", () => {
  it("parses basic CSV with headers", () => {
    const input = "name,age,city\nAlice,30,KL\nBob,25,PG\n";
    const result = parseCsv(input);
    expect(result).toEqual([
      { name: "Alice", age: "30", city: "KL" },
      { name: "Bob", age: "25", city: "PG" },
    ]);
  });

  it("handles quoted fields with commas", () => {
    const input = 'id,desc\n1,"hello, world"\n2,"foo""bar"\n';
    const result = parseCsv(input);
    expect(result).toEqual([
      { id: "1", desc: "hello, world" },
      { id: "2", desc: 'foo"bar' },
    ]);
  });

  it("handles empty input", () => {
    const result = parseCsv("");
    expect(result).toEqual([]);
  });

  it("strips CRLF line endings without leaving a trailing \\r (issue #132)", () => {
    // A Windows/Excel-exported CSV uses \r\n. Splitting on \n alone would
    // leave a trailing '\r' on the last field of every row, corrupting both
    // the header name and the values (lookups by header would silently miss,
    // and names would carry a stray carriage return).
    const input = "name,age,city\r\nAlice,30,KL\r\nBob,25,PG\r\n";
    const result = parseCsv(input);
    expect(result).toEqual([
      { name: "Alice", age: "30", city: "KL" },
      { name: "Bob", age: "25", city: "PG" },
    ]);
    // Explicit: no stray \r anywhere in any value.
    for (const row of result) {
      for (const value of Object.values(row)) {
        expect(value).not.toMatch(/\r/);
      }
    }
  });

  it("strips bare CR (legacy Mac) line endings (issue #132)", () => {
    const input = "name,age,city\rAlice,30,KL\rBob,25,PG\r";
    const result = parseCsv(input);
    expect(result).toEqual([
      { name: "Alice", age: "30", city: "KL" },
      { name: "Bob", age: "25", city: "PG" },
    ]);
  });
});
