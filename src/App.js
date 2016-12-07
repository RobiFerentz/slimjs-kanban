/**
 * Created by robertferentz on 2016-12-07.
 */

(function () {
    Slim('app-root', class extends SlimBaseElement {

        afterRender() {
            console.log(this.model)
        }

        get columns() {
            return this.model.columns
        }

        get template() {
            return `<div style="flex-grow:3000"><button value="Add new task"></button></div>
<s-repeat source="columns"><task-column></task-column></s-repeat>
<new-task-modal task-data="[model]"></new-task-modal>`
        }

        render() {
            this.find('new-task-modal').style.display = 'none'
        }

        afterRender() {
            this.find('s-repeat').update()
            this.find('button').onclick = () => {
                this.startModal()
            }
            this.model.addEventListener('change', () => {
                this.update(true)
            })
        }

        startModal() {
            this.find('new-task-modal').style.display = 'initial'
        }

    })
}());
