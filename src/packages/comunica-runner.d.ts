export declare class ComunicaRunner {
    engine: any;
    constructor();
    executeQuery(query: string, context: Record<string, any>): Promise<any>;
    consumeStream(bindingsStream: any): Promise<any>;
}
