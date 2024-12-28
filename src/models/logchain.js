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

        log.addEntries(entries, previousLog.index);
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

        if (idx<=this.logs.length) {
            this.logs.forEach( (log) => {
                log.entries.forEach( (entry) => {
                    if (guid == entry.guid) {
                        foundLogIdx = log.index;
                        return;
                        }
                    });
            });
        }

        return foundLogIdx;
    }

    getLogLastIndex() {
        return this.logs.length-1;
    }
    
    getEntryByIndexGuid(idx, guid) {
        let foundLog = [];
        let foundEntry = [];
        if (idx<=this.logs.length) {
            this.logs.forEach( (log) => {
                if (idx == log.index) {
                    foundLog = log;
                    log.entries.forEach( (entry) => {
                    if (guid == entry.guid) {
                        foundEntry.push(entry);
                        return;
                        }
                    });
                }
            });
        }

        return foundEntry;
    }
    
    getHistory(idx, guid) {
        let foundLog = [];
        let foundEntries = [];
        if (idx<=this.logs.length) {
            this.logs.forEach( (log) => {
                if (idx == log.index) {
                    foundLog = log;
                    log.entries.forEach( (entry) => {
                    if (guid == entry.guid) {
                        foundEntries.push(entry);
                        idx = entry.lastLog
                        guid = entry.lastGuid;
                        }
                        return;
                    });
                }
            });
        }

        return foundEntries;
    }
}

module.exports = Logchain;
