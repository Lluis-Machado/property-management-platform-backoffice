export interface OwnershipPropertyData {
    id: number;
    propertyId: number;
    ownerId: string;
    ownerType: string;
    share: number;
    mainOwnership: boolean;
    deleted: boolean;
}
