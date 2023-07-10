import express from 'express'
import { InfoType, InfoTypeList, RateTypeList, subscribeWebhook, unsubscribeWebhook } from '../store/index.js'
import { sendMap } from '../send/index.js'

const app = express()

app.get("/", (req, res) => {
  res.send("hello this is wxwork-send-bot")
})

// 发送消息的二次封装网络接口
app.get("/send", async (req, res) => {
  const { type, webhook } = req.query
  if(typeof type === 'string' && typeof webhook === 'string' && typeof sendMap[type] === 'function') {
    try {
      const result = await sendMap[type](webhook)
      res.send({
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
      msg: "type 或 webhook 参数错误"
    })
  }
})

// 订阅
app.get('/wx/subscribe', async (req, res) => {
  const { type, webhook, rate, name } = req.query
  if(InfoTypeList.includes(type as any) && typeof webhook === 'string' && RateTypeList.includes(rate as any) && typeof name === 'string') {
    const webhookList = await subscribeWebhook({
      type: type as any,
      webhook,
      rate: rate as any,
      name,
    })
    if(webhookList) {
      res.send({
        msg: "订阅成功",
        data: webhookList,
      })
    } else {
      res.send({
        error: true,
        msg: "当前 webhook 订阅已经存在",
      })
    }
  } else {
    res.send({
      error: true,
      msg: "type 或 webhook 或 rate 参数错误"
    })
  }
})

// 取消订阅
app.get("/wx/unsubscribe", async (req, res) => {
  const { webhook, type } = req.query
  const result = await unsubscribeWebhook(webhook as string, type as InfoType)
  if(result === null) {
    res.send({
      error: true,
      msg: "取消订阅的webhook不存在"
    })
  } else {
    res.send({
      msg: "取消订阅成功",
      data: result,
    })
  }
})


export const startServer = (port = 3000) => {
  app.listen(port, () => {
    console.log("express 启动成功", "http://localhost:3000")
  })
}