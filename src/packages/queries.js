"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = exports.QueryLoader = void 0;
const fs = require("fs");
const path = require("path");
class QueryLoader {
    constructor() {
    }
    loadWatDivQueries(queriesDir) {
        const queries = {};
        const files = fs.readdirSync(queriesDir);
        files.forEach((file) => {
            const data = fs.readFileSync(path.join(queriesDir, file), 'utf8');
            const splitQueries = data.replace(/\n/g, '').replace(/\t/g, '').split('SELECT').slice(1)
                .map(query => 'SELECT' + query);
            queries[file.split('.')[0]] = splitQueries;
        });
        return queries;
    }
}
exports.QueryLoader = QueryLoader;
exports.queries = {
    simpleJoin: `
    SELECT ?v0 ?v1 ?v3 WHERE {
        ?v0 <http://schema.org/jobTitle> ?v1 .
        <http://db.uwaterloo.ca/~galuc/wsdbm/City25> <http://www.geonames.org/ontology#parentCountry> ?v3 .
        ?v0 <http://schema.org/nationality> ?v3 .
    }
`,
    simpleJoinOptional: `
    SELECT ?v0 ?v1 ?v3 WHERE {
        ?v0 <http://schema.org/jobTitle> ?v1 .
        <http://db.uwaterloo.ca/~galuc/wsdbm/City25> <http://www.geonames.org/ontology#parentCountry> ?v3 .
        ?v0 <http://schema.org/nationality> ?v3 .
        OPTIONAL {
        ?v0 <http://xmlns.com/foaf/age> ?v4
        }
    }
    `,
    w_1_1_union_filter: `
    SELECT * WHERE {
        {
        ?v0 <http://schema.org/jobTitle> ?v1 .
        <http://db.uwaterloo.ca/~galuc/wsdbm/City25> <http://www.geonames.org/ontology#parentCountry> ?v3 .
        ?v0 <http://schema.org/nationality> ?v3 .
        }
        UNION {
        ?v0 <http://xmlns.com/foaf/givenName> ?v4 .
        ?v0 <http://schema.org/jobTitle> ?v1 .
        <http://db.uwaterloo.ca/~galuc/wsdbm/City162> <http://www.geonames.org/ontology#parentCountry> ?v3 .
        ?v0 <http://schema.org/nationality> ?v3 .
        FILTER ( ?v3 = <http://db.uwaterloo.ca/~galuc/wsdbm/Country1> )
        }
    }
`
};
//# sourceMappingURL=queries.js.map