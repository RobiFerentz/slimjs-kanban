document.registerElement(
    'new-task-modal',
    class extends SlimBaseElement {

        get updateOnAttributes() {
            return []
        }

        get template() {
            return `
                <div id="container">
                    <p>THIS IS A TEST</p>
                    <input id="submit" type="button" value="SUBMIT">
                </div>`
        }

        // @override abstract
        afterRender() {
            this.find('#submit').onclick = () => {
                if (this.validateForm()) {
                    this.submitForm()
                }
            }
        }
    })