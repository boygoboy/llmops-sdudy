import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate } from "@langchain/core/prompts"
import { AIMessage } from "@langchain/core/messages"

const promptTemplate = PromptTemplate.fromTemplate(
    "Tell me a joke about {topic}"
)

const promtObj = await promptTemplate.invoke({ topic: "cats" })
console.log(promtObj.toString())
console.log(promtObj.value)
console.log(promtObj.toChatMessages())

const chat_promt = await ChatPromptTemplate.fromMessages([
    ["system", "你是OpenAI开发的聊天机器人，请根据用户的提问进行回复，当前的时间为:{now}"],
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("请将一个关于{subject}的笑话")
]).partial({ now: new Date().toString() })

const chat_promt_value = await chat_promt.invoke({
    chat_history: [
        ["human", "你叫慕小课吗？"],
        new AIMessage("你好我是ChatGpt，有什么可以帮助到你的吗？")
    ],
    subject: "程序员"
})
console.log(chat_promt_value.toString())
console.log(chat_promt_value.toChatMessages())
