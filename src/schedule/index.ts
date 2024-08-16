import schedule from 'node-schedule'
import { getStore } from '../store'
import { sendMap } from '../send'
import { SCHEDULE_PUSH_HOUR, SCHEDULE_PUSH_WEEK_DAY } from '../config'
import { sendClockIn } from '../send/clockin'
import { CLOCKIN_WEBHOOK } from '../env'

// 定时打卡提醒
export const scheduleClockIn = () => {
  if(!CLOCKIN_WEBHOOK) {
    console.log('[info] 未设置打卡提醒 webhook，不会进行打卡提醒')
    return
  }
  console.log('[info] 已设置打卡提醒 webhook')
  schedule.scheduleJob('0 50 8 * * 1-5', async () => {
    sendClockIn({ type: 'clockin' })
  })
  schedule.scheduleJob('0 30 18 * * 1-5', async () => {
    sendClockIn({ type: 'clockout' })
  })
}

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