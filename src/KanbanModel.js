;(function() {

    var endpoint = 'http://localhost:3003';

    class Dispatcher {
        constructor() {
            var delegate = document.createDocumentFragment();
            ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(
                f => this[f] = (...xs) => delegate[f](...xs)
            )
            this.todos = []
            this.columns = {}
            this.load()
        }
    }

    class KanbanModel extends Dispatcher {


        constructor() {
            super()
            this.columns = []
            this.tasks = []
        }

        load() {
            $.ajax(`${endpoint}/task/get`).done( (response) => {
                console.log(response)
            })
        }

        parseItemsFromServer(data) {

        }

        getTasksByColumnId( columnId ) {
            return this.tasks.filter( (task) => {
                return task.columnId === columnId
            })
        }

        addTask(task) {
            task.id = this.tasks.length
            this.tasks.push(task)
            this.dispatchEvent(new Event('change'))
        }

        moveTask(task, column) {
            task.columnId = column.id;
            this.dispatchEvent(new Event('change'))
        }


    }
    const instance = new KanbanModel()



    SlimInjector.define('model', () => { return instance })



} )()