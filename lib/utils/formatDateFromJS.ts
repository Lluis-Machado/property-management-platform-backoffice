import { DateTime } from 'luxon';

/**
 * Formats a date to 'yyyy-MM-dd' format.
 *
 * @param {Date | string | null} date - The date to format, can be a Date object, a date string, or null.
 * @returns {string | null} - The formatted date string or null if the input date is null.
 */
export const formatDate = (date: Date | string | null): string | null => {
    if (!date) return null;
    const luxonDate =
        typeof date === 'string'
            ? DateTime.fromSQL(date as string)
            : DateTime.fromJSDate(date as Date);
    return luxonDate.toFormat('yyyy-MM-dd');
};
