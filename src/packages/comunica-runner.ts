
export class ComunicaRunner {
    public engine: any;

    public constructor(){
        const QueryEngine = require('@comunica/query-sparql-file').QueryEngine;
        this.engine = new QueryEngine();
    }

    public async executeQuery(query: string, context: Record<string, any>){
        const bindingsStream = await this.engine.queryBindings(query, context);
        return bindingsStream;
    }
    public async consumeStream(bindingsStream: any){
        return await bindingsStream.toArray()
    }   
}
