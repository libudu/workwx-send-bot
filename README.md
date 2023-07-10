基于 webhook 的微信机器人，每周推送最新 infoq 和 bestofjs 咨询

`yarn start` 启动

`yarn build` 构建

## 接口说明

订阅推送

/wx/subscribe?type=订阅类型&webhook=企业微信机器人webhook&rate=推送频率&name=订阅名称

> 订阅类型 type：当前仅支持infoq和bestofjs
> 
> 推送频率 rate：day或week，day表示每天上午9点，week表示每周一上午9点。建议本项目的开发和测试群每天推送用以确认程序流程正确，线上大群每周推送
>
> 订阅名称：没有实际作用，仅作为此条订阅的备注，说明订阅的是哪个群，避免订阅群聊过多后无法区分



## 配置项

/src/config.ts

默认端口 DEFAULT_SERVER_PORT：默认 3000 地址

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

