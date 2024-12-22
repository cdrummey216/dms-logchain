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
        this.entries.add(req, res);
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

    getLogLastIndex(req, res) {
        res.json(this.logchain.getLogLastIndex());
    }
    
    getEntryByIndexGuid(req, res) {
        res.json(this.logchain.getEntryByIndexGuid(req.params.idx, req.params.guid));
    }
}

module.exports = LogchainController;