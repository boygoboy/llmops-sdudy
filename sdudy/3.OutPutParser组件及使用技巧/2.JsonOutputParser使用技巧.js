import { JsonOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"

const parser = new JsonOutputParser({
    answer: "回答用户的问题",
    summary: "总结用户的问题",
})


const promptTemplate = await ChatPromptTemplate.fromMessages([
    ["system", "你是OpenAI开发的聊天机器人，请回答用户的问题,以json格式输出{format_instructions}。"],
    ["human", "{query}"]
]).partial({
    format_instructions: '{answer:"回答用户的问题", summary:"总结用户的问题"}',
})

const prompt_value = await promptTemplate.invoke({ query: "讲一下nest该如何学习？" })


const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const ai_message = await parser.invoke(await llm.invoke(prompt_value.toChatMessages()))

console.log(ai_message)
