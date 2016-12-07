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

    for (let x = 0; x < 3; x++) {
        instance.columns.push({
            name: `column ${x+1}`,
            id: x,
            getTasks: function() {
                return instance.getTasksByColumnId( this.id )
            }
        })
    }

    for (let x = 0; x < 10; x++) {
        instance.tasks.push({
            id: x,
            columnId: x % 3,
            name: `task number ${x + 1}`
        })
    }



    SlimInjector.define('model', () => { return instance })



} )()