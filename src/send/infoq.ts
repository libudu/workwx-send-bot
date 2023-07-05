import axios from "axios";
import { ContentItemType, makeSender, truncateString } from "./util.js";


// infoq 最近热点
const fetchInfoqItemList = async (): Promise<ContentItemType[]> => {
  const SOURCE_URL = "https://www.infoq.cn/public/v1/article/getIndexList";
  const res = await axios.get(SOURCE_URL, { headers: { referer: ' https://www.infoq.cn/' }})
  const list = res.data.data.hot_day_list
  return list.map(item => {
    return {
      link: `https://www.infoq.cn/article/${item.uuid}`,
      title: item.article_title,
      summary: item.article_summary,
      cover: item.article_cover,
      tags: item.topic?.map(i => i.name),
    } as ContentItemType
  })
}

const infoqTemplate = (contentList: ContentItemType[]) => {
  const contentStr = contentList.map((content, index) => {
    index += 1;
    // 标题可能很长
    const title = truncateString(content.title, 50)
    const titleStr = `${index}、[${title}](${content.link})`
    const tagStr = `<font color="comment">${content.tags?.join(" | ")}</font>`
    return `
      ${titleStr} ${tagStr}
      ${content.summary}
    `
  }).join("\n\t");
  return `
    ## infoq 每周精要
    ${contentStr}
  `
}

export const sendInfoq = makeSender({
  fetchDataList: fetchInfoqItemList,
  makeTemplate: infoqTemplate,
})