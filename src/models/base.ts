export interface IEntityWithIdAndDates {
    _id: string;
    authorizedAppId: string;
    merchantId: string;
    deleted?: boolean;
}
export declare abstract class BaseModelWithIdAndDates {
    _id: string;
    id?: string;
    authorizedAppId: string;
    merchantId: string;
    deleted?: boolean;
}
export declare class BaseSubModelWithIdAndDates {
    _id: string;
    id: string;
    deleted?: boolean;
}
