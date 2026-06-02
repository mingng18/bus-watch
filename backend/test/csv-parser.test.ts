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

  it('handles malformed data with more or fewer columns than headers', () => {
    const input = 'a,b,c\n1,2\n4,5,6,7\n';
    const result = parseCsv(input);
    expect(result).toEqual([
      { a: '1', b: '2', c: '' },
      { a: '4', b: '5', c: '6' },
    ]);
  });
});
