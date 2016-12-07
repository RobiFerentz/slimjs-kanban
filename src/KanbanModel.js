;(function() {

    var endpoint = 'http://localhost:3003';

    class Dispatcher {
        constructor() {
            var delegate = document.createDocumentFragment();
            ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(
                f => this[f] = (...xs) => delegate[f](...xs)
            )
        }
    }

    class KanbanModel extends Dispatcher {


        constructor() {
            super()
            this.defaultColumnId = null;
            this._columns = {}
            this._tasks = []
            this.loadColumns()
        }

        loadColumns() {
            $.ajax(`${endpoint}/column/get`).done( (response) => {
                this.parseColumnsFromServer(response);
                console.log(this.columns)
                this.loadTasks()
            })
        }

        loadTasks() {
            $.ajax(`${endpoint}/task/get`).done( (response) => {
                this.parseItemsFromServer(response)
                console.log(this.tasks);
                this.dispatchEvent(new Event('change'))
            })
        }

        parseColumnsFromServer( data ) {
            this.defaultColumnId = null;
            this._columns = {}
            data.forEach( column => {
                if (!this.defaultColumnId) {
                    this.defaultColumnId = column._id
                }
                this._columns[column._id] = column
            })
        }

        parseItemsFromServer(data) {
            this._tasks = data;
        }

        get columns() {
            var result = []
            for (var id in this._columns) {
                result.push( {
                    id: id,
                    name: this._columns[id].name,
                    getTasks: function() {
                        return instance.getTasksByColumnId( this.id )
                    }
                })
            }
            return result;
        }

        get tasks() {
            return this._tasks
        }

        getTasksByColumnId( columnId ) {
            return this.tasks.filter( (task) => {
                return task.columnId === columnId
            })
        }

        addTask(task, callback) {
            task.columnId = this.defaultColumnId
            $.post(`${endpoint}/task/add`, task).done( () => {
                this.loadColumns();
                callback()
            })
        }

        moveTask(task, column) {
            task.columnId = column.id;
            this.dispatchEvent(new Event('change'))
        }


    }
    const instance = new KanbanModel()



    SlimInjector.define('model', () => { return instance })



} )()