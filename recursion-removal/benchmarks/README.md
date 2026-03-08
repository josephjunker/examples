Process for running the benchmarks:

```
node src/benchmarks/generate-input-data.mts
node src/benchmarks/input-stats.mts
node --expose-gc src/benchmarks/run-benchmarks.mts
node src/benchmarks/analyze-benchmark-results.mts
```