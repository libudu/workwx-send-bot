import schedule from 'node-schedule'

// 每周一9：00播报
export const scheduleEveryWeek = (name: string, func: () => void) => {
  schedule.scheduleJob("0 0 9 * * 1", () => {
    func()
    console.log(new Date().toLocaleTimeString(), "执行任务", name)
  })
}

// 每天9：00播报
export const scheduleEveryDay = (name: string, func: () => void) => {
  schedule.scheduleJob("0 0 9 * * *", () => {
    func()
    console.log(new Date().toLocaleTimeString(), "执行任务", name)
  })
}