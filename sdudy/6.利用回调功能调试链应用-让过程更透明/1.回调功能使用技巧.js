import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from '@langchain/core/output_parsers'
const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"


const promptTemplate = PromptTemplate.fromTemplate(`请根据用户的问题进行恢复。
    用户的提问是：{query}`)

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const parser = new StringOutputParser()

const customHandler = {
    handleChainStart: async (chain, inputs, runId) => {
        console.log("Chain is starting with inputs:", inputs, "and runId:", runId)
    },
    handleLLMNewToken: async (token) => {
        console.log("Chat model new token", token)
    }
}

const chain = promptTemplate.pipe(llm).pipe(parser).withConfig({
    callbacks: [customHandler]
})

const stream = await chain.stream(
    { query: "你可以做什么？" }
)

for await (const chunk of stream) {
    console.log(chunk)
}



