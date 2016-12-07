;(function() {

    class Dispatcher {
        constructor() {
            var delegate = document.createDocumentFragment();
            ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(
                f => this[f] = (...xs) => delegate[f](...xs)
            )
            this.todos = []
        }
    }

    class KanbanModel extends Dispatcher {


        constructor() {
            super()
            this.columns = []
            this.tasks = []
        }

        getTasksByColumnId( columnId ) {
            return this.tasks.filter( (task) => {
                return task.columnId === columnId
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