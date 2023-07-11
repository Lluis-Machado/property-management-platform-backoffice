export interface PropertyInterface {
    ownerships: Ownership[]
    childProperties: any[]
    name: string
    type: string
    typeOfUse: number[]
    address: Address
    cadastreRef: string
    comments: string
    mainContact: MainContact
    parentProperty: any
    id: string
}

interface Ownership {
    id: string
    contactId: string
    propertyId: string
    share: number
    mainOwnership: boolean
    contactDetail: ContactDetail
    deleted: boolean
}

interface ContactDetail {
    firstName: string
    lastName: string
    id: string
}

interface Address {
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postalCode: string
    country: string
}

interface MainContact {
    firstName: string
    lastName: string
    id: string
}