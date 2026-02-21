import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { callModel } from "./nodes.js";
import { searchFlights } from "../tools/flightSearch.js";
import { bookingTools } from "../tools/bookingTools.js";

const tools = [searchFlights, ...bookingTools];
const toolNode = new ToolNode(tools);

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", toolsCondition, {
        tools: "tools",
        __end__: "__end__"
    })
    .addEdge("tools", "agent");

export const app = workflow.compile();
