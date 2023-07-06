import { sendBestofjs } from "./send/bestofjs.js"
import { sendInfoq } from "./send/infoq.js"
import express from 'express'

const sendMap = {
  bestofjs: sendBestofjs,
  infoq: sendInfoq,
}

const app = express()

app.get("/", (req, res) => {
  res.send("hello this is wxwork-send-bot")
})

app.get("/send", async (req, res) => {
  const { type, web_hook } = req.query
  if(type && web_hook && typeof type === 'string' && typeof web_hook === 'string' && typeof sendMap[type] === 'function') {
    try {
      const result = await sendMap[type](web_hook)
      res.send({
        error: false,
        data: result,
      })
    } catch (error) {
      res.send({
        error: true,
        data: error,
      })
      console.log("error", error)
    }
  } else {
    res.send({
      error: true,
      msg: "type 或 web_hook 参数错误"
    })
  }
})

app.listen(3000, () => {
  console.log("express 启动成功", "http://localhost:3000")
})