import { WatDivRunner } from "../packages/watdiv-benchmark-runner";
import * as profiler from "v8-profiler-next";
import * as fs from 'fs';

const dataset = "/users/reschauz/benchmarks/watdiv-dataset-medium/dataset.nt";
const queryLocation = "/users/reschauz/benchmarks/watdiv-dataset-medium/queries";
const runner = new WatDivRunner(dataset, queryLocation);
const queries = runner.loadWatDivQueries();
//delete queries.C1
//delete queries.C2
//delete queries.C3
//delete queries.F5 
// profiler.startProfiling("CPU Profile", true);
runner.run(queries, 10, undefined, undefined, true, "output-sampling-medium.json").then(() => {
});
