import { scheduleEveryDay } from "./schedule/index.js"
import { sendBestofjs } from "./send/bestofjs.js"
import { sendInfoq } from "./send/infoq.js"
import { startServer } from "./server/index.js"
import { initStore } from "./store/index.js"

export const sendMap = {
  bestofjs: sendBestofjs,
  infoq: sendInfoq,
}


initStore().then(() => {
  startServer()
});