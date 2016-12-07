let config = require('./db_config').mongodb_config
let mongoClient = require('mongodb').MongoClient
let ObjectId = require('mongodb').ObjectId

exports = module.exports = {}

function log(msg) {console.log(`[Mongo] ${msg}`)}

let DB_URL = config.url
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
                                resolve(column)
                            }
                            db.close()
                        })
                    }
                })
            })
        },
        getAllColumns: function() {
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error getting all columns: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_COLUMNS)
                        collection.find().toArray((err, result) => {
                            if(err) {
                                log(`Error getting all columns: ${err}`)
                                reject(err)
                            } else {
                                log(`Got ${result.length} columns`)
                                resolve(result)
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
                                resolve(task)
                            }
                            db.close()
                        })
                    }
                })
            })
        },
        getAllTasks: function() {
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error getting all tasks: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_TASKS)
                        collection.find().toArray((err, result) => {
                            if(err) {
                                log(`Error getting all tasks: ${err}`)
                                reject(err)
                            } else {
                                log(`Got ${result.length} tasks`)
                                resolve(result)
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
                                resolve({})
                            } else {
                                log(`Got task: ${result[0]}`)
                                resolve(result[0])
                            }
                            db.close()
                        })
                    }
                })
            })
        },
        getTasksByColumnId: function(columnId) {
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error getting tasks by column ID ${columnId}: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_TASKS)
                        let filter = {
                            columnId: {$eq: columnId}
                        }
                        collection.find(filter).toArray((err, result) => {
                            if(err) {
                                log(`Error getting tasks by column ID ${columnId}: ${err}`)
                                reject(err)
                            } else {
                                log(`Got ${result.length} tasks`)
                                resolve(result)
                            }
                            db.close()
                        })
                    }
                })
            })
        },
        updateTask: function(task) {
            return new Promise((resolve, reject) => {
                mongoClient.connect(DB_URL, function (err, db) {
                    if(err) {
                        log(`Error updating task ${task}: ${err}`)
                        reject(err)
                    } else {
                        let collection = db.collection(COLLECTION_TASKS)
                        let filter = {
                            _id: task._id
                            // _id: ObjectId(task._id)
                        }
                        collection.replaceOne(filter, task)
                            .then(() => {
                                log(`Successfully updated task ${task}`)
                                resolve(task)
                            })
                            .catch((err) => {
                                log(`Error updating task ${task}: ${err}`)
                                reject(err)
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

function testTasks() {
    let mongo = exports.mongo
    let promises = []
    promises.push(mongo.addTask({
        columnId: 'colA',
        name: 'A first task'
    }))
    promises.push(mongo.addTask({
        columnId: 'colB',
        name: 'B first task'
    }))
    promises.push(mongo.addTask({
        columnId: 'colA',
        name: 'A second task'
    }))
    Promise.all(promises)
        .then(() => {
            mongo.getTasksByColumnId('colA')
                .then((results) => {
                    log('Got ${results.length} tasks:')
                    for(let i = 0; i < results.length; i++ ) {
                        log(`${JSON.stringify(results[i])}`)
                    }
                })
                .catch((err) => {
                    log(`Error getting the tasks: ${err}`)
                })
        })
        .catch((err) => {
            log(`Some kind of error has occured: ${err}`)
        })
}

////////////////////////

// deleteAll()
// testColumn()
// testTask()
// testTasks()

////////////////////////
