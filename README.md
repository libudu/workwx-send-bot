基于 webhook 的微信机器人，每周推送最新 infoq 和 bestofjs 咨询

资讯来源：

bestofjs：https://bestofjs.org/

infoq：https://www.infoq.cn/

工作原理：

1、订阅资讯类型和指定发送的 webhook

2、到了对应推送的时间，请求接口获取资讯数据，按照模板渲染成 markdown 文本，发送到 webhook

3、企业微信中添加了对应机器人的所有群聊都会收到推送消息

注意事项：

1、由于垃圾企业微信机器人的特性，webhook 机器人发送消息无法指定群聊，一旦发送消息所有添加了机器人的群聊都会收到消息。建议每种消息类型设置一个线上机器人，每周只固定时间发送一次消息。然后设置一个私有的测试机器人，只在测试群聊添加，每天发送消息确保后台运行正常。

2、基于 webhook 的机器人对于开发者来说天然缺乏安全性和隐私性，所有群员都能看到 webhook 地址且消息发送者无法溯源。任何原因导致的刷屏或不良有害消息与本作者无关。

3、sb微信！能用飞书的早点用飞书！飞书文档天下第一！！！！！

## 特性

订阅推送：通过 HTTP 接口或 json 文件对指定群聊机器人订阅指定消息类型

指定频率：可以每周推送一次或每日推送一次

易于拓展：简易拓展任何基于其他平台其他接口的其他消息类型

易于配置：配置项收敛于 config.ts 中，易于配置和定制化


## 基础命令

`yarn` 安装依赖

`yarn start` 启动

`yarn build` 构建

## 接口说明

订阅推送

/wx/subscribe?type=订阅类型&webhook=企业微信机器人webhook&rate=推送频率&name=订阅名称

订阅类型 type：当前仅支持infoq和bestofjs

推送频率 rate：day或week，day表示每天上午9点，week表示每周一上午9点。建议本项目的开发和测试群每天推送用以确认程序流程正确，线上大群每周推送

订阅名称：没有实际作用，仅作为此条订阅的备注，说明订阅的是哪个群，避免订阅群聊过多后无法区分

<br />

取消订阅

/wx/unsubscribe?webhook=企业微信机器人webhook&type=订阅类型

订阅类型 type 同上

## 配置项

/src/config.ts

DEFAULT_SERVER_PORT：服务器启动的端口，默认 3000 地址

SCHEDULE_PUSH_HOUR：订阅推送的整点时间，默认9点推送

SCHEDULE_PUSH_WEEK_DAY：订阅每周推送的周几，默认每周一推送

## 二次开发

### 概述

/send：

fetchDataList：通过 axios 爬取接口，生成统一格式数据

makeTemplate：提供一个 template 渲染函数，将列表数据渲染成文本

makeSender：将 fetchDataList 和 makeTempalte 封装成一个传入 webhook 就能发送消息的功能函数

sendMap：各种类型消息的 sender 的查找表

/server：

提供了发送消息、订阅、取消订阅、查询订阅的 HTTP 接口

/schedule：

定时发送器，按照订阅记录定时对指定 webhook 推送消息

/store：

使用本地 json 文件进行本地化存储，同步内存 store 对象和 json 持久化存储文件

### 如何添加一个新类型的消息推送

在 /send 下新建一个文件，编写 fetchDataList 和 makeTemplate 函数，传递给 makeSender 生成sender并导出

在 /send/index.ts 的 sendMap 中增加配置

之后就可以发送或订阅此类型的消息了

