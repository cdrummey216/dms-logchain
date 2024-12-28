const Entry = require('./entry');

class Entries {
    constructor() {
        this.list = [];
    }

    add(req, res) {
        let response = '';

        try {
            let entry = new Entry(req.body.lastGuid, req.body.lastLog, req.body.status, req.body.fortune);
            this.list.push(entry);
            response = entry.guid;

        } catch(ex) {
            res.status(406);
            response = {'error': ex.message};
        }

        res.json(response);
    }

    get() {
        return this.list;
    }

    reset() {
        this.list = [];
    }
}

module.exports = Entries;
