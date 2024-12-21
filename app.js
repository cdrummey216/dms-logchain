
const blockchainController = require('./src/controllers/blockchain');
const express = require('express');
const bodyParser = require('body-parser');

// Load env vars
const url = process.env.URL || '0.0.0.0';
const port = process.env.PORT || 4000;

// Init express
let app = express();
app.use(bodyParser.json());

let listener = app.listen(port, url, function() {
    console.log('Server started at ' + listener.address().address + ':' + listener.address().port);
});

// API
let controller = new blockchainController(url, port);
let lcontroller = new logchainController(url, port);
app.get('/resolve', controller.resolve.bind(controller));
app.get('/nodes', controller.getNodes.bind(controller));
app.post('/transaction', controller.postTransaction.bind(controller));
app.get('/transactions', controller.getTransactions.bind(controller));
app.get('/mine', controller.mine.bind(controller));
app.get('/blockchain/last-index', controller.getBlockLastIndex.bind(controller));
app.get('/blockchain/:idx', controller.getBlockByIndex.bind(controller));
app.get('/blockchain', controller.getBlockchain.bind(controller));

app.get('/log/resolve', lcontroller.resolve.bind(lcontroller));
app.get('/log/nodes', lcontroller.getNodes.bind(lcontroller));
app.post('/log/log', lcontroller.postEntry.bind(lcontroller));
app.get('/log/logs', lcontroller.getEntries.bind(lcontroller));
app.get('/log/mine', lcontroller.mine.bind(lcontroller));
app.get('/logchain/last-index', lcontroller.getLogLastIndex.bind(lcontroller));
app.get('/logchain/:idx', lcontroller.getLogByIndex.bind(lcontroller));
app.get('/logchain', lcontroller.getLogchain.bind(lcontroller));