import {config} from 'dotenv'

config()

export const PORT = process.env.PORT || 5000
export const DB_USER = process.env.DB_USER || 'root'
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || 3306
export const DB_PASSWORD = process.env.DB_PASSWORD ||'root'
export const DB_DATABASE = process.env.DB_DATABASE || 'BBD_CRM' 
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
export const ASSISTANT_ID = process.env.ASSISTANT_ID || ''
export const HOST = process.env.HOST || '0.0.0.0'


