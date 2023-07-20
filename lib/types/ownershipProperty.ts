export interface OwnershipPropertyData {
    id: number;
    propertyId: number;
    ownerId: number;
    ownerType: string;
    share: number;
    mainOwnership: boolean;
    deleted: boolean;
}
