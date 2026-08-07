// 简易定时任务管理（每秒触发注册的任务）

interface TaskObj {
  name: string
  handle: (now: number) => void
}

const INTERVAL = 1

let taskList: TaskObj[] = []
const timeInterval = setInterval(() => {
  taskList.forEach((taskObj) => {
    taskObj.handle(Date.now())
  })
}, INTERVAL * 1000)

// 暴露给调试用（保持原行为）
;(window as unknown as { taskList: TaskObj[] }).taskList = taskList

export function addTask(taskObj: TaskObj): void {
  if ('name' in taskObj && 'handle' in taskObj) {
    if (!taskList.some((obj) => obj.name === taskObj.name)) {
      taskList.push(taskObj)
    }
  }
}

export function removeTask(taskName: string | number): void {
  taskList = taskList.filter((taskObj) => taskObj.name !== taskName.toString())
}

export function clearTaskList(): void {
  taskList = []
}

export function destroy(): void {
  taskList = []
  clearInterval(timeInterval)
}
