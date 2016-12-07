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
            'parameters': 'A JSON object in the body, containing the ID and name of the column'
        },
        'GET /column/get?id=<columnId>': {
            'description': 'Get a column',
            'parameters': 'The ID of the column'
        }
    }
    res.send(options)
})

app.post('/column/add', function (req, res) {
    log(`Adding column ${req.body}`);
    dbclient.addColumn(req.body)
        .then(() => {
            let msg = `Successfully added column ${JSON.stringify(req.body)}`
            log(msg)
            res.send(msg)
        })
        .catch((err) => {
            let msg = `Failed to add column ${JSON.stringify(req.body)}: ${err}`
            log(msg)
            res.send(msg)
        })
});

app.get('/column/get', function(req, res) {
    let columnId = req.query.id
    log(`Getting column with ID '${columnId}'`)
    dbclient.getColumn(columnId)
        .then((result) => {
            let msg = `Got column ${JSON.stringify(result)}`
            log(msg)
            res.send(result)
        })
        .catch((err) => {
            let msg = `Failed to get column with ID '${JSON.stringify(columnId)}: ${err}`
            log(msg)
            res.send(msg)
        })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
