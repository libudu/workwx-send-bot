import fs from 'fs/promises'

export const InfoTypeList = [
  'bestofjs',
  'infoq',
] as const

export const RateTypeList = [
  'day',
  'week',
] as const

export type InfoType = typeof InfoTypeList[number]
export type RateType = typeof RateTypeList[number]

interface IWebhookSubscribe {
  name: string;
  type: InfoType;
  webhook: string;
  rate: RateType;
}

interface IStore {
  webhookList: IWebhookSubscribe[]
}

const FILE_NAME = 'store.json'

let store: IStore;

const DEFAULT_STORE: IStore = {
  webhookList: [],
}

export const getStore = () => {
  return store
}

const saveStore = async () => {
  return fs.writeFile(FILE_NAME, JSON.stringify(store, null, 2))
}

// 判断文件是否存在
const fileExist = async (fileName: string) => {
  try {
    await fs.stat(fileName);
    return true
  } catch (err) {
    return false
  }
}

export const initStore: () => Promise<IStore> = async () => {
  // 判断文件是否存在
  if (await fileExist(FILE_NAME)) {
    // 已存在，尝试读取文件
    const content = await fs.readFile(FILE_NAME)
    store = JSON.parse(content.toString())
  } else {
    // 不存在，使用默认配置并保存为文件
    store = DEFAULT_STORE;
    await saveStore()
  }
  return store
}


const findWebhookSubscribe = (webhook: string, type: InfoType) => {
  return store.webhookList.find((item) => item.webhook === webhook && item.type === type)
}

// 新增订阅一个webhook
export const subscribeWebhook = async (webhookSubscribe: IWebhookSubscribe) => {
  const { webhook, type } = webhookSubscribe
  // 已存在无法新增
  if(findWebhookSubscribe(webhook, type)) {
    return null;
  }
  store.webhookList.push(webhookSubscribe)
  await saveStore()
  return store.webhookList
}

// 取消订阅一个webhook
export const unsubscribeWebhook = async (webhook: string, type: InfoType) => {
  if(findWebhookSubscribe(webhook, type)) {
    store.webhookList = store.webhookList.filter((item) => item.webhook !== webhook || item.type !== type)
    await saveStore()
    return store.webhookList
  } else {
    // 不存在这条订阅
    return null
  }
}