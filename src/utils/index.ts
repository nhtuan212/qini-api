import bcrypt from "bcryptjs";
import { Pagination } from "../constants";

export const hashPassword = async (
    password: string,
    saltRounds: number = 10,
): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
    password: string,
    hash: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const isDateValid = (date: Date) => {
    return !isNaN(Number(new Date(date)));
};

export const isValidISODate = (date: string) =>
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);

//** Pagination Query */
export const paginationQuery = (query: { [key: string]: any }) => {
    return {
        skip:
            (Number(query.page || 1) - 1) *
            Number(query.limit || Pagination.limit),
        take: Number(query.limit || Pagination.limit),
    };
};

export const calculateWorkingHours = (
    check_in: string | null,
    check_out: string | null,
): number => {
    // Calculate working hours from check_in and check_out times
    let working_hours = 0;

    if (!check_in || !check_out) return 0;

    if (check_in && check_out) {
        const [checkInHour, checkInMin] = check_in.split(":").map(Number);
        const [checkOutHour, checkOutMin] = check_out.split(":").map(Number);

        const checkInMinutes = checkInHour * 60 + checkInMin;
        const checkOutMinutes = checkOutHour * 60 + checkOutMin;

        // Handle overnight shifts
        const totalMinutes =
            checkOutMinutes >= checkInMinutes
                ? checkOutMinutes - checkInMinutes
                : 24 * 60 - checkInMinutes + checkOutMinutes;

        working_hours = totalMinutes / 60; // Convert to hours

        // Round working hours with custom logic based on minutes:
        // <= 15 minutes => round down to integer
        // 16-46 minutes => round to .5
        // >= 47 minutes => round up to next integer
        const wholeHours = Math.floor(working_hours);
        const minutes = totalMinutes % 60;

        if (minutes < 15) {
            working_hours = wholeHours; // Round down
        } else if (minutes >= 15 && minutes <= 45) {
            working_hours = wholeHours + 0.5; // Round to .5
        } else {
            working_hours = wholeHours + 1; // Round up
        }
    }

    return working_hours;
};

// Crypto
export { generateRSAKeyPair, decryptPassword } from "./crypto";
