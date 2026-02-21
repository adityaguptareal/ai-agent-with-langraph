import * as dateFns from "date-fns";
export function parseTravelDate(dateStr) {
    const formats = ['dd-MM-yyyy', 'yyyy-MM-dd', 'MMM do yyyy', 'do MMM', 'dd/MM/yyyy', 'MM/dd/yyyy'];
    for (const f of formats) {
        try {
            const p = dateFns.parse(dateStr, f, new Date());
            if (dateFns.isValid(p)) return dateFns.format(p, "yyyy-MM-dd");
        } catch { }
    }
    try {
        const iso = dateFns.parseISO(dateStr);
        if (dateFns.isValid(iso)) return dateFns.format(iso, "yyyy-MM-dd");
    } catch { }
    return "2026-02-26";
}