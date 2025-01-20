const crypto = require('crypto');
class Entry {
    constructor(lastUuid, lastLog, status, fortune) {
        if (!lastUuid) {
            this.lastUuid = "10000000-1000-4000-8000-100000000000";
        }
        else {
            this.lastUuid = lastUuid;
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
            this.fortune = "but you did not look to the One who made it, or have regard for the One who planned it long ago";
        }            
        else {
            this.fortune = fortune;
        }

        this.guid = crypto.randomUUID();
        this.timestamp = Math.floor(+new Date() / 1000);
    }
}

module.exports = Entry;
