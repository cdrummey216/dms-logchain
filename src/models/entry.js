const crypto = require('crypto');
class Entry {
    constructor(lastGuid, lastLog, status, fortune) {
        if (!lastGuid)
            let lastGuid = "10000000-1000-4000-8000-100000000000";
        if (!lastLog)
            let lastLog = 0;
        if (!status)
            let status = "alive";
        if (!fortune)
            let fortune = "hello, world";

        this.guid = crypto.randomUUID();
        this.lastGuid = lastGuid;
        this.lastLog = lastLog;
        this.status = status;
        this.fortune = fortune;
        this.timestamp = Math.floor(+new Date() / 1000);
    }
}

module.exports = Entry;