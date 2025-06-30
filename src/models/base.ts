import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
export interface IEntityWithIdAndDates {
    _id: string;
    authorizedAppId: string;
    merchantId: string;
    deleted?: boolean;
}
export declare abstract class BaseModelWithIdAndDates extends TimeStamps {
    _id: string;
    id?: string;
    authorizedAppId: string;
    merchantId: string;
    deleted?: boolean;
}
export declare class BaseSubModelWithIdAndDates extends TimeStamps {
    _id: string;
    id: string;
    deleted?: boolean;
}
