const { biodata, writeBio } = require('./connect')

class Biodata {
    static read(callback) {
        callback(biodata);
    }

    static create(biodatum, callback) {
        // console.log(biodata, biodatum)
        biodata.push(biodatum);
        writeBio(biodata, callback);
    }

    static update(biodatum, id, callback) {
        biodata[id] = biodatum;
        writeBio(biodata, callback);
    }

    static delete(id, callback) {
        biodata.splice(id, 1);
        writeBio(biodata, callback);
    }
}

module.exports = Biodata;

