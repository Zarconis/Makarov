const express = require('express')
const bodyParser = require('body-parser');
const config = require("./config")
const helper = require("./helper")
const graphAbstraction = require("./graphAbstraction")

//// Define the express app
const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const port = config.app.port;

//// define the cosmos graph
const Graph = new graphAbstraction(config.endpoint, config.primaryKey, config.database, config.collection)

//// Define the routes
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/Entity/:Id', (req, res) => {
    console.log(req.params)
    console.log(`Makarov Get Entity: ${req.params.Id}`)
    res.json({
        status: 200,
        entity: req.params.Id
    })
});

app.post('/Entity', (req, res) => {
    console.log(`Makarov Post Entity`)
    try {
        helper.ValidateAddEntity(req.body)
    } catch (ex) {
        return res.json(helper.ConstructErrorMessage(ex))
    }

    console.log(`Entity: {id: ${req.body.id}, label: ${req.body.label}}`)
    Graph.AddVertex(
        req.body,
        () => {
            res.json({status: 200, message: `Entity: {id: ${req.body.id}, label: ${req.body.label}} added`})
        }, (err) => {
            res.json(helper.ConstructErrorMessage(err));
        });
});

//// Define the listener
app.listen(port, () => console.log(`Makarov listening on port ${port}!`))