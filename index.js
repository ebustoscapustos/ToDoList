const btnAdd = document.querySelector('.btn-add');
const btnClear = document.querySelector('.btn-clear');
const taskCreateField = document.querySelector('.task-create-field');
const taskField = document.querySelector('.task-field');
const sortMenu = document.getElementsByName('tasks-sort')


const store = {
    state: {
        tasks: [],
        currentFilterSlug: 'all'
    },
    get tasks() {
        return this.state.tasks
    },
    get currentFilterSlug() {
        return this.state.currentFilterSlug
    },
    set tasks(value) {
        this.state.tasks = value;
        render()
    },
    set currentFilterSlug(value) {
        this.state.currentFilterSlug = value
        render()    
    },
    filters: [
        {
            slug: 'completed',
            callback: (task) => task.completed
        },
        {
            slug: 'active',
            callback: (task) => !task.completed
        }
    ],
    get filteredTasks() {
        const currentFilter = this.filters.find((filter) => filter.slug === this.currentFilterSlug)
        if (!currentFilter) {
            return this.tasks
        }
        return this.tasks.filter(currentFilter.callback)
    }
}

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(store.tasks))
};

if (!localStorage.tasks) {
    store.state.tasks = []
} else {
    store.state.tasks = JSON.parse(localStorage.getItem('tasks'))
}



sortMenu.forEach((btn) => {
    btn.addEventListener('click', () => {
        store.currentFilterSlug = btn.value
    })
})





const eventBntAdd = (event) => {
    if (event.type !== 'click' && event.key !== 'Enter') return;
    let taskText
    if (taskCreateField.value) {
        taskText = taskCreateField.value
    } else {
        return
    }
    const task = {
        text: taskText,
        completed: false,
        edit: false,
        id: +new Date()
    }
    store.state.tasks.push(task)
    taskCreateField.value = ''
    render()
    updateLocal()
}

btnAdd.addEventListener('click', eventBntAdd)
taskCreateField.addEventListener('keyup', eventBntAdd);
btnClear.addEventListener('click', () => {
    store.state.tasks.splice(0,  store.state.tasks.length)
    render()
    updateLocal()
})





const createBtnCancel = (task) => {
    const btnCancel = document.createElement('button')
    btnCancel.textContent = 'Отменить'
    btnCancel.style.display = 'none'
    return btnCancel
}
const createBtnSave = (task) => {
    const btnSave = document.createElement('button')
    btnSave.textContent = 'Сохранить'
    btnSave.style.display = 'none'
    return btnSave
}

const createTaskUpdateField = (task) => {
    const taskUpdateField = document.createElement('input')
    taskUpdateField.style.display = 'none'
    return taskUpdateField
}

const createBtnComplete = (task) => {
    const btnComplete = document.createElement('button')
    btnComplete.textContent = 'Выполнить'
    btnComplete.addEventListener('click', () => {
        task.completed = !task.completed
        render()
        updateLocal()
    })
    return btnComplete
}
const createBtnUpdate = (task) => {
    const div = document.createElement('div')
    const btnUpdate = document.createElement('button')
    btnUpdate.textContent = 'Изменить'
    return btnUpdate
}
const createBtnDelete = (task) => {
    const btnDelete = document.createElement('button')
    btnDelete.textContent = 'Удалить'
    btnDelete.addEventListener('click', () => {
        // const taskNum =  store.state.tasks.indexOf(task)
        // store.state.tasks.splice(taskNum, 1)
        // render()
        store.tasks = store.tasks.filter((t) => t.id !== task.id)
        updateLocal()
    })
    
    return btnDelete
}



const editor = (task, elem) => {
    const divTaskUpdate = document.createElement('div')
    const btnUpdate = createBtnUpdate()
    const taskUpdateField = createTaskUpdateField()
    const btnSave = createBtnSave()
    const btnCancel = createBtnCancel()
    divTaskUpdate.append(taskUpdateField, btnUpdate, btnSave, btnCancel)
    const eventBntSave = () => {
        task.edit = false
        btnUpdate.style.display = 'block'
        taskUpdateField.style.display = 'none'
        btnSave.style.display = 'none'
        btnCancel.style.display = 'none'
        elem.style.display = 'block'
        task.text = taskUpdateField.value
        elem.textContent = task.text
        updateLocal()
    }
    const eventBntCancel = () => {
        task.edit = false
        btnUpdate.style.display = 'block'
        taskUpdateField.style.display = 'none'
        btnSave.style.display = 'none'
        btnCancel.style.display = 'none'
        elem.style.display = 'block'
        elem.textContent = task.text
        updateLocal()
    }
    btnUpdate.addEventListener('click', () => {
        task.edit = true
        task.edit ? taskUpdateField.style.display = 'block' : taskUpdateField.style.display = 'none'
        if (task.edit) {
            elem.style.display = 'none'
        }
        taskUpdateField.focus()
        // taskUpdateField.onblur = () => {
        //     taskUpdateField.value === task.text ? eventBntCancel() : 
            
            

        // }
        btnSave.style.display = 'block'
        btnCancel.style.display = 'block'
        btnUpdate.style.display = 'none'
        taskUpdateField.value = task.text
    })
    btnSave.addEventListener('click', () => {
        eventBntSave()
    })
    divTaskUpdate.addEventListener('keyup', (event) => {
        if (event.key == "Enter")
            eventBntSave()
    })
    btnCancel.addEventListener('click', () => {
        eventBntCancel()
    })
    divTaskUpdate.addEventListener('keyup', (event) => {
        if (event.key == 'Escape')
        eventBntCancel()
    })
    return divTaskUpdate
}



const createTaskTemplate = (task) => {
    const p = document.createElement('p')
    const li = document.createElement('li')
    if (task.completed === true) {
        li.classList.add('task-completed')
    }
    const btnDelete = createBtnDelete(task)
    const btnComplete = createBtnComplete(task)
    const divTaskUpdate = editor(task, p)
    p.textContent = task.text


    li.append(p, divTaskUpdate, btnComplete, btnDelete)
    taskField.append(li)
}







const render = () => {
    taskField.textContent = ''
    store.filteredTasks.forEach((task) => {
        createTaskTemplate(task)
    })
}


render()

