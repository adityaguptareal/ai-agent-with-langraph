export function extractUserInfo(messages, draftBooking) {
    if (!draftBooking) return;

    const text = messages.map(m => m.content || "").join(" ");

    // Simple email regex
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
        draftBooking.email = emailMatch[0];
    }

    // Name extraction pattern
    const nameMatch = text.match(/my name is ([a-z ]+)/i);
    if (nameMatch) {
        draftBooking.passengerName = nameMatch[1].trim();
    }
}
