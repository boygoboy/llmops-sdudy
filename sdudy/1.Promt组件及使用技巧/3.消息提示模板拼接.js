import { ChatPromptTemplate } from "@langchain/core/prompts"

const promt_template = ChatPromptTemplate.fromMessages([
    ["system", "你是OpenAI开发的聊天机器人，请根据用户的提问进行回复，我叫{username}"],
    ["human", "{query}"]
]
)

const promt_value = await promt_template.invoke({
    username: "慕小课",
    query: "你叫什么名字？"
})
console.log(promt_value.toString())