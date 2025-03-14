import { ComunicaRunner } from "./comunica-runner";
export declare class WatDivRunner {
    source: string;
    queriesDir: string;
    comunicaRunner: ComunicaRunner;
    constructor(source: string, queriesDir: string);
    loadWatDivQueries(): Record<string, string[]>;
    runQueryTemplate(queries: string[], repeats: number, max_of_template?: number, trackIntermediateResults?: boolean): Promise<ITemplateBenchmarkResults>;
    run(queries: Record<string, string[]>, repeats: number, templatesToRun?: string[], max_of_template?: number, trackIntermediateResults?: boolean, resultFileName?: string): Promise<void>;
}
export interface ITemplateBenchmarkResults {
    total: number[][];
    run: number[][];
    nIntermediateResults?: IResultCounts[][];
}
export interface IResultCounts {
    nResults: number;
    nIntermediateResults: number;
}
