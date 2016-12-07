let express = require('express')
var bodyParser = require('body-parser');
let dbclient = require('./dbclient')

let app = express()
app.use(bodyParser.json())

function log(msg) {console.log(`[DB Server] ${msg}`)}

app.get('/', function (req, res) {
    let options = {
        'POST /column/add': {
            'description': 'Add a new column',
            'parameters': 'A JSON representation of the column in the body',
            'returns': 'The new column, with an "id" field'
        },
        'GET /column/get?id=<columnId>': {
            'description': 'Get a column',
            'parameters': 'The ID of the column',
            'returns': 'The column object'
        },
        'POST /task/add': {
            'description': 'Add a new task',
            'parameters': 'A JSON representation of the task in the body',
            'returns': 'The new task, with an "id" field'
        },
        'GET /task/get?id=<taskId>': {
            'description': 'Get a task by the ID',
            'parameters': 'The ID of the task',
            'returns': 'The task object'
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
    let columnId = req.query.id
    log(`Getting column with ID '${columnId}'`)
    dbclient.getColumn(columnId)
        .then((result) => {
            log(`Got column ${JSON.stringify(result)}`)
            res.send(result)
        })
        .catch((err) => {
            let msg = `Failed to get column with ID ${JSON.stringify(columnId)}: ${err}`
            log(msg)
            res.send(msg)
        })
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
            let msg = `Failed to add column ${JSON.stringify(column)}: ${err}`
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
    }
})

app.listen(3003, function () {
    console.log('DB server listening on port 3003!')
})
