const INTERVAL = 1

let taskList = []
let timeIntervel = setInterval(() => {
    taskList.forEach(taskObj => {
        taskObj.handle(Date.now())
    })
}, INTERVAL * 1000)
window.taskList = taskList
console.log('time init')

export function addTask(taskObj) {
    if ('name' in taskObj && 'handle' in taskObj) {
        if (!taskList.some(obj => {
            return obj.name === taskObj.name
        })) {
            taskList.push(taskObj)
        }
    }
}

export function removeTask(taskName) {
    taskList = taskList.filter(taskObj => {
        return taskObj.name !== taskName.toString()
    })
}

export function clearTaskList(taskName) {
    taskList = []
}

export function destroy(taskName) {
    taskList = null
    clearInterval(timeIntervel)
}