import axios from "axios";
import { isDev } from "../env.js";

export const proxy = isDev ? {
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

// 按长度截断字符串，中文算2单位长度
export const truncateString = (str: string, num: number): string => {
  let len = 0; // 计算总长度
  let result = ''; // 截取的结果

  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) { // 判断是否为中文字符
      len += 2;
    } else {
      len += 1;
    }

    if (len <= num) {
      result += str.charAt(i);
    } else {
      result += "……"
      break;
    }
  }

  return result;
}

// 去除换行后面的空格，用于 js 格式化字符串
const trimInnerSpace = (str: string) => {
  return str.trim().replaceAll(/\n[ ]*/g, '\n')
}

export const getDateStr = () => {
  return new Date().toLocaleDateString("zh")
}

export const makeSender = ({
  fetchDataList,
  makeTemplate,
}: {
  fetchDataList: () => Promise<ContentItemType[]>;
  makeTemplate: (list: ContentItemType[]) => string; 
}) => {
  return async (web_hook: string) => {
    const list = await fetchDataList()
    const template = makeTemplate(list)
    const res = await axios.post(web_hook, {
      "msgtype": "markdown",
      "markdown": {
        "content": trimInnerSpace(template),
      }
    })
    return res.data;
  }
}