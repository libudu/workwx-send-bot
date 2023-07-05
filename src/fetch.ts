import axios from 'axios'
import { isDev } from './env.js';

const proxy = isDev ? {
  host: '127.0.0.1',
  port: 7890,
  protocol: 'http',
} : undefined

export interface ContentItemType {
  link: string;
  title: string;
  summary?: string;
  cover?: string;
  tags?: string[];
  hot?: number;
}

// infoq 最近热点
export const fetchInfoqItemList = async (): Promise<ContentItemType[]> => {
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