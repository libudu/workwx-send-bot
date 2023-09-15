import { isDev } from "./env.js"
import { scheduleClockIn, scheduleStore } from "./schedule/index.js"
import { startServer } from "./server/index.js"
import { initStore } from "./store/index.js"

const main = async () => {
  console.log("是否为开发环境:", isDev)
  // 初始化持久化数据
  await initStore()
  // 订阅 store 自动推送
  scheduleStore()
  // 订阅打卡提醒
  scheduleClockIn()
  // 启动服务器
  startServer()
}

// todo:增加一键部署脚本

main()