import fs from "fs";
import path from "path";

const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");

export function readBookings() {
    if (!fs.existsSync(BOOKINGS_FILE)) return [];
    try {
        const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading bookings:", error);
        return [];
    }
}

export function saveBookings(data) {
    try {
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving bookings:", error);
    }
}
