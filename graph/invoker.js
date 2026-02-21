import { AIMessage } from "@langchain/core/messages";
import { GraphRecursionError } from "@langchain/langgraph";
import { app } from "./workflow.js";

export async function safeInvoke(input) {
    try {
        return await app.invoke(input, { recursionLimit: 6, maxConcurrency: 1 });
    } catch (e) {
        if (e instanceof GraphRecursionError) {
            return { messages: [new AIMessage("Please answer the pending booking questions.")] };
        }
        console.error("Graph execution error:", e);
        return { messages: [new AIMessage("Service unavailable.")] };
    }
}
