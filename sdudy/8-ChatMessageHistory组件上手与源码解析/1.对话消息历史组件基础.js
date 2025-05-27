import { InMemoryChatMessageHistory } from "@langchain/core/chat_history"

const chatHistory = new InMemoryChatMessageHistory()
// 添加消息到历史记录
await chatHistory.addUserMessage("你好，今天的天气怎么样？")
await chatHistory.addAIMessage("今天天气晴朗，适合出行。")

// 获取所有消息
console.log("所有消息：", await chatHistory.getMessages())