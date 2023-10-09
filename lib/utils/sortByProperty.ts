/**
 * Sorts an array of objects by a specified property in a case-insensitive manner.
 *
 * @param {any[]} arr - The array of objects to be sorted.
 * @param {string} property - The name of the property to sort by.
 * @returns {any[]} - The sorted array.
 */
export const sortByProperty = <T extends Record<string, any>>(
    arr: T[],
    property: string
): T[] => {
    return arr.sort((a, b) => {
        const propA = String(a[property]).toUpperCase();
        const propB = String(b[property]).toUpperCase();

        if (propA < propB) {
            return -1;
        }
        if (propA > propB) {
            return 1;
        }
        return 0;
    });
};
