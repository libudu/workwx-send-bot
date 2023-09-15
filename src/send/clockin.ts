import axios from "axios"
import { CLOCKIN_WEBHOOK } from "../env.js"

export const sendClockIn = async ({
  type,
}:{
  type: 'clockin' | 'clockout'
}) => {
  let typeStr = '上班'
  if(type === 'clockout') {
    typeStr = '下班'
  }
  await axios.post(CLOCKIN_WEBHOOK, {
    msgtype: "markdown",
    markdown: {
      content: `[${typeStr}打卡提醒] 要${typeStr}了，记得赶紧打卡哟`,
    }
  })
}