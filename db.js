const config = require('config');
const mongoose = require('mongoose')



class Database {
    options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }

    constructor() {
        this._connect();
    }

    async _connect() {
        try {
            await mongoose
                .connect(`mongodb://${config.get('dbConfig.host')}:${config.get('dbConfig.port')}/${config.get('dbConfig.dbName')}`, this.options);

            console.log(`Mongodb connected to database: '${config.get('dbConfig.dbName')}' successfully...`);
        } catch (ex) {
            console.error(`Failed to established connection with mongodb:`, ex.message)
        }
    }
}


module.exports = new Database();