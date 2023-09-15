import { config } from "dotenv"
config()

export const isDev = process.env.NODE_ENV === 'development'

const DEFAULT_PROJECT_URL = 'https://github.com/libudu/workwx-send-bot'
export const PROJECT_URL = process.env.PROJECT_URL || DEFAULT_PROJECT_URL

export const CLOCKIN_WEBHOOK = process.env.CLOCKIN_WEBHOOK || ''