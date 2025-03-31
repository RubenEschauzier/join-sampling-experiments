"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watdiv_benchmark_runner_1 = require("../packages/watdiv-benchmark-runner");
const dataset = "/users/reschauz/benchmarks/watdiv-dataset-medium/dataset.nt";
const queryLocation = "/users/reschauz/benchmarks/watdiv-dataset-medium/queries";
const runner = new watdiv_benchmark_runner_1.WatDivRunner(dataset, queryLocation);
const queries = runner.loadWatDivQueries();
//delete queries.C1
//delete queries.C2
//delete queries.C3
//delete queries.F5 
// profiler.startProfiling("CPU Profile", true);
runner.run(queries, 10, undefined, undefined, true, "output-sampling-medium.json").then(() => {
});
//# sourceMappingURL=run-watdiv-benchmark.js.map