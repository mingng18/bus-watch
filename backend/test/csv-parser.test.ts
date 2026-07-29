import { describe, it, expect } from 'vitest';
import { parseCsv } from '../src/csv-parser';

describe('parseCsv', () => {
  it('parses basic CSV with headers', () => {
    const input = 'name,age,city\nAlice,30,KL\nBob,25,PG\n';
    const result = parseCsv(input);
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: 'KL' },
      { name: 'Bob', age: '25', city: 'PG' },
    ]);
  });

  it('handles quoted fields with commas', () => {
    const input = 'id,desc\n1,"hello, world"\n2,"foo""bar"\n';
    const result = parseCsv(input);
    expect(result).toEqual([
      { id: '1', desc: 'hello, world' },
      { id: '2', desc: 'foo"bar' },
    ]);
  });

  it('handles empty input', () => {
    const result = parseCsv('');
    expect(result).toEqual([]);
  });

  it('strips CRLF line endings without leaving a trailing \\r (issue #132)', () => {
    // A Windows/Excel-exported CSV uses \r\n. Splitting on \n alone would
    // leave a trailing '\r' on the last field of every row, corrupting both
    // the header name and the values (lookups by header would silently miss,
    // and names would carry a stray carriage return).
    const input = 'name,age,city\r\nAlice,30,KL\r\nBob,25,PG\r\n';
    const result = parseCsv(input);
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: 'KL' },
      { name: 'Bob', age: '25', city: 'PG' },
    ]);
    // Explicit: no stray \r anywhere in any value.
    for (const row of result) {
      for (const value of Object.values(row)) {
        expect(value).not.toMatch(/\r/);
      }
    }
  });

  it('strips bare CR (legacy Mac) line endings (issue #132)', () => {
    const input = 'name,age,city\rAlice,30,KL\rBob,25,PG\r';
    const result = parseCsv(input);
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: 'KL' },
      { name: 'Bob', age: '25', city: 'PG' },
    ]);
  });

  describe('unquoted fast path edge cases', () => {
    it('handles missing columns (fewer values than headers)', () => {
      const input = 'name,age,city\nAlice,30\nBob';
      const result = parseCsv(input);
      expect(result).toEqual([
        { name: 'Alice', age: '30', city: '' },
        { name: 'Bob', age: '', city: '' },
      ]);
    });

    it('handles extra columns (more values than headers)', () => {
      const input = 'name,age\nAlice,30,KL,extra\nBob,25';
      const result = parseCsv(input);
      expect(result).toEqual([
        { name: 'Alice', age: '30' }, // Extra columns are ignored
        { name: 'Bob', age: '25' },
      ]);
    });

    it('handles empty columns (consecutive commas)', () => {
      const input = 'name,age,city\nAlice,,KL\n,25,';
      const result = parseCsv(input);
      expect(result).toEqual([
        { name: 'Alice', age: '', city: 'KL' },
        { name: '', age: '25', city: '' },
      ]);
    });
  });
});