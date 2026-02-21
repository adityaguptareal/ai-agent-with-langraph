import { tool } from "@langchain/core/tools";
import { parseTravelDate } from "../utils/dateParser.js";
import * as dateFns from "date-fns";
import AIRPORT_DB from "../constants/airPortData.js";
import FLIGHTS_DB from "../constants/flightData.js";
import * as z from "zod";

export const searchFlights = tool(
    ({ from, to, date }) => {
        const travelDate = parseTravelDate(date);

        function resolveAirport(input) {
            if (!input) return null;
            const cleaned = input.toLowerCase().trim();

            // If user gave airport code directly
            const codeMatch = AIRPORT_DB.find(a =>
                a.code.toLowerCase() === cleaned
            );
            if (codeMatch) return codeMatch.code;

            // Try city match dynamically from dataset
            const cityMatch = AIRPORT_DB.find(a =>
                cleaned.includes(a.city.toLowerCase())
            );
            if (cityMatch) return cityMatch.code;

            return null;
        }

        const fromCode = resolveAirport(from);
        const toCode = resolveAirport(to);

        // If not resolved → enforce airport code input
        if (!fromCode || !toCode) {
            return JSON.stringify({
                error: true,
                message: "Please provide valid airport codes (example: DEL, BOM, BLR)."
            });
        }

        const window = [
            dateFns.format(dateFns.subDays(new Date(travelDate), 1), "yyyy-MM-dd"),
            travelDate,
            dateFns.format(dateFns.addDays(new Date(travelDate), 1), "yyyy-MM-dd"),
        ];

        const matches = FLIGHTS_DB.filter(f =>
            f.from === fromCode &&
            f.to === toCode &&
            window.some(d => f.departs.startsWith(d))
        );

        return JSON.stringify({
            success: true,
            from: fromCode,
            to: toCode,
            flights: matches,
            message: matches.length ? undefined : "No flights found for this route/date."
        });
    }, {
    name: "search_flights",
    description: "Search flights when user provides route and date",
    schema: z.object({
        from: z.string().describe("Departure city"),
        to: z.string().describe("Arrival city"),
        date: z.string().describe("Travel date")
    })
});