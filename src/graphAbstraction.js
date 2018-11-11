var Gremlin = require('gremlin');
var async = require('async');

const RELATIONSHIPPREFIX = "rel/";

class GraphAbstraction
{
    /**
     * Constructor
     * @param {string} endpoint - endpoint of cosmos table 
     * @param {string} key - cosmos table key 
     * @param {string} database - db name
     * @param {string} collection - collection name
     * @param {boolean} verbose - false for disabling verbosity 
     */
    constructor (endpoint, key, database, collection, verbose) {
        this.verbose = (verbose) ? verbose : true;
        this.client = Gremlin.createClient(
            443, 
            endpoint, 
            { 
                "session": false, 
                "ssl": true, 
                "user": `/dbs/${database}/colls/${collection}`,
                "password": key
            }
        );

        this.__log("CosmosDB Client Created")
    }

    /**
     * Method to add entity
     * @param {object} entity - entity to insert 
     * @param {Function} callback - callback on success
     * @param {Function} errorCallback - callback on failure
     * @param {Array} exceptions - list of exceptions captured 
     */
    AddVertex (entity, callback, errorCallback, exceptions) {
        this.__log("GraphAbstraction.AddVertex()")
        if (!exceptions) exceptions = [];

        var query = "g.addV(label).property('id', id)";
        var params = { label: entity.label, id: entity.id };
        var edges = [];
        Object.keys(entity).forEach((key) => {
            if (key !== "label" && key !== "id") {
                if (key.indexOf(RELATIONSHIPPREFIX) === 0) {
                    //// These are relationship keys
                    edges.push({
                        src: entity.id,
                        reln: key.replace(RELATIONSHIPPREFIX, ""),
                        target: entity[key]
                    });

                    return;
                }

                params[key] = entity[key];
                query += `.property('${key}', ${key})`;
            }
        });

        this.__log(query);
        this.__log(params);

        this.client.execute(
            query,
            params, 
            (err, results) => {
                this.__log(results);

                if (err) {
                    this.__log(err);
                    exceptions.push({type: err.ExceptionType, message: err.ExceptionMessage})
                    return errorCallback(exceptions);
                }

                //// Success
                this.__log("Result: %s\n" + JSON.stringify(results));

                if (edges.length === 0) {
                    callback();
                } else {
                    this.AddEdges(edges, callback, errorCallback, exceptions);
                }
            });
    }

    /**
     * Method to add an edge
     * @param {string} src - id of source
     * @param {string} reln - name of relation ship
     * @param {string} target - id of target
     * @param {Function} callback - callback on success
     * @param {Function} errorCallback - callback on failure
     * @param {Array} exceptions - list of exceptions captured 
     */
    AddEdge (src, reln, target, callback, errorCallback, exceptions) {
        this.__log("GraphAbstraction.AddEdge()");
        if (!exceptions) exceptions = [];
        
        this.client.execute(
            "g.V(source).addE(relationship).to(g.V(target))", 
            { source: src, relationship: reln, target: target}, 
            (err, results) => {
                if (err) {
                    this.__log(err);
                    exceptions.push({type: err.ExceptionType, message: err.ExceptionMessage})
                    return errorCallback(exceptions);
                }

                //// Success
                this.__log("Result: %s\n" + JSON.stringify(results));
                callback();
            });
        }

    __log (message) {
        if (this.verbose) {
            console.log(message);
        }
    }

    /**
     * Method to add more than one edges
     * @param {Array} edges - Array of edges 
     * @param {Function} callback - callback on success
     * @param {Function} errorCallback - callback on failure
     * @param {Array} exceptions - list of exceptions captured 
     */
    AddEdges (edges, callback, errorCallback, exceptions) {
        this.__log("GraphAbstraction.AddEdges()");
        if (!exceptions) exceptions = [];

        //// TODO: move to a promise based model
        var todo = edges.length;
        var done = 0;
        edges.forEach(edge => {
            this.AddEdge(
                edge.src,
                edge.reln,
                edge.target,
                () => {
                    ++done;
                    if (done === todo) {
                        callback();
                    }
                }, (err) => {
                    ++done;
                    if (done == todo) {
                        errorCallback(exceptions);
                    }
                }, exceptions);
        });
    }
}

module.exports = GraphAbstraction;