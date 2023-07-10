import { isDev } from "./env.js"
import { scheduleStore } from "./schedule/index.js"
import { startServer } from "./server/index.js"
import { initStore } from "./store/index.js"

const main = async () => {
  console.log("是否为开发环境:", isDev)
  // 初始化持久化数据
  await initStore()
  // 订阅store自动推送
  scheduleStore()
  // 启动服务器
  startServer()
}

// todo:增加一键部署脚本

main()