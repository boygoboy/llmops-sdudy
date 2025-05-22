import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"

const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"

const promptTemplate = await ChatPromptTemplate.fromMessages([
    ["system", "你是OpenAI开发的聊天机器人，请根据用户的提问进行回复，我叫{username}"],
    ["human", "{query}"]
])


const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const stringOutputParser = new StringOutputParser()

const chain = promptTemplate.pipe(llm).pipe(stringOutputParser)

for await (const event of await chain.streamEvents(
    { query: "你可以做什么？", username: "小明" },
    {
        version: "v2"
    }
)) {
    if (event.event == 'on_chat_model_stream') {
        console.log(event.data.chunk.content)
    }
}
