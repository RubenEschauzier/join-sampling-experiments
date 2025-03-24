import { WatDivRunner } from "../packages/watdiv-benchmark-runner";
import * as profiler from "v8-profiler-next";
import * as fs from 'fs';

const dataset = "/home/reschauz/projects/benchmarks/watdiv-dataset/dataset.nt";
const queryLocation = "/home/reschauz/projects/benchmarks/watdiv-dataset/queries";
const runner = new WatDivRunner(dataset, queryLocation);
const queries = runner.loadWatDivQueries();
// profiler.startProfiling("CPU Profile", true);
runner.run(queries, 1, ['F5'], 1, true, "output-sampling-profiled.json").then(() => {
});
