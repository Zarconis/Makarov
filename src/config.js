var config = {}

//// Cosmos DB
config.endpoint = "<endpoint>.gremlin.cosmosdb.azure.com";
config.primaryKey = "<key>";
config.database = "makarov"
config.collection = "knowledgebase"

//// App Server
config.app = {}
config.app.port = 3000

module.exports = config;