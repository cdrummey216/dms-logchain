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
            let lastEntryLogIdx = this.getLogIdxByUuid(entry.lastUuid);
            entry.lastLog = lastEntryLogIdx;
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
    
    getLogIdxByUuid(uuid) {
        let foundLogIdx = 0;
        this.logs.forEach( (log) => {
            log.entries.forEach( (entry) => {
                if (uuid == entry.uuid) {
                    foundLogIdx = log.index;
                    return;
                    }
                });
        });

        return foundLogIdx;
    }
    
    getLastTimestampByUuid(uuid) {
        let foundLogIdx = -1;
        this.logs.forEach( (log) => {
            log.entries.forEach( (entry) => {
                if (uuid == entry.lastUuid) {
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
    
    getNextUid(uuid, results = []) {
        let foundLog = [];
        let foundHistory = [];
        let numbers = [];
        let length = this.logs.length;
        let i = 0;
        while (i < length) {
            this.logs[i].entries.forEach( (entry) => {
                if (uuid == entry.lastUuid) {
                    results.push(entry);
                    this.getNextUid(entry.uuid, results);
                }
            });
          i++;
        }
        return results;
    }
    
    getUuidNetwork(uuid, results = []) {
        let foundLog = [];
        let foundHistory = [];
        let numbers = [];
        let length = this.logs.length;
        let i = 0;
        while (i < length) {
            this.logs[i].entries.forEach( (entry) => {
                if (uuid == entry.lastUuid) {
                    results.push(entry);
                }
            });
          i++;
        }
        return results;
    }
    
    getUidHistory(uuid, results = []) {
        let foundLog = [];
        let foundHistory = [];
        let numbers = [];
        let length = this.logs.length;
        let i = 0;
        while (i < length) {
            this.logs[i].entries.forEach( (entry) => {
                if (uuid == entry.uuid) {
                    results.push(entry);
                    this.getUidHistory(entry.lastUuid, results);
                }
            });
          i++;
        }
        return results;
    }
    
    getSubsequence(uuid) {
        let foundEntries = [];
        foundEntries = this.getNextUid(uuid, foundEntries);
        return foundEntries;
    }
    
    getStrata(uuid) {
        let foundEntries = [];
        foundEntries = this.getUidHistory(uuid, foundEntries);
        return foundEntries;
    }
    
    traceStrata(uuid) {
        let foundEntries = [];
        foundEntries = this.getUidHistory(uuid, foundEntries);
        var resn = [];
        var resl = [];
        foundEntries.forEach((item, index) => {
        if (index + 1 < foundEntries.length) {
                var fixed = undefined;
                var center = Math.floor(foundEntries.length / 2);
                if(index === center) {
                    fixed = true;
                }
                var temporalOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                temporalOptions.timeZone = "UTC";
                temporalOptions.timeZoneName = "short";
                
                var node = {
                    id: index,
                    timestamp: new Date(item.timestamp * 1000),
                    lastUuid: item.lastUuid,
                    fortune: item.fortune,
                    status: item.status,
                    uuid: item.uuid,
                    fx: undefined,
                    localeDate: `${new Date(item.timestamp * 1000).toLocaleString("en-US")}`,
                    label: `${new Date(item.timestamp * 1000).toLocaleDateString("en-US")}`+ `\n... `+`${item.uuid.slice(-12)}`,
                    color: "#000000",
                    title: `when: `+`${new Date(item.timestamp * 1000).toLocaleString("en-US")}` + `\nuuid: `+`${item.uuid}`+`\nstatus: `+`${item.status}`+`\nfortune: `+`${item.fortune}`
                };
                var link = {
                    source: index,
                    target: index + 1,
                    from: index,
                    to: index + 1,
                    arrows: "to"
                };
                resn.push(node);
                resl.push(link);
            }
            else {
                var node = {
                    id: index,
                    timestamp: new Date(item.timestamp * 1000),
                    lastUuid: item.lastUuid,
                    fortune: item.fortune,
                    status: item.status,
                    uuid: item.uuid,
                    fx: undefined,
                    localeDate: `${new Date(item.timestamp * 1000).toLocaleString("en-US")}`,
                    label: `${new Date(item.timestamp * 1000).toLocaleDateString("en-US")}`+ `\n... `+`${item.uuid.slice(-12)}`,
                    color: "#000000",
                    title: `when: `+`${new Date(item.timestamp * 1000).toLocaleString("en-US")}` + `\nuuid: `+`${item.uuid}`+`\nstatus: `+`${item.status}`+`\nfortune: `+`${item.fortune}`
                };


                resn.push(node);

            }
          });
        const data = {
            nodes: resn,
            links: resl
          };
        return data;
    }
    
    traceSubsequence(uuid) {
        let foundEntries = [];
        foundEntries = this.getNextUid(uuid, foundEntries);
        var resn = [];
        var resl = [];
        foundEntries.forEach((item, index) => {
        if (index + 1 < foundEntries.length) {
                var fixed = undefined;
                var center = Math.floor(foundEntries.length / 2);
                if(index === center) {
                    fixed = true;
                }
                var node = {
                    id: index,
                    timestamp: new Date(item.timestamp * 1000),
                    lastUuid: item.lastUuid,
                    fortune: item.fortune,
                    status: item.status,
                    uuid: item.uuid,
                    fx: undefined,
                    localeDate: `${new Date(item.timestamp * 1000).toLocaleString("en-US")}`,
                    label: `${new Date(item.timestamp * 1000).toLocaleDateString("en-US")}`+ `\n... `+`${item.uuid.slice(-12)}`,
                    color: "#000000",
                    title: `when: `+`${new Date(item.timestamp * 1000).toLocaleString("en-US")}` + `\nuuid: `+`${item.uuid}`+`\nstatus: `+`${item.status}`+`\nfortune: `+`${item.fortune}`
                };
                var link = {
                    source: index,
                    target: index + 1,
                    from: index,
                    to: index + 1,
                    arrows: "to"
                };
                resn.push(node);
                resl.push(link);
            }
            else {
                var node = {
                    id: index,
                    timestamp: new Date(item.timestamp * 1000),
                    lastUuid: item.lastUuid,
                    fortune: item.fortune,
                    status: item.status,
                    uuid: item.uuid,
                    fx: undefined,
                    localeDate: `${new Date(item.timestamp * 1000).toLocaleString("en-US")}`,
                    label: `${new Date(item.timestamp * 1000).toLocaleDateString("en-US")}`+ `\n... `+`${item.uuid.slice(-12)}`,
                    color: "#000000",
                    title: `when: `+`${new Date(item.timestamp * 1000).toLocaleString("en-US")}` + `\nuuid: `+`${item.uuid}`+`\nstatus: `+`${item.status}`+`\nfortune: `+`${item.fortune}`
                };


                resn.push(node);

            }
          });
        const data = {
            nodes: resn,
            links: resl
          };
        return data;
    }
    
    traceUuidNetwork(uuid) {
        let foundEntries = [];
        foundEntries = this.getUuidNetwork(uuid, foundEntries);
        var resn = [];
        var resl = [];
        //console.log(foundEntries);
        foundEntries.forEach((item, index) => {
        if (index + 1 < foundEntries.length) {
                var fixed = undefined;
                var center = Math.floor(foundEntries.length / 2);
                if(index === center) {
                    fixed = true;
                }
                var node = {
                    id: index,
                    timestamp: new Date(item.timestamp * 1000),
                    lastUuid: item.lastUuid,
                    fortune: item.fortune,
                    status: item.status,
                    uuid: item.uuid,
                    fx: undefined,
                    localeDate: `${new Date(item.timestamp * 1000).toLocaleString("en-US")}`,
                    label: `${new Date(item.timestamp * 1000).toLocaleDateString("en-US")}`+ `\n... `+`${item.uuid.slice(-12)}`,
                    color: "#000000",
                    title: `when: `+`${new Date(item.timestamp * 1000).toLocaleString("en-US")}` + `\nuuid: `+`${item.uuid}`+`\nstatus: `+`${item.status}`+`\nfortune: `+`${item.fortune}`
                };
                var link = {
                    source: 0,
                    target: index + 1,
                    from: 0,
                    to: index + 1,
                    arrows: "to"
                };
                resn.push(node);
                resl.push(link);
            }
            else {
                var node = {
                    id: index,
                    timestamp: new Date(item.timestamp * 1000),
                    lastUuid: item.lastUuid,
                    fortune: item.fortune,
                    status: item.status,
                    uuid: item.uuid,
                    fx: undefined,
                    localeDate: `${new Date(item.timestamp * 1000).toLocaleString("en-US")}`,
                    label: `${new Date(item.timestamp * 1000).toLocaleDateString("en-US")}`+ `\n... `+`${item.uuid.slice(-12)}`,
                    color: "#000000",
                    title: `when: `+`${new Date(item.timestamp * 1000).toLocaleString("en-US")}` + `\nuuid: `+`${item.uuid}`+`\nstatus: `+`${item.status}`+`\nfortune: `+`${item.fortune}`
                };


                resn.push(node);

            }
          });
        var shuffled = resn.sort(() => 0.5 - Math.random());
        let fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229];
        var localhost = fib[Math.floor(Math.random()*fib.length)];
        console.log("localhost: " + localhost);
        let selectedNodes = shuffled.filter(function(){return true;}).slice(0, 100);
        let selectedLinks = [];
        for (let i = 0; i < selectedNodes.length; i++) {
            if (selectedNodes[i].id != 0) {
                var link = {
                    source: 0,
                    target: selectedNodes[i].id,
                    from: 0,
                    to: selectedNodes[i].id,
                    arrows: "to"
                };
                selectedLinks.push(link);
            }
        }
        const data = {
        nodes: selectedNodes,
        links: selectedLinks
        };
        //console.log("success-100");
        return data;
    }
    
    getLastLog() {
        let idx = this.logs.length-1;
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
}

module.exports = Logchain;
