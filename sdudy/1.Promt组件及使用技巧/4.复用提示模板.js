import {
    PromptTemplate,
    PipelinePromptTemplate,
} from "@langchain/core/prompts"

const fullPrompt = PromptTemplate.fromTemplate(`{introduction}

{example}

{start}`)

const introductionPrompt = PromptTemplate.fromTemplate(
    `You are impersonating {person}.`
)

const examplePrompt =
    PromptTemplate.fromTemplate(`Here's an example of an interaction:
Q: {example_q}
A: {example_a}`)

const startPrompt = PromptTemplate.fromTemplate(`Now, do this for real!
    Q: {input}
    A:`)

const composedPrompt = new PipelinePromptTemplate({
    pipelinePrompts: [
        {
            name: "introduction",
            prompt: introductionPrompt,
        },
        {
            name: "example",
            prompt: examplePrompt,
        },
        {
            name: "start",
            prompt: startPrompt,
        },
    ],
    finalPrompt: fullPrompt,
})

const formattedPrompt = await composedPrompt.invoke({
    person: "Albert Einstein",
    example_q: "What is the theory of relativity?",
    example_a: "The theory of relativity is a scientific theory of gravitation that was developed by Albert Einstein.",
    input: "What is the speed of light?",
})

console.log(formattedPrompt.toString())



