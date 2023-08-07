import schedule from 'node-schedule'
import { getStore } from '../store/index.js'
import { sendMap } from '../send/index.js'
import { SCHEDULE_PUSH_HOUR, SCHEDULE_PUSH_WEEK_DAY } from '../config.js'

// // 每周一9：00播报
// export const scheduleEveryWeek = (name: string, func: () => void) => {
//   schedule.scheduleJob("0 0 9 * * 1", () => {
//     func()
//     console.log(new Date().toLocaleTimeString(), "执行任务", name)
//   })
// }

// // 每天9：00播报
// export const scheduleEveryDay = (name: string, func: () => void) => {
//   schedule.scheduleJob("0 0 9 * * *", () => {
//     func()
//     console.log(new Date().toLocaleTimeString(), "执行任务", name)
//   })
// }

// 订阅store中记录的
export const scheduleStore = () => {
  // 每天9点看一下
  schedule.scheduleJob(`0 0 ${SCHEDULE_PUSH_HOUR} * * *`, () => {
    const { webhookList } = getStore()
    webhookList.forEach(({ webhook, rate, type }) => {
      const send = () => sendMap[type](webhook)
      if(rate === 'day' && new Date().getDay() !== SCHEDULE_PUSH_WEEK_DAY) {
        send()
      }
      if(rate === 'week' && new Date().getDay() === SCHEDULE_PUSH_WEEK_DAY) {
        send()
      }
    })
  })
}