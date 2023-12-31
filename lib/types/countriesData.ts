export interface CountryData {
    id: number;
    countryCode: string;
    languageCode: 'es' | 'de' | 'en';
    name: string;
    category?: string;
}

export interface StateData {
    id: number;
    countryId: number;
    languageCode: string;
    stateCode: string;
    name: string;
}
