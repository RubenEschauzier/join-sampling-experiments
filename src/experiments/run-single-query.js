"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watdiv_benchmark_runner_1 = require("../packages/watdiv-benchmark-runner");
const dataset = "/home/reschauz/projects/benchmarks/watdiv-dataset/dataset.nt";
const queryLocation = "/home/reschauz/projects/benchmarks/watdiv-dataset/queries";
const runner = new watdiv_benchmark_runner_1.WatDivRunner(dataset, queryLocation);
const queries = runner.loadWatDivQueries();
// profiler.startProfiling("CPU Profile", true);
runner.run(queries, 1, ['F5'], 1, true, "output-sampling-profiled.json").then(() => {
});
//# sourceMappingURL=run-single-query.js.map