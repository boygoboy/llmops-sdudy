import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage } from "@langchain/core/messages"
import { StringOutputParser } from "@langchain/core/output_parsers"


// const promptTemplate = PromptTemplate.fromTemplate(
//     "给我介绍下{topic}是什么类型的动物"
// )

const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"

// const str1 = await promptTemplate.invoke({ topic: "dog" })
// console.log(str1) // Tell me a joke about dog

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    new MessagesPlaceholder("msgs"),
])

const message = await promptTemplate.invoke({ msgs: [new HumanMessage("给我介绍下llm大模型开发该如何学习")] })
console.log(message)
const parser = new StringOutputParser()
for await (const chunk of await llm.stream(message.messages)) {
    const msg = await parser.invoke(chunk)
    console.log(msg)
}


// const str2 = await llm.invoke(str1.value)
// console.log(str2) // Tell me a joke about dog

// const messages = await llm.batch([
//     await promptTemplate.invoke({ topic: "dog" }),
//     await promptTemplate.invoke({ topic: "cat" })
// ])

// for (const message of messages) {
//     console.log(message.content) // Tell me a joke about dog
// }
