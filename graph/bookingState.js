export let draftBooking = null;

export function setDraftBooking(booking) {
    draftBooking = booking;
}

export function getDraftBooking() {
    return draftBooking;
}

export function clearDraftBooking() {
    draftBooking = null;
}

export function validateToolCall(call) {
    if (call.name === "confirm_booking") {
        if (!draftBooking) return "No draft exists yet.";
        if (!draftBooking.passengerName) return "Passenger name missing.";
        if (!draftBooking.email) return "Email missing.";
    }
    return null;
}
