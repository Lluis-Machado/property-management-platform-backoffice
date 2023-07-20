import { DateTime } from 'luxon';

export const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    console.log('date es: ', date);
    const luxonDate =
        typeof date === 'string'
            ? DateTime.fromSQL(date as string)
            : DateTime.fromJSDate(date as Date);
    console.log('luxonDate: ', luxonDate);
    return luxonDate.toFormat('yyyy-MM-dd');
};
