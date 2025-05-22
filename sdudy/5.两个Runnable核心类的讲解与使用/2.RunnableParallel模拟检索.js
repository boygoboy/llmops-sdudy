import { RunnableParallel, RunnablePassthrough, RunnableLambda } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from '@langchain/core/output_parsers'
const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"

const promt = PromptTemplate.fromTemplate(
    `请根据用户的问题回答，可以参考对应的上下文进行生成。
    <context>
     {context}
    </context>
    用户的提问是：{question}
    `
)

const someFunc = RunnableLambda.from((input) => {
    return `今天${input}的天气是：晴天，气温35度，湿度10%` // 模拟天气查询
})


function searchTianQi(str) {
    return `今天${str}的天气是：晴天，气温35度，湿度10%` // 模拟天气查询
}


const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const parser = new StringOutputParser()

// const chain = RunnableParallel.from({
//     context:  () => searchTianQi("淮安"),
//     question: new RunnablePassthrough()
// }).pipe(promt).pipe(llm).pipe(parser)
// const result = await chain.invoke({
//     question: "查询一下淮安今天的天气如何？",
// })
const chain = RunnableParallel.from({
    context: someFunc,
    question: new RunnablePassthrough()
}).pipe(promt).pipe(llm).pipe(parser)
const result = await chain.invoke({
    context: "淮安",
    question: "查询一下淮安今天的天气如何？",
})
console.log(result)