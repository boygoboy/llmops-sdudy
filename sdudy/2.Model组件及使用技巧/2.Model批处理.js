import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"

const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"

const promptTemplate = await ChatPromptTemplate.fromMessages([
    ["system", "你是OpenAI开发的聊天机器人，请回答用户的问题，现在的时间是{now}"],
    ["human", "{query}"]
]).partial({
    now: Date.now().toString()
})

const prompt1 = await promptTemplate.invoke({ query: "你可以做什么？" })
const prompt2 = await promptTemplate.invoke({ query: "如何学好ai应用开发？" })

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const messages = await llm.batch([
    prompt1.toChatMessages(),
    prompt2.toChatMessages()
])
for (const message of messages) {
    console.log(message.content)
}