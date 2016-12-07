Slim('task-item', class extends SlimBaseElement {



    get template() {
        return `
        <article class="card-container">
        <span style="display:inline-block; width:70%">
            <h2 class="card-task-name" bind>[[name]]</h2>
            <p class="card-task-desc" bind>[[description]]</p>
        </span>
        <span>
            <div class="card-vertical-spacer"></div>
            <span class="card-task-due" bind>[[dueDate]]</span>
        </span>
        </article>
        `
    }


})