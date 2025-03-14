"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComunicaRunner = void 0;
class ComunicaRunner {
    constructor() {
        const QueryEngine = require('@comunica/query-sparql-file').QueryEngine;
        this.engine = new QueryEngine();
    }
    async executeQuery(query, context) {
        const bindingsStream = await this.engine.queryBindings(query, context);
        return bindingsStream;
    }
    async consumeStream(bindingsStream) {
        return await bindingsStream.toArray();
    }
}
exports.ComunicaRunner = ComunicaRunner;
//# sourceMappingURL=comunica-runner.js.map