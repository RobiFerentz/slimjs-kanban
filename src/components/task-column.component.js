/**
 * Created by robertferentz on 2016-12-07.
 */
(function () {
    Slim('task-column', class extends SlimBaseElement {
        get template() {
            return `<span bind>[[data.name]]</span><s-repeat source="tasks" ><s-container bind>[[data.what]]</s-container></s-repeat>`;
        }


        // onCreated()(value) {
        //     this._model = value;
        //     this.model.load();
        //     this.model.addEventListener('change', update.bind(this))
        // }
        get tasks () {
            return [ '1', '2' , '3'].map( (what) => {
                return { what };
            });
        }

        afterRender() {
            this.find('s-repeat').update()
        }

    })
}());
