import { weixin_webhook_list } from "./config.js"
import { scheduleEveryDay } from "./schedule/index.js"
import { sendBestofjs } from "./send/bestofjs.js"
import { sendInfoq } from "./send/infoq.js"
import { startServer } from "./server/index.js"

export const sendMap = {
  bestofjs: sendBestofjs,
  infoq: sendInfoq,
}

const test_web_hook = weixin_webhook_list[0]

scheduleEveryDay("每天定时发送到测试群", () => {
  sendBestofjs(test_web_hook)
  sendInfoq(test_web_hook)
})

startServer()