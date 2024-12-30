const Entries = require('../models/entries');
const Logchain = require('../models/logchain');
const Nodes = require('../models/nodes');

class LogchainController {
    constructor(url, port) {
        this.logchain = new Logchain(url, port);
        this.nodes = new Nodes(url, port);
        this.entries = new Entries();
    }

    resolve(req, res) {
        this.nodes.resolve(res, this.logchain);
    }

    getNodes(req, res) {
        res.json(this.nodes.list);
    }

    postEntry(req, res) {
        res.json(this.entries.add(req, res));
    }

    getEntries(req, res) {
        res.json(this.entries.get());
    }

    mine(req, res) {
        res.json(this.logchain.mine(this.entries, res));
    }

    getLogchain(req, res) {
        res.json(this.logchain.logs);
    }

    getLogByIndex(req, res) {
        res.json(this.logchain.getLogByIndex(req.params.idx));
    }
    
    getLogIdxByGuid(req, res) {
        res.json(this.logchain.getLogIdxByGuid(req.params.guid));
    }
    
    getLastTimestampByGuid(req, res) {
        res.json(this.logchain.getLastTimestampByGuid(req.params.guid));
    }

    getLogLastIndex(req, res) {
        res.json(this.logchain.getLogLastIndex());
    }
    
    getEntryByGuid(req, res) {
        res.json(this.logchain.getEntryByGuid(req.params.guid));
    }
    
    getHistory(req, res) {
        res.json(this.logchain.getHistory(req.params.guid));
    }
}

module.exports = LogchainController;
