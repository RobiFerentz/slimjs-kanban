/**
 * Created by robertferentz on 2016-12-07.
 */
(function () {
    Slim('task-column', class extends SlimBaseElement {
        get template() {
            return `<span bind>[[data.name]]</span><s-repeat source="tasks"><task-item></task-item></s-repeat>`;
        }

        get tasks() {
            var result = this.data.getTasks()
            return result;
        }

        getColumnId(column) {
            return column.id
        }

        afterRender() {
            this.find('s-repeat').update()
        }

    })
}());
