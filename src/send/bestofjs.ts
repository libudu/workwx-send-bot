import axios from "axios";
import { ContentItemType, getDateStr, makeSender, proxy } from "./util.js";
import { PROJECT_URL } from "../env.js";

// bestofjs 最新js技术
export const fetchBestofJsItemList = async () => {
  const SOURCE_URL = "https://bestofjs-static-api.vercel.app/projects.json"
  const res = await axios.get(SOURCE_URL, { proxy })
  let rawProjects: any[] = res.data.projects
  // 去除没有 weekly 数据的
  rawProjects = rawProjects.filter(item => item.trends.weekly)
  // 按 weekly 排序
  rawProjects = rawProjects.sort((a, b) => b.trends.weekly - a.trends.weekly).slice(0, 10)
  return rawProjects.map(item => ({
    link: item.url,
    title: item.name,
    summary: item.description,
    cover: `https://avatars.githubusercontent.com/u/${item.owner_id}?v=3&s=50`,
    tags: item.tags,
    hot: item.trends.weekly,
  } as ContentItemType))
}

const bestofjsTemplate = (contentList: ContentItemType[]) => {
  const MAX_STAR = 5
  const MIN_STAR = 2
  const hotDiff = contentList[0].hot - contentList.at(-1).hot
  const hotLevelDiff = hotDiff / (MAX_STAR - MIN_STAR);

  const contentStr = contentList.map((content, index) => {
    index += 1;
    const hotLevel = MIN_STAR + Math.floor(content.hot / hotLevelDiff)
    const starStr = "⭐".repeat(hotLevel)
    const titleStr = `${index}、[${content.title} ${starStr}](${content.link})`
    const tagStr = `<font color="comment">${content.tags?.join(" | ")}</font>`
    return `
      ${titleStr} ${tagStr}
      ${content.summary}
    `
  }).join("\n\t");

  return `
    ## bestofjs 周报 ${getDateStr()}
    <font color="">每周最热 js 技术，献给最好的 js 💖</font>
    
    ${contentStr}
    
    bestofjs官网：[点击跳转](https://bestofjs.org/)
    推送项目地址：[点击跳转](${PROJECT_URL})
  `
}


export const sendBestofjs = makeSender({
  fetchDataList: fetchBestofJsItemList,
  makeTemplate: bestofjsTemplate,
})