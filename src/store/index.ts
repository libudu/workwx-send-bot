import fs from 'fs/promises'

export const InfoTypeList = [
  'bestofjs',
  'infoq',
] as const

export const RateTypeList = [
  'day',
  'week',
]

type InfoType = typeof InfoTypeList[number]
type RateType = typeof RateTypeList[number]

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

const saveStore = async () => {
  return fs.writeFile(FILE_NAME, JSON.stringify(store))
}

export const initStore: () => Promise<IStore> = async () => {
  // 判断文件是否存在
  if (!(await fs.stat(FILE_NAME)).isFile()) {
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


// 新增订阅一个webhook
export const subscribeWebhook = async (webhookSubscribe: IWebhookSubscribe) => {
  store.webhookList.push(webhookSubscribe)
  await saveStore()
  return store.webhookList
}

// 取消订阅一个webhook
export const unsubscribeWebhook = async (webhook: string) => {
  if(store.webhookList.find((item) => item.webhook === webhook)) {
    store.webhookList = store.webhookList.filter((item) => item.webhook !== webhook)
    await saveStore()
    return store.webhookList
  } else {
    // 不存在这条订阅
    return null
  }
}