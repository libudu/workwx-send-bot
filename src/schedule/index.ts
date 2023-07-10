import schedule from 'node-schedule'
import { getStore } from '../store/index.js'
import { sendMap } from '../send/index.js'

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

// 订阅store中记录的
export const scheduleStore = () => {
  // 每天9点看一下
  schedule.scheduleJob("0 0 9 * * *", () => {
    const { webhookList } = getStore()
    webhookList.forEach(({ webhook, rate, type }) => {
      if(rate === 'day' || rate === 'week' && new Date().getDay() === 1) {
        sendMap[type](webhook)
      }
    })
  })
}