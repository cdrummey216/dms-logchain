const crypto = require('crypto');
class Entry {
    constructor(lastGuid, lastLog, status, fortune) {
        if (!lastGuid) {
            this.lastGuid = "10000000-1000-4000-8000-100000000000";
        }
        else {
            this.lastGuid = lastGuid;
        }
        
        if (!lastLog || isNaN(lastLog)) {
            this.lastLog = 0;
        }            
        else {
            this.lastLog = lastLog;
        }
        
        if (!status) {
            this.status = "alive";
        }            
        else {
            this.status = status;
        }
        
        if (!fortune) {
            this.fortune = "hello, world";
        }            
        else {
            this.fortune = fortune;
        }

        this.guid = crypto.randomUUID();
        this.timestamp = Math.floor(+new Date() / 1000);
    }
}

module.exports = Entry;
