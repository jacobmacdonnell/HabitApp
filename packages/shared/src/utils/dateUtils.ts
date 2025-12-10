/**
 * Date utility functions for consistent local timezone handling.
 */

/**
 * Returns a local date string in YYYY-MM-DD format.
 * Unlike toISOString(), this respects the user's timezone.
 *
 * @param date - The date to format (defaults to now)
 * @returns Date string in YYYY-MM-DD format
 */
export const getLocalDateString = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
