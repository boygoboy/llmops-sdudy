import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts"
import {ConversationTokenBufferMemory} from "langchain/memory"
import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from '@langchain/core/output_parsers'
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file_system"
import { RunnableWithMessageHistory, RunnablePassthrough, RunnableLambda } from "@langchain/core/runnables"
import inquirer from 'inquirer'
const OPENAI_API_KEY = "sk-73FKJTSCnXIpJOOmCHloG0sGzWKvvtE4w7pxLJf5e6G0R7gq"

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{query}"],
])

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: "https://api.chatanywhere.tech",
    },
})

const stringParser = new StringOutputParser()

const memory=new ConversationTokenBufferMemory(
    
)

