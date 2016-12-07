/**
 * Created by robertferentz on 2016-12-07.
 */

(function () {
    Slim('app-root', class extends SlimBaseElement {

        afterRender() {
            console.log(this.model)
        }

        // set model(value){
        //     this._model = value;
        // }
        //
        // get model() {
        //     return this._model;
        // }

        get columns() {
            return [{ name: 'col 1'}, { name: 'col 2'}, { name: 'col 3'}]
        }

        get template() {
            return `<s-repeat source="columns"><task-column></task-column></s-repeat>`;
        }

    })
}());
