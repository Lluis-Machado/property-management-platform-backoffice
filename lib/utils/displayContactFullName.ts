import { ContactData } from '../types/contactData';

export const displayContactFullName = (contact: ContactData) => {
    if (!contact) return;
    if (contact.firstName) return `${contact.firstName} ${contact.lastName}`;
    else return `${contact.lastName}`;
};
