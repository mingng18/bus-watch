import { performance } from 'perf_hooks';

function rejectOutliersOld(values: number[], threshold = 3): number[] {
  if (values.length <= 3) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const devs = values.map((v) => Math.abs(v - median));
  const mad = devs.reduce((a, b) => a + b, 0) / devs.length;
  if (mad === 0) return values; // all values identical or near-median
  return values.filter((_, i) => devs[i] <= threshold * mad);
}

function rejectOutliersNew(values: number[], threshold = 3): number[] {
  if (values.length <= 3) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  let madSum = 0;
  for (let i = 0; i < values.length; i++) {
    madSum += Math.abs(values[i] - median);
  }
  const mad = madSum / values.length;

  if (mad === 0) return values; // all values identical or near-median

  const limit = threshold * mad;
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (Math.abs(v - median) <= limit) {
      result.push(v);
    }
  }
  return result;
}

// Generate random data
const generateData = (size: number) => Array.from({ length: size }, () => Math.random() * 100);

const testData = Array.from({ length: 10000 }, () => generateData(20));

console.log("Running benchmarks...");

const startOld = performance.now();
for (let i = 0; i < testData.length; i++) {
  rejectOutliersOld(testData[i]);
}
const endOld = performance.now();
console.log(`Old: ${endOld - startOld} ms`);

const startNew = performance.now();
for (let i = 0; i < testData.length; i++) {
  rejectOutliersNew(testData[i]);
}
const endNew = performance.now();
console.log(`New: ${endNew - startNew} ms`);
