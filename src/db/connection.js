const mongoose = require("mongoose");
const { logger } = require("../utils/logger");


/**
 * @summary Set up the MongoDB connection
 * @param {string} uri
 * @param {string} dbName
 * */
async function connection(uri, dbName) {
    try {
        await mongoose.connect(uri , { dbName })
        console.log(`DATABASE CONNECTION SUCCESSFUL`)
    } catch (e) {
        logger.error(JSON.stringify(e))
    }

    //handle Unhandledrejection: Gracefully off the server
    process.on('unhandledRejection', error => {
        if (error) {
                logger.error(JSON.stringify(error))
                process.exit(1)
        } else {
            process.exit(1)
        }
    })
}

module.exports = connection;