import { HumanMessage } from "@langchain/core/messages";
import readline from "node:readline/promises";
import dotenv from "dotenv";
import { safeInvoke } from "./graph/invoker.js";

dotenv.config();

/**
 * Main entry point for the Flight Booking Agent CLI.
 */
async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("==========================================");
    console.log("✈️  Tripo Saints Flight Agent Ready");
    console.log("   Type /bye to exit, /reset to restart");
    console.log("==========================================\n");

    let conversation = [];

    while (true) {
        try {
            const input = await rl.question("You: ");

            if (input.toLowerCase() === "/bye") break;
            if (input.toLowerCase() === "/reset") {
                conversation = [];
                console.log("Conversation reset.\n");
                continue;
            }

            conversation.push(new HumanMessage(input));

            // Invoke the agent graph
            const result = await safeInvoke({ messages: conversation.slice(-20) });

            // Get the last message from the result
            const lastMessage = result.messages[result.messages.length - 1];

            console.log("\nAI:", lastMessage.content, "\n");

            // Update conversation history
            conversation = result.messages;

        } catch (error) {
            console.error("\nAn error occurred:", error.message);
            console.log("Let's try again.\n");
        }
    }

    rl.close();
    console.log("Goodbye! 👋");
}

main().catch(error => {
    console.error("Critical failure during execution:", error);
    process.exit(1);
});