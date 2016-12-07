document.registerElement(
    'new-task-modal',
    class extends SlimBaseElement {

        get updateOnAttributes() {
            return []
        }

        get template() {
            return `
                <section class="modal-container">
                    <div div="form-main">
                        <div class="form-div">
                            <div class="task-repeat"></div>
                            <h1 class="new-task-header"> Add A New Task </h1>
                            <form class="form" id="form1">
                                <p>
                                    <input name="task-title" type="text" class="validate[required,custom[task-title]] feedback-input task-title" id="name" placeholder="Title" />
                                </p>
                                <p> 
                                    <input name="task-duration" type="text" class="validate[required,custom[task-duration]] feedback-input task-duration" id="task-duration" placeholder="Duration" />
                                </p>
                                <p>
                                    <input name="task-due" type="text" class="validate[required,custom[email]] feedback-input task-due" id="task-due" placeholder="Due" />
                                </p>
                                <p>
                                    <textarea name="task-desc" class="validate[required,length[6,300]] feedback-input task-desc" id="task-desc" placeholder="Description"></textarea>
                                </p>
                                <div class="submit">
                                    <input type="submit" value="SUBMIT" name="submit" id="submit"/>
                                    <div class="ease"></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
                `
        }

        // @override abstract
        afterRender() {
            this.find('#submit').onclick = () => {
                if (this.validateForm()) {
                    this.submitForm()
                }
            }

            this.find('.task-repeat').onclick = () => {
                this.toggleRepeat();
            }
        }

        validateForm() {
            console.log('form validated!');
            return true;
        }

        submitForm() {
            window.alert('SUBMITTED!');
        }

        toggleRepeat() {
            window.alert('repeat toggled...');
        }
    })