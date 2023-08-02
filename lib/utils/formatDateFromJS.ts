import { DateTime } from 'luxon';

export const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    const luxonDate =
        typeof date === 'string'
            ? DateTime.fromSQL(date as string)
            : DateTime.fromJSDate(date as Date);
    return luxonDate.toFormat('yyyy-MM-dd');
};
