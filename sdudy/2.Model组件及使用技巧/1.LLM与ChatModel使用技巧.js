import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage } from "@langchain/core/messages"
import { StringOutputParser } from "@langchain/core/output_parsers"

const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"


const promptTemplate = await ChatPromptTemplate.fromMessages([
    ["system", "你是OpenAI开发的聊天机器人，请回答用户的问题，现在的时间是{now}"],
    ["human", "{query}"]
]).partial({
    now: Date.now().toString()
})

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})
const promt_value = await promptTemplate.invoke({ query: "你可以做什么？" })
const ai_message = await llm.invoke(promt_value.toChatMessages())
console.log(ai_message.content)