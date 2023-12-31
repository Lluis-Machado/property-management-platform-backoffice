/**
 * Masking Element Description
 * 0	A digit.
 * 9	A digit or a space.
 * #	A digit, a space, "+" or "-" sign.
 * L	A literal.
 * C	Any character except space.
 * c	Any character.
 * A	An alphanumeric.
 * a	An alphanumeric or a space.
 * NOTE: To escape the masking elements, use the double
 * backslash character (\). For example, "000.\\0\\0".
 */
export const countriesMaskItems = [
    { id: 1, mask: '+34 000-00-00-00', name: 'Spain' },
    { id: 2, mask: '+4\\9 0000-000000', name: 'Germany' },
    { id: 3, mask: '+1 (000) 000-0000', name: 'United States' },
    { id: 4, mask: '+33 00-00-00-00-00', name: 'France' },
    { id: 5, mask: '+43 9999-999999', name: 'Austria' },
    { id: 6, mask: '+41 000-000-00-00', name: 'Switzerland' },
];

export const identificationItems = [
    {
        id: 1,
        name: 'NIE',
    },
    {
        id: 2,
        name: 'DNI',
    },
    {
        id: 3,
        name: 'Passport',
    },
    {
        id: 4,
        name: 'SSN',
    },
    {
        id: 5,
        name: 'Tax Id',
    },
    {
        id: 6,
        name: 'Other',
    },
];

export const genderItems = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' },
];

export const titleItems = [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Ms.' },
    { id: 3, name: 'Mrs.' },
    { id: 4, name: 'Miss' },
    { id: 5, name: 'Lord' },
    { id: 6, name: 'Lady' },
    { id: 7, name: 'Dr.' },
    { id: 8, name: 'Professor' },
];

export const maritalStatusItems = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Married' },
    { id: 3, name: 'Divorced' },
    { id: 4, name: 'Widowed' },
];

export const addressTypeItems = [
    {
        id: 1,
        name: 'Fiscal',
    },
    {
        id: 2,
        name: 'Billing',
    },
    {
        id: 3,
        name: 'Private',
    },
    {
        id: 4,
        name: 'Other',
    },
];

export const phoneTypeItems = [
    {
        id: 1,
        name: 'Mobile phone',
    },
    {
        id: 2,
        name: 'Landline phone',
    },
    { id: 3, name: 'Fax' },
    {
        id: 4,
        name: 'Other',
    },
];

export const phoneType2Items = [
    {
        id: 1,
        name: 'Business',
    },
    {
        id: 2,
        name: 'Private',
    },
];

export const companyContactsTypeItems = [
    {
        id: 1,
        name: 'CEO',
    },
    {
        id: 2,
        name: 'Contact Person',
    },
    {
        id: 3,
        name: 'Owner',
    },
    {
        id: 4,
        name: 'Other',
    },
];
