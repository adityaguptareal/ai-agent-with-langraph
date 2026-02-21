import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { FLIGHT_BOOKING_SYSTEM_PROMPT } from "../systemPrompt/flightBookingPrompt.js";
import { extractUserInfo } from "../utils/userInfoExtractor.js";
import { getDraftBooking, validateToolCall } from "./bookingState.js";
import { searchFlights } from "../tools/flightSearch.js";
import { bookingTools } from "../tools/bookingTools.js";
import dotenv from "dotenv";

dotenv.config();

const tools = [searchFlights, ...bookingTools];
const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    timeout: 30000
}).bindTools(tools);

export async function callModel(state) {
    const draft = getDraftBooking();
    extractUserInfo(state.messages, draft);

    const system = new SystemMessage(FLIGHT_BOOKING_SYSTEM_PROMPT);

    // Filter messages to avoid context overflow if needed, original code used last 12
    const messages = [system, ...state.messages.slice(-12)];
    const response = await llm.invoke(messages);

    if (response.tool_calls?.length) {
        const error = validateToolCall(response.tool_calls[0]);
        if (error) {
            return { messages: [new AIMessage(error + " Please provide it.")] };
        }
    }

    return { messages: [response] };
}
