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
            return `<s-repeat source="columns"><task-column></task-column></s-repeat>`;
        }

        afterRender() {
            this.find('s-repeat').update()
        }

    })
}());
