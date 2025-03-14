"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatDivRunner = void 0;
const fs = require("fs");
const path = require("path");
const comunica_runner_1 = require("./comunica-runner");
const queries_1 = require("./queries");
const statistic_intermediate_results_1 = require("@comunica/statistic-intermediate-results");
class WatDivRunner {
    constructor(source, queriesDir) {
        this.source = source;
        this.queriesDir = queriesDir;
        this.comunicaRunner = new comunica_runner_1.ComunicaRunner();
    }
    loadWatDivQueries() {
        const loader = new queries_1.QueryLoader();
        return loader.loadWatDivQueries(this.queriesDir);
    }
    async runQueryTemplate(queries, repeats, max_of_template, trackIntermediateResults) {
        const totalExecutionTimes = [];
        // Query execution time without considering constructing the query
        const runTimes = [];
        const nIntermediateResults = [];
        let i = 0;
        for (const query of queries) {
            i += 1;
            const measurementsTotal = [];
            const measurementsRunTime = [];
            const measurementsNIntermediateResults = [];
            for (let k = 0; k < repeats; k++) {
                const context = { sources: [this.source] };
                let nIntermediateResults = 0;
                if (trackIntermediateResults) {
                    // This statistic should only be invoked in the query operations that the benchmark is interested in.
                    // In case intermediate join results are counted it should only be for inner joins.
                    const statisticIntermediateResults = new statistic_intermediate_results_1.StatisticIntermediateResults();
                    statisticIntermediateResults.on(() => {
                        nIntermediateResults += 1;
                    });
                    context[statisticIntermediateResults.key.name] = statisticIntermediateResults;
                }
                const start = performance.now();
                const bs = await this.comunicaRunner.executeQuery(query, context);
                const startExecution = performance.now();
                const result = await this.comunicaRunner.consumeStream(bs);
                console.log(`Results: ${result.length}, intermediate results: ${nIntermediateResults}`);
                const end = performance.now();
                measurementsTotal.push(end - start);
                measurementsRunTime.push(end - startExecution);
                measurementsNIntermediateResults.push({
                    nResults: result.length,
                    nIntermediateResults: nIntermediateResults
                });
            }
            totalExecutionTimes.push(measurementsTotal);
            runTimes.push(measurementsRunTime);
            nIntermediateResults.push(measurementsNIntermediateResults);
            if (max_of_template && i >= max_of_template) {
                break;
            }
        }
        let output = {
            total: totalExecutionTimes,
            run: runTimes
        };
        if (trackIntermediateResults) {
            output = {
                ...output,
                nIntermediateResults
            };
        }
        return output;
    }
    async run(queries, repeats, templatesToRun, max_of_template, trackIntermediateResults, resultFileName) {
        let benchmarkResults = {};
        let benchmarkQueries = {};
        if (templatesToRun) {
            templatesToRun.forEach((template) => {
                benchmarkQueries[template] = queries[template];
            });
            queries = benchmarkQueries;
        }
        for (const template in queries) {
            console.log(template);
            benchmarkResults[template] = await this.runQueryTemplate(queries[template], repeats, max_of_template, trackIntermediateResults);
        }
        if (resultFileName) {
            fs.writeFileSync(path.join(__dirname, '..', '..', 'output', resultFileName), JSON.stringify(benchmarkResults, null, 2), 'utf8');
        }
    }
}
exports.WatDivRunner = WatDivRunner;
//# sourceMappingURL=watdiv-benchmark-runner.js.map