export interface PropertyFormInterface {
    name: string;
    type: string;
    cadastreRef: string;
    mainContact: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

export interface PropertyInterface {
    name: string;
    type: string;
    typeOfUse: [
        number
    ];
    address: {
        addressLine1: string,
        addressLine2: string,
        city: string,
        state: string,
        postalCode: string,
        country: string
    },
    cadastreRef: string,
    comments: string,
    parentPropertyId: string,
    ownerships: [
        {
            id: string,
            contactId: string,
            propertyId: string,
            share: number,
            mainOwnership: boolean,
            contactDetail: {
                firstName: string,
                lastName: string,
                id: string
            },
            deleted: boolean
        }
    ],
    childProperties: [
        {
            id: string,
            name: string
        }
    ]
};

export interface CreateProperty {
    name: string;
    type: string;
    typeOfUse: [
        number
    ];
    address: {
        addressLine1: string,
        addressLine2: string,
        city: string,
        state: string,
        postalCode: string,
        country: string
    },
    cadastreRef: string,
    ownerships: [
        {
            id: string,
            contactId: string,
            mainOwnership: boolean,
            share: number
        }
    ]
}
