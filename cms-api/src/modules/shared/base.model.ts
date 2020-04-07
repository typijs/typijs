export type Timestamps = {
    createdAt: Date;
    updatedAt: Date;
}

export interface ICommonMetadata {
    created: Date;
    createdBy: any;

    changed: Date;
    changedBy: any;

    deleted: Date;
    deletedBy: any;
}