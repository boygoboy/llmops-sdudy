

import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from '@langchain/core/output_parsers'
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file_system"
import { RunnableWithMessageHistory, RunnablePassthrough, RunnableLambda } from "@langchain/core/runnables"
import inquirer from 'inquirer'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"
console.log("当前目录：", __dirname)

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{query}"],
])

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const stringParser = new StringOutputParser()

const chain = prompt.pipe(llm).pipe(stringParser)


const chainWithHistory = new RunnableWithMessageHistory({
    runnable: chain,
    inputMessagesKey: "query",
    historyMessagesKey: "chat_history",
    getMessageHistory: async (sessionId) => {
        const chatHistory = new FileSystemChatMessageHistory({
            filePath: `${__dirname}/chat_history`, // 存储聊天历史的目录
            sessionId,
            userId: "user-id",
        })
        return chatHistory
    },
})
while (true) {
    // 请输入用户的提问
    const { answer: human_query } = await inquirer.prompt([
        {
            type: 'input',
            name: 'answer',
            message: '请输入用户问题(按q退出)：'
        }
    ])
    console.log("用户提问：", human_query)
    if (human_query == 'q') {
        console.log("退出程序")
        break
    }
    if (human_query.trim() === "") {
        process.stdout.write("用户提问不能为空，请重新输入。\n")
        continue
    }
    process.stdout.write("AI回答：")
    const stream = await chainWithHistory.stream(
        {
            query: human_query
        },
        {
            configurable: { sessionId: "langchain-test-session" }
        }
    )
    let ai_content = ""
    for await (const chunk of stream) {
        process.stdout.write(chunk)
        ai_content += chunk
    }
    process.stdout.write("\n\n")
}