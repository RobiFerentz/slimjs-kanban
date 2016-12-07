let express = require('express')
let bodyParser = require('body-parser');
let dbclient = require('./dbclient')

let app = express()
app.use(bodyParser.json())
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Content-Type', 'application/json')
    next();
})

function log(msg) {console.log(`[DB Server] ${msg}`)}

app.get('/', function (req, res) {
    let options = {
        'POST /column/add': {
            'description': 'Add a new column',
            'parameters': 'A JSON representation of the column in the body',
            'returns': 'The new column object'
        },
        'GET /column/get': {
            'description': 'Get all the columns',
            'returns': 'An array of column objects'
        },
        'GET /column/get?id=<columnId>': {
            'description': 'Get a column',
            'parameters': 'The ID of the column',
            'returns': 'The column object'
        },
        'POST /task/add': {
            'description': 'Add a new task',
            'parameters': 'A JSON representation of the task in the body',
            'returns': 'The new task object'
        },
        'GET /task/get': {
            'description': 'Get all the tasks',
            'returns': 'An array of task objects'
        },
        'GET /task/get?id=<taskId>': {
            'description': 'Get a task by the ID',
            'parameters': 'The ID of the task',
            'returns': 'The task object'
        },
        'GET /task/get?columnid=<columnId>': {
            'description': 'Get all tasks for a given column',
            'parameters': 'The ID of the column',
            'returns': 'An array of task objects'
        },
        'POST /task/update': {
            'description': 'Update a new task',
            'parameters': 'A JSON representation of the task in the body',
            'returns': 'The updated task'
        }
    }
    res.send(options)
})

app.post('/column/add', function (req, res) {
    let column = req.body
    log(`Adding column ${column}`);
    dbclient.addColumn(column)
        .then((result) => {
            log(`Successfully added column ${JSON.stringify(result)}`)
            res.send(result)
        })
        .catch((err) => {
            let msg = `Failed to add column ${JSON.stringify(column)}: ${err}`
            log(msg)
            res.send(msg)
        })
});

app.get('/column/get', function(req, res) {
    if(req.query.id) {
        let columnId = req.query.id
        log(`Getting column with ID '${columnId}'`)
        dbclient.getColumn(columnId)
            .then((result) => {
                log(`Got column ${JSON.stringify(result)}`)
                res.send(result)
            })
            .catch((err) => {
                let msg = `Failed to get all columns: ${err}`
                log(msg)
                res.send(msg)
            })
    } else {
        dbclient.getAllColumns()
            .then((result) => {
                log(`Got ${result.length} columns`)
                res.send(result)
            })
            .catch((err) => {
                let msg = `Failed to get all columns: ${err}`
                log(msg)
                res.send(msg)
            })
    }
})

app.post('/task/add', function(req, res) {
    let task = req.body
    log(`Adding task ${task}`);
    dbclient.addTask(task)
        .then((result) => {
            log(`Successfully added task ${JSON.stringify(task)}`)
            res.send(task)
        })
        .catch((err) => {
            let msg = `Failed to add task ${JSON.stringify(task)}: ${err}`
            log(msg)
            res.send(msg)
        })
})

app.get('/task/get', function(req, res) {
    if(req.query.id) {
        let taskId = req.query.id
        log(`Getting task by ID ${taskId}`)
        dbclient.getTaskById(taskId)
            .then((result) => {
                log(`Got task ${JSON.stringify(result)}`)
                res.send(result)
            })
            .catch((err) => {
                let msg = `Failed to get task with ID ${JSON.stringify(taskId)}: ${err}`
                log(msg)
                res.send(msg)
            })
    } else if(req.query.columnid) {
        let columnId = req.query.columnid
        log(`Getting task by column ID ${columnId}`)
        dbclient.getTasksByColumnId(columnId)
            .then((result) => {
                log(`Got ${result.length} tasks for column ID ${columnId}`)
                res.send(result)
            })
            .catch((err) => {
                let msg = `Failed to get task for column ID ${JSON.stringify(columnId)}: ${err}`
                log(msg)
                res.send(msg)
            })
    } else {
        log(`Getting all tasks`)
        dbclient.getAllTasks()
            .then((result) => {
                log(`Got ${result.length} tasks`)
                res.send(result)
            })
            .catch((err) => {
                let msg = `Failed to get all tasks: ${err}`
                log(msg)
                res.send(msg)
            })
    }
})

app.post('/task/update', function(req, res) {
    let task = req.body
    log(`Updating task ${task}`);
    dbclient.addTask(task)
        .then((result) => {
            log(`Successfully updated task ${JSON.stringify(task)}`)
            res.send(task)
        })
        .catch((err) => {
            let msg = `Failed to update task ${JSON.stringify(task)}: ${err}`
            log(msg)
            res.send(msg)
        })
})
app.listen(3003, function () {
    console.log('DB server listening on port 3003!')
})
