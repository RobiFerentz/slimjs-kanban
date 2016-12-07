/**
 * Created by robertferentz on 2016-12-07.
 */

(function () {
    Slim('app-root', class extends SlimBaseElement {
        set model (value) {
            this._model = value;
            this.model.load();
            this.model.addEventListener('change', update.bind(this))
        }
        get model () {
            return this._model;
        }

    })
}());
