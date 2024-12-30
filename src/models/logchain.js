const sha256 = require('js-sha256');
const Log = require('./log');
const Entry = require('./entry');
const nodePersist = require('node-persist');
const crypto = require('crypto');
const Nodes = require('./nodes');

class Logchain {
    constructor(url, port) {
        this.logs = [];
        this.nodes = new Nodes(url, port);

        (async () => {
            this.storage = nodePersist.create({
                dir: __dirname + '/../../logstorage/' + crypto.createHash('md5').update(url+port).digest("hex")
            });
            await this.storage.init();

            let logs = await this.storage.getItem('logs');
            this.logs = typeof logs != 'undefined' ? logs : [];

            if (this.logs.length == 0) {
                let genesisLog  = new Log(); // initial log
                let genesisEntry = new Entry();
                genesisLog.entries.push(genesisEntry);
                this.addLog(genesisLog);
            }
        })();
    }

    addLog(log) {
        if (this.logs.length == 0) {
            log.previousHash = "0000000000000000";
            log.hash = this.generateHash(log);
        }

        this.logs.push(log);
        
        (async () => {
            await this.storage.setItem('logs', this.logs);
        })();
    }

    getNextLog(entries) {
        let log = new Log();        
        let previousLog = this.getPreviousLog();
        entries.list.forEach( (entry) => {
            let lastEntryLogIdx = this.getLogIdxByGuid(entry.lastGuid);
            entry.lastLog = lastEntryLogIdx;
            console.log(lastEntryLogIdx);
            return;
        });
        
        
        log.addEntries(entries);
        log.index = previousLog.index + 1;
        log.previousHash = previousLog.hash;
        log.hash = this.generateHash(log);

        return log;
    }

    getPreviousLog() {
        return this.logs[this.logs.length - 1];
    }

    generateHash(log) {
        let hash = sha256(log.key);

        while (!hash.startsWith('000')) {
            log.nonce++;
            hash = sha256(log.key);
        }

        return hash;
    }

    mine(entries, res) {
        if (entries.list.length == 0) {
            res.status(500);
            return {error: 'No entries to be mined'};
        }

        let log = this.getNextLog(entries);
        this.addLog(log);
        this.nodes.broadcast();

        return log;
    }

    updateLogs(logs) {
        this.logs = logs;

        (async () => {
            await this.storage.setItem('logs', this.logs);
        })();
    }

    getLogByIndex(idx) {
        let foundLog = [];

        if (idx<=this.logs.length) {
            this.logs.forEach( (log) => {
                if (idx == log.index) {
                    foundLog = log;
                    return;
                }
            });
        }

        return foundLog;
    }
    
    getLogIdxByGuid(guid) {
        let foundLogIdx = 0;
        this.logs.forEach( (log) => {
            log.entries.forEach( (entry) => {
                if (guid == entry.guid) {
                    foundLogIdx = log.index;
                    return;
                    }
                });
        });

        return foundLogIdx;
    }
    
    getLastTimestampByGuid(guid) {
        let foundLogIdx = -1;
        this.logs.forEach( (log) => {
            log.entries.forEach( (entry) => {
                if (guid == entry.lastGuid) {
                    foundLogIdx = entry.timestamp;
                    return;
                    }
                });
        });

        return foundLogIdx;
    }
    
    getLogLastIndex() {
        return this.logs.length-1;
    }
    
    getEntryByGuid(guid, results = []) {
        let foundLog = [];
        let foundHistory = [];
        
        for (var i = 0; i < this.logs.length; i++){
            this.logs[i].entries.forEach( (entry) => {
                console.log(i);
                
                if (guid == entry.guid) {
                    results.push(entry);
                    }
                });
        }
        console.log(results);
        return results;
    }
    
    getHistoryByGuid(guid, results = []) {
        let foundLog = [];
        let foundHistory = [];
        
        for (var i = 0; i < this.logs.length; i++){
            this.logs[i].entries.forEach( (entry) => {
                console.log(i);
                
                if (guid == entry.guid) {
                    results.push(entry);
                    this.getEntryByGuid(entry.lastGuid, results);
                    }
                });
        }
        console.log(results);
        return results;
    }
    
    getHistory(guid) {
        let foundEntries = [];
        foundEntries = this.getHistoryByGuid(guid, foundEntries);
        console.log(foundEntries);
        return foundEntries;
    }
}

module.exports = Logchain;
