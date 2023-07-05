import axios from 'axios'
import { ContentItemType, fetchBestofJsItemList } from './fetch.js'
import { weixin_webhook_list } from './config.js';

const weixin_webhook = weixin_webhook_list[0]

export const send = async () => {
  const list = await fetchBestofJsItemList();
  console.log(list)
  const res = await axios.post(weixin_webhook, bestofjsTemplate({ contentList: list }))
  console.log(res.data)
}

const trimInnerSpace = (str: string) => {
  return str.trim().replaceAll(/\n[ ]*/g, '\n')
}

const bestofjsTemplate = ({
  contentList,
}: {
  contentList: ContentItemType[],
}) => {
  const MAX_STAR = 5
  const MIN_STAR = 2
  const hotDiff = contentList[0].hot - contentList.at(-1).hot
  const hotLevelDiff = hotDiff / (MAX_STAR - MIN_STAR);

  const contentStr = contentList.map((content, index) => {
    index += 1;
    const hotLevel = MIN_STAR + Math.floor(content.hot / hotLevelDiff)
    const titleStr = `${index}、[${content.title}](${content.link})`
    const starStr = "⭐".repeat(hotLevel)
    const tagStr = `<font color="comment">${content.tags?.join(" | ")}</font>`
    return `
      ${titleStr} ${starStr} ${tagStr}
      ${content.summary}
    `
  }).join("\n\t");
  return {
    "msgtype": "markdown",
    "markdown": {
      "content": trimInnerSpace(`
        ## bestofjs 周报
        <font color="">每周最热 js 技术，献给最好的 js 💖</font>
        \n\t
        ${contentStr}
        
        bestofjs官网：[点击跳转](https://bestofjs.org/)
        推送项目地址：[点击跳转](https://github.com/libudu)
      `)
    }
  }
}