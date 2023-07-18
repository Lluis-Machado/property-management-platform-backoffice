import { DateTime } from 'luxon';

export const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    const luxonDate = DateTime.fromJSDate(new Date(date));
    return luxonDate.toFormat('yyyy-MM-dd');
};
