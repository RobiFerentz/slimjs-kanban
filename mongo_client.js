let mongoClient = require('mongodb').MongoClient
let ObjectId = require('mongodb').ObjectId

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
                                log(`Error adding column ${JSON.stringify(column)}: ${err}`)
                                reject(err)
                            } else {
                                log(`Successfully added column ${JSON.stringify(column)}`)
                                column.id = column._id
                                resolve(column)
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
                        log(`Error getting column with ID ${columnId}: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_COLUMNS)
                        let filter = {
                            _id: ObjectId(columnId)
                        }
                        collection.find(filter).toArray((err, result) => {
                            if(err) {
                                log(`Error getting column with ID ${columnId}: ${err}`)
                                reject(err)
                            } else if(result.length == 0) {
                                log(`Cannot find column with ID ${columnId}`)
                                reject('Not found')
                            } else {
                                result[0].id = result[0]._id
                                log(`Got column: ${result[0]}`)
                                resolve(result[0])
                            }
                            db.close()
                        })
                    }
                })
            })
        },
        addTask: function(task) {
            log(`Adding task ${JSON.stringify(task)}`)
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error adding task ${JSON.stringify(task)}: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_TASKS)
                        collection.insert(task, (err, result) => {
                            if(err) {
                                log(`Error adding task ${JSON.stringify(task)}: ${err}`)
                                reject(err)
                            } else {
                                log(`Successfully added task ${JSON.stringify(task)}`)
                                task.id = task._id
                                resolve(task)
                            }
                            db.close()
                        })
                    }
                })
            })
        },
        getTaskById: function(taskId) {
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error getting task with ID ${taskId}: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_TASKS)
                        let filter = {
                            _id: ObjectId(taskId)
                        }
                        collection.find(filter).toArray((err, result) => {
                            if(err) {
                                log(`Error getting task with ID ${taskId}: ${err}`)
                                reject(err)
                            } else if(result.length == 0) {
                                log(`Cannot find task with ID ${taskId}`)
                                reject('Not found')
                            } else {
                                log(`Got task: ${result[0]}`)
                                resolve(result[0])
                            }
                            db.close()
                        })
                    }
                })
            })
        }
    }
})()


////////////////////////
// TESTING AREA

function deleteAll() {
    log('========= deleting all colections =========')
    mongoClient.connect(DB_URL, function (err, db) {
        db.collection(COLLECTION_TASKS).deleteMany()
        db.collection(COLLECTION_COLUMNS).deleteMany()
    })
}

function testColumn() {
    let mongo = exports.mongo
    mongo.addColumn({
        name: 'some great column'
    })
        .then((column) => {
            log(`Successfully added column: ${JSON.stringify(column)}`)

            mongo.getColumn(column.id)
                .then((result) => {
                    log(`Got column: ${JSON.stringify(result)}`)
                })
                .catch((err) => {
                    log(`Error getting column: ${err}`)
                })
        })
        .catch((err) => {
            log(`Error adding column: ${err}`)
        })

}

function testTask() {
    let mongo = exports.mongo
    mongo.addTask({
        columnId: 'abc',
        name: 'first task',
        due: 'sometime'
    })
        .then((task) => {
            log(`Successfully added task: ${JSON.stringify(task)}`)

            let taskId = task.id

            mongo.getTaskById(taskId)
                .then((result) => {
                    log(`Got task: ${JSON.stringify(result)}`)
                })
                .catch((err) => {
                    log(`Error getting task: ${err}`)
                })
        })
        .catch((err) => {
            log(`Error adding task: ${err}`)
        })
}

////////////////////////

// deleteAll()
// testColumn()
// testTask()

////////////////////////