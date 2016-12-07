let mongoClient = require('mongodb').MongoClient

exports = module.exports = {}

function log(msg) {console.log(`[Mongo] ${msg}`)}

let DB_URL = 'mongodb://localhost:27017/slimjs-kanban'
let COLLECTION_TASKS = 'tasks'
let COLLECTION_COLUMNS = 'columns'

exports.mongo = (function() {
    return {
        addColumn: function(column) {
            log(`Adding column ${JSON.stringify(column)}`)
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error adding column ${JSON.stringify(column)}: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_COLUMNS)
                        collection.insert(column, (err, result) => {
                            if(err) {
                                log(`Error inserting ${JSON.stringify(column)}: ${err}`)
                                reject(err)
                            } else {
                                log(`Successfully inserted ${JSON.stringify(column)}`)
                                resolve()
                            }
                            db.close()
                        })
                    }
                })
            })
        },
        getColumn: function(columnId) {
            log(`Getting column with ID '${columnId}'`)
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error getting column with ID '${columnId}': ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_COLUMNS)
                        let filter = {
                            id: columnId
                        }
                        log(columnId)
                        log(JSON.stringify({id: {$eq: columnId}}))
                        collection.find({id: {$eq: columnId}}).toArray((err, result) => {
                            if(err) {
                                log(`Error getting column with ID '${columnId}': ${err}`)
                                reject(err)
                            } else {
                                log(`Got column: ${result[0]}`)
                                resolve(result[0])
                            }
                        })
                    }
                })
            })
        }
    }
})()


////////////////////////
// TESTING AREA
function test() {
    let mongo = exports.mongo
    mongo.addColumn({
        id: '103',
        name: '103 Column'
    })
        .then(() => {
            log(`Successfully added column`)
        })
        .catch((err) => {
            log(`Error adding column: ${err}`)
        })

    mongo.getColumn('103')
        .then((column) => {
            log(`Got column: ${JSON.stringify(column)}`)
        })
        .catch((err) => {
            log(`Error getting column: ${err}`)
        })
}

// test()

////////////////////////