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
                            <!-- <div class="task-repeat"></div> -->
                            <h1 class="new-task-header"> Add A New Task </h1>
                            <form class="form" id="form1">
                                <p>
                                    <input name="task-title" type="text" class="validate[required,custom[task-title]] feedback-input task-title" id="name" placeholder="Title" />
                                </p>
                                <!--
                                <p> 
                                    <input name="task-duration" type="number" min="0" max="120" class="validate[required,custom[task-duration]] feedback-input task-duration" id="task-duration" placeholder="Duration" />
                                </p>
                                -->
                                <p>
                                    <input name="task-due" type="date" class="validate[required,custom[email]] feedback-input task-due" id="task-due" placeholder="Due" />
                                </p>
                                <p>
                                    <textarea name="task-desc" class="validate[required,length[6,300]] feedback-input task-desc" id="task-desc" placeholder="Description"></textarea>
                                </p>
                                <div class="submit">
                                    <input type="button" value="SUBMIT" name="submit" id="submit"/>
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

            this.find('.task-title').onclick = () => {
                this.fieldReset('.task-title');
            }
            // this.find('.task-duration').onclick = () => {
                // this.fieldReset('.task-duration');
            // }
            this.find('.task-due').onclick = () => {
                this.fieldReset('.task-due');
            }
/*
            this.find('.task-repeat').onclick = () => {
                this.toggleRepeat();
            }
*/
            console.log('This is the taskdata:' , this.taskData);
        }

        validateForm() {
            let titleValidated = (this.find('.task-title').value.length > 0);
            let dueValidated = (this.find('.task-due').value.length > 0);

            if (!titleValidated) {
                this.find('.task-title').style.boxShadow = '0px 0px 5px red'
            }

            if (!dueValidated) {
                this.find('.task-due').style.boxShadow = '0px 0px 5px red'
            }

            return titleValidated && dueValidated
        }

        submitForm() {
            this.taskData.addTask({
                name: this.find('.task-title').value,
                // duration: this.find('.task-duration').value,
                dueDate: this.find('.task-due').value,
                description: this.find('.task-desc').value
            }, this.closeModal.bind(this));
        }

        closeModal() {
            this.style.display = 'none'
            this.fieldReset();
        }

        toggleRepeat() {
            window.alert('repeat toggled...')
        }

        fieldReset(field) {
            this.find(field).style.boxShadow = '';
        }
    })