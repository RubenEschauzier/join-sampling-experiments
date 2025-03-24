import * as fs from 'fs';
import * as path from 'path'
import { ComunicaRunner } from "./comunica-runner";
import { QueryLoader } from "./queries";
import { StatisticIntermediateResults} from '@comunica/statistic-intermediate-results';


export class WatDivRunner{
    public source: string;
    public queriesDir: string;

    public comunicaRunner: ComunicaRunner;

    public constructor(source: string, queriesDir: string){
        this.source = source;
        this.queriesDir = queriesDir;
        this.comunicaRunner = new ComunicaRunner();
    }

    public loadWatDivQueries(){
        const loader = new QueryLoader();
        return loader.loadWatDivQueries(this.queriesDir);
    }

    public async runQueryTemplate(
        queries: string[], repeats: number, 
        max_of_template?: number, 
        trackIntermediateResults?: boolean
    ): Promise<ITemplateBenchmarkResults>{
        const totalExecutionTimes: number[][] = []
        // Query execution time without considering constructing the query
        const runTimes: number[][] = [];
        const nIntermediateResults: IResultCounts[][] = [];
        let i = 0;
        for (const query of queries){
            i += 1
            const measurementsTotal: number[] = [];
            const measurementsRunTime: number[] = [];
            const measurementsNIntermediateResults: IResultCounts[] = [];
            for (let k=0; k < repeats; k++){
                const context: Record<string,any> = {sources: [this.source]};
                let nIntermediateResults = 0;
                if (trackIntermediateResults){
                    // This statistic should only be invoked in the query operations that the benchmark is interested in.
                    // In case intermediate join results are counted it should only be for inner joins.
                    const statisticIntermediateResults = new StatisticIntermediateResults()
                    statisticIntermediateResults.on(() => {
                        nIntermediateResults += 1;
                    });
                    context[statisticIntermediateResults.key.name] = statisticIntermediateResults;
                }
                try{
                    const start = performance.now();
                    const bs = await this.comunicaRunner.executeQuery(query, context);
                    const startExecution = performance.now();
                    const result = await this.comunicaRunner.consumeStream(bs);
                    console.log(`Results: ${result.length}, intermediate results: ${nIntermediateResults}`)
                    const end = performance.now();  

                    measurementsTotal.push(end - start);
                    measurementsRunTime.push(end - startExecution);
                    measurementsNIntermediateResults.push({
                        nResults: result.length,
                        nIntermediateResults: nIntermediateResults
                    });      
                }
                catch(err){
                    console.warn(err);
                    measurementsTotal.push(0);
                    measurementsRunTime.push(0);
                    measurementsNIntermediateResults.push({
                        nResults: 0,
                        nIntermediateResults: nIntermediateResults
                    });
                }
                // const start = performance.now();
                // const bs = await this.comunicaRunner.executeQuery(query, context);
                // const startExecution = performance.now();
                // const result = await this.comunicaRunner.consumeStream(bs);
                // console.log(`Results: ${result.length}, intermediate results: ${nIntermediateResults}`)
                // const end = performance.now();
            }
            totalExecutionTimes.push(measurementsTotal);
            runTimes.push(measurementsRunTime);
            nIntermediateResults.push(measurementsNIntermediateResults);
            if (max_of_template && i >= max_of_template){
                break;
            }
        }
        let output: ITemplateBenchmarkResults = {
            total: totalExecutionTimes,
            run: runTimes
        }
        if (trackIntermediateResults){
            output = {
                ...output,
                nIntermediateResults
            }
        }
        return output
    }

    public async run(
        queries: Record<string, string[]>, 
        repeats: number, 
        templatesToRun?: string[], 
        max_of_template?: number, 
        trackIntermediateResults?: boolean,
        resultFileName?: string
    ){
        let benchmarkResults: Record<string, ITemplateBenchmarkResults> = {};
        let benchmarkQueries: Record<string, string[]> = {}
        if (templatesToRun){
            templatesToRun.forEach((template) => {
                benchmarkQueries[template] = queries[template];
            });
            queries = benchmarkQueries
        }
        for (const template in queries){
            console.log(template)
            benchmarkResults[template] = await this.runQueryTemplate(queries[template], repeats, max_of_template, trackIntermediateResults);
        }
        if (resultFileName){
            fs.writeFileSync(
                path.join(__dirname, '..', '..', 'output', resultFileName), 
                JSON.stringify(benchmarkResults, null, 2), 'utf8'
            );
        }
    }
}

export interface ITemplateBenchmarkResults{
    total: number[][];
    run: number[][];
    nIntermediateResults?: IResultCounts[][];
}

export interface IResultCounts{
    nResults: number,
    nIntermediateResults: number
}

// Global OOM handler (Node.js only)
process.on("uncaughtException", (err) => {
    if (err instanceof RangeError && err.message.includes("allocation")) {
        console.error("Global Out-of-Memory error detected! Process terminating...");
        process.exit(1);
    }
});