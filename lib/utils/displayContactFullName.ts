import { ContactData } from '../types/contactData';

/**
 * Displays the full name of a contact based on the provided ContactData.
 *
 * @param {ContactData} contact - The contact information.
 * @returns {string | undefined} - The full name of the contact, or undefined if contact is falsy.
 */
export const displayContactFullName = (
    contact: ContactData
): string | undefined => {
    if (!contact) return;
    if (contact.firstName) return `${contact.firstName} ${contact.lastName}`;
    else return `${contact.lastName}`;
};
