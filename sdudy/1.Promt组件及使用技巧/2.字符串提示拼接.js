import { PromptTemplate } from "@langchain/core/prompts"

const promptTemplate = PromptTemplate.fromTemplate(
    `请讲一个关于{subject}的笑话
     使用{language}语言进行编写
    `
)
const chat_promt_value = await promptTemplate.invoke({
    subject: "程序员",
    language: "中文"
})
console.log(chat_promt_value.toString())