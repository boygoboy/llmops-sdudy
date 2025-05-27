// # 1.max_tokens用于判断是否需要生成新的摘要
// # 2.summary用于存储摘要的信息
// # 3.chat_histories用于存储历史对话
// # 4.get_num_tokens用于计算传入文本的token数
// # 5.save_context用于存储新的交流对话
// # 6.get_buffer_string用于将历史对话转换成字符串
// # 7.load_memory_variables用于加载记忆变量信息
// # 8.summary_text用于将旧的摘要和传入的对话生成新摘要

import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnablePassthrough, RunnableLambda } from "@langchain/core/runnables"
import inquirer from 'inquirer'
const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"


const summary_llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})


class ConversationSummaryBufferMemory {
    constructor(summary, chat_histories, max_tokens, llm) {
        this.summary = summary || ""
        this.chat_histories = chat_histories || []
        this.max_tokens = max_tokens || 1000
        this.llm = llm
    }
    // get_num_tokens用于计算传入文本的token数
    get_num_tokens(context) {
        return context.length // 简化的token计算方法
    }
    // get_buffer_string用于将历史对话转换成字符串
    get_buffer_string(messages = this.chat_histories) {
        let ask_answer = ""
        for (const chat of messages) {
            ask_answer += `Human：${chat.human}\nAI：${chat.ai}\n\n`
        }
        return ask_answer.trim()
    }
    // save_context用于存储新的交流对话
    async save_context(human_query, ai_content) {
        this.chat_histories.push({
            human: human_query,
            ai: ai_content
        })
        await this.shiftHistory()
    }
    async shiftHistory(summary_array = []) {
        const buffer_string = this.get_buffer_string()
        const num_tokens = this.get_num_tokens(buffer_string)
        // 如果token数超过最大限制，则生成新的摘要
        if (num_tokens > this.max_tokens) {
            summary_array.push(this.chat_histories.shift())
            this.shiftHistory(summary_array)
        } else {
            if (summary_array.length === 0) {
                return
            }
            this.summary = await this.summary_text(this.summary, this.get_buffer_string(summary_array))
        }
    }
    load_memory_variables() {
        const buffer_string = this.get_buffer_string()
        return {
            "chat_history": `摘要:${this.summary}\n\n历史信息:${buffer_string}\n`
        }
    }
    async summary_text(origin_summary, new_line) {
        const prompt = `你是一个强大的聊天机器人，请根据用户提供的谈话内容，总结摘要，并将其添加到先前提供的摘要中，返回一个新的摘要，除了新摘要其他任何数据都不要生成，如果用户的对话信息里有一些关键的信息，比方说姓名、爱好、性别、重要事件等等，这些全部都要包括在生成的摘要中，摘要尽可能要还原用户的对话记录。

        一定要注意请不要将<example>标签里的数据当成实际的数据，这里的数据只是一个示例数据，告诉你该如何生成新摘要。
        
        <example>
        当前摘要：人类会问人工智能对人工智能的看法，人工智能认为人工智能是一股向善的力量。
        
        新的对话：
        Human：为什么你认为人工智能是一股向善的力量？
        AI：因为人工智能会帮助人类充分发挥潜力。
        
        新摘要：人类会问人工智能对人工智能的看法，人工智能认为人工智能是一股向善的力量，因为它将帮助人类充分发挥潜力。
        </example>
        
        =====================以下的数据是实际需要处理的数据=====================
        
        当前摘要：{origin_summary}
        
        新的对话：
        {new_line}
        
        请帮用户将上面的信息生成新摘要。`
        const promptTemplate = PromptTemplate.fromTemplate(prompt)
        const llm = this.llm
        const parser = new StringOutputParser()
        const chain = promptTemplate.pipe(llm).pipe(parser)
        const result = await chain.invoke({
            origin_summary: origin_summary,
            new_line: new_line
        })
        return result
    }
}
const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})
const memory = new ConversationSummaryBufferMemory("", [], 300, summary_llm)
const stringParser = new StringOutputParser()
// const { chat_history } = memory.load_memory_variables()
const promptTemplate = PromptTemplate.fromTemplate(`你是一个强大的聊天机器人，请根据对应的上下文和用户提问解决问题。\n\n
历史对话信息是：{chat_history}\n
用户的提问是：{query}`)
const get_history = RunnableLambda.from((input) => {
    return memory.load_memory_variables().chat_history
})
const passTemplate = RunnablePassthrough.assign({
    chat_history: get_history
})
const chain = passTemplate.pipe(promptTemplate).pipe(llm).pipe(stringParser)
while (true) {
    // 请输入用户的提问
    const { answer: human_query } = await inquirer.prompt([
        {
            type: 'input',
            name: 'answer',
            message: '请输入用户问题(按q退出)：'
        }
    ])
    console.log("用户提问：", human_query)
    if (human_query == 'q') {
        console.log("退出程序")
        break
    }
    if (human_query.trim() === "") {
        process.stdout.write("用户提问不能为空，请重新输入。\n")
        continue
    }
    process.stdout.write("AI回答：")
    const stream = await chain.stream({
        query: human_query
    })
    let ai_content = ""
    for await (const chunk of stream) {
        process.stdout.write(chunk)
        ai_content += chunk
    }
    process.stdout.write("\n\n")
    await memory.save_context(human_query, ai_content)
}