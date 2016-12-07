Slim('task-item', class extends SlimBaseElement {



    get template() {
        return `
<div class="task-name" bind>[[name]]</div>
`
    }


})