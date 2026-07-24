/**
 * Calculates working hours between check-in and check-out times.
 *
 * Rounding rules for CheckIn:
 * - Minutes 00-10: round to current hour (e.g., 10:10 → 10:00)
 * - Minutes 11-30: round to half hour (e.g., 10:25 → 10:30)
 * - Minutes 31-40: round to half hour (e.g., 10:40 → 10:30)
 * - Minutes 41-60: round to next hour (e.g., 10:41 → 11:00)
 *
 * Rounding rules for CheckOut:
 * - Minutes 00-20: round to current hour (e.g., 10:15 → 10:00)
 * - Minutes 21-30: round to half hour (e.g., 10:25 → 10:30)
 * - Minutes 31-50: round to half hour (e.g., 10:45 → 10:30)
 * - Minutes 51-60: round to next hour (e.g., 10:55 → 11:00)
 *
 * @param checkIn - Check-in time as string (e.g., "17:00")
 * @param checkOut - Check-out time as string (e.g., "18:00")
 * @returns Working hours as a float (e.g., 1.5 for 1 hour 30 minutes)
 */

export const calculateWorkingHours = (
    checkIn?: string | null,
    checkOut?: string | null,
): number => {
    // Both endpoints are required to compute a duration.
    if (!checkIn || !checkOut) return 0;

    const start = toDecimalHours(checkIn, roundCheckInMinute);
    let end = toDecimalHours(checkOut, roundCheckOutMinute);

    // Guard against malformed "HH:mm" input.
    if (start === null || end === null) return 0;

    // Overnight shift (e.g., 22:00 → 02:00): roll the end past midnight.
    if (end < start) end += 24;

    return end - start;
};

//** CheckIn: rounds toward the later start (00-10 → :00, 11-40 → :30, 41-60 → next hour) */
const roundCheckInMinute = (minute: number): number => {
    if (minute <= 10) return 0;
    if (minute <= 40) return 30;
    return 60;
};

//** CheckOut: rounds toward the earlier finish (00-20 → :00, 21-50 → :30, 51-60 → next hour) */
const roundCheckOutMinute = (minute: number): number => {
    if (minute <= 20) return 0;
    if (minute <= 50) return 30;
    return 60;
};

//** Parses "HH:mm", applies the rounding rule, returns decimal hours (e.g., 10:30 → 10.5) */
const toDecimalHours = (
    time: string,
    roundMinute: (minute: number) => number,
): number | null => {
    const [hour, minute] = time.split(":").map(Number);

    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

    // roundMinute may return 60, which correctly carries into the next hour.
    return hour + roundMinute(minute) / 60;
};
