import { useState, useCallback } from 'react';

import { TokenRes } from '../types/token';
import { StateData } from '../types/countriesData';
import { ContactData } from '../types/contactData';
import { CompanyData } from '../types/companyData';

export const useCountryChange = (
    lang: string,
    token: TokenRes,
    initialStates?: StateData[]
) => {
    const [states, setStates] = useState<StateData[] | undefined>(
        initialStates
    );
    const [countriesLoaded, setCountriesLoaded] = useState<number[]>([]);
    const [isStateLoading, setIsStateLoading] = useState<boolean>(false);

    const handleCountryChange = useCallback(
        (countryId: number) => {
            setIsStateLoading(true);

            // Check if this country was previously loaded
            if (countriesLoaded.includes(countryId)) return;
            else setCountriesLoaded((prev) => [...prev, countryId]);

            // Fetch states for this country
            fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `${token.token_type} ${token.access_token}`,
                    },
                    cache: 'no-store',
                }
            )
                .then((resp) => resp.json())
                .then((data: StateData[]) =>
                    setStates((prev) => (prev ? [...prev, ...data] : data))
                )
                .catch((e) => console.error('Error while getting the states'))
                .finally(() => setIsStateLoading(false));
        },
        [lang, token, countriesLoaded]
    );

    const getFilteredStates = useCallback(
        (index: number, data: CompanyData | ContactData) =>
            states?.filter(
                (state) => state.countryId === data.addresses[index].country
            ),
        [states]
    );

    return { states, handleCountryChange, isStateLoading, getFilteredStates };
};

export default useCountryChange;
