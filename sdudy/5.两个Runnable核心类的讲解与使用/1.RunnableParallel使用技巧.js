import { RunnableParallel } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"
import { StringOutputParser } from '@langchain/core/output_parsers'

const prompt1 = PromptTemplate.fromTemplate(
    "请介绍下关于 {topic1}的概念"
)
const prompt2 = PromptTemplate.fromTemplate(
    "请写下关于 {topic2}的代码"
)

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const parser = new StringOutputParser()

const chain1 = prompt1.pipe(llm).pipe(parser)
const chain2 = prompt2.pipe(llm).pipe(parser)
const chain = RunnableParallel.from({
    first: chain1,
    second: chain2
})

const result = await chain.invoke({
    topic1: "Ai Agent",
    topic2: "冒泡排序算法"
})
console.log(result)

