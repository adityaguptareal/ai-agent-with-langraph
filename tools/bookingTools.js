import { tool } from "@langchain/core/tools";
import * as z from "zod";
import FLIGHTS_DB from "../constants/flightData.js";
import { readBookings, saveBookings } from "../utils/bookingStorage.js";
import { getDraftBooking, setDraftBooking, clearDraftBooking } from "../graph/bookingState.js";

export const createDraft = tool(
    ({ flightId, passengerName, email }) => {
        const flight = FLIGHTS_DB.find(f => f.id === flightId);
        if (!flight) return JSON.stringify({ error: true, message: "Invalid flight id" });

        const draft = {
            flight,
            passengerName: passengerName || null,
            email: email || null
        };
        setDraftBooking(draft);

        return JSON.stringify({ success: true, draft, message: "Draft created" });
    }, {
    name: "create_booking_draft",
    description: "Create temporary booking draft after user selects flight",
    schema: z.object({
        flightId: z.string().describe("Flight ID chosen by user"),
        passengerName: z.string().optional(),
        email: z.string().optional()
    })
});

export const confirmBooking = tool(
    ({ passengerName, email }) => {
        const draft = getDraftBooking();
        if (!draft) return JSON.stringify({ error: true, message: "No draft exists" });

        if (passengerName) draft.passengerName = passengerName;
        if (email) draft.email = email;

        if (!draft.passengerName || !draft.email) {
            return JSON.stringify({ error: true, message: "Passenger name and email required" });
        }

        const bookings = readBookings();
        const booking = {
            bookingId: `BK-${Date.now()}`,
            passengerName: draft.passengerName,
            email: draft.email,
            flight: draft.flight,
            createdAt: new Date().toISOString()
        };

        bookings.push(booking);
        saveBookings(bookings);
        clearDraftBooking();

        return JSON.stringify({ success: true, booking });
    }, {
    name: "confirm_booking",
    description: "Finalize booking ONLY after explicit user confirmation",
    schema: z.object({
        passengerName: z.string().optional(),
        email: z.string().optional()
    })
});

export const getBooking = tool(
    ({ bookingId }) => {
        const bookings = readBookings();
        const found = bookings.find(b => b.bookingId === bookingId);
        if (!found) return JSON.stringify({ error: true, message: "Booking not found" });
        return JSON.stringify({ success: true, booking: found });
    }, {
    name: "get_booking",
    description: "Retrieve booking details using booking id",
    schema: z.object({ bookingId: z.string() })
});

export const updateBooking = tool(
    ({ bookingId, passengerName, email }) => {
        const bookings = readBookings();
        const idx = bookings.findIndex(b => b.bookingId === bookingId);
        if (idx === -1) return JSON.stringify({ error: true, message: "Booking not found" });

        if (passengerName) bookings[idx].passengerName = passengerName;
        if (email) bookings[idx].email = email;

        saveBookings(bookings);
        return JSON.stringify({ success: true, booking: bookings[idx] });
    }, {
    name: "update_booking",
    description: "Update passenger info using booking id",
    schema: z.object({
        bookingId: z.string(),
        passengerName: z.string().optional(),
        email: z.string().optional()
    })
});

export const deleteBooking = tool(
    ({ bookingId }) => {
        const bookings = readBookings();
        const filtered = bookings.filter(b => b.bookingId !== bookingId);
        if (filtered.length === bookings.length) {
            return JSON.stringify({ error: true, message: "Booking not found" });
        }
        saveBookings(filtered);
        return JSON.stringify({ success: true, message: "Booking deleted" });
    }, {
    name: "delete_booking",
    description: "Delete booking using booking id",
    schema: z.object({ bookingId: z.string() })
});

export const bookingTools = [createDraft, confirmBooking, getBooking, updateBooking, deleteBooking];
