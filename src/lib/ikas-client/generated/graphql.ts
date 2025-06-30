import { BaseGraphQLAPIClient, BaseGraphQLAPIClientOptions, APIResult } from '@ikas/admin-api-client';

export enum SalesChannelTypeEnum {
  ADMIN = "ADMIN",
  APP = "APP",
  B2B_STOREFRONT = "B2B_STOREFRONT",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  POS = "POS",
  STOREFRONT = "STOREFRONT",
  STOREFRONT_APP = "STOREFRONT_APP"
}
export enum SourceTypeEnum {
  CUSTOMER = "CUSTOMER",
  CUSTOMER_SUBSCRIPTION_PLAN = "CUSTOMER_SUBSCRIPTION_PLAN",
  CUSTOMER_SUBSCRIPTION_PLAN_ORDER = "CUSTOMER_SUBSCRIPTION_PLAN_ORDER",
  EMAIL = "EMAIL",
  GIFT_CARD = "GIFT_CARD",
  INVENTORY = "INVENTORY",
  MERCHANT = "MERCHANT",
  ORDER = "ORDER",
  PARTNER = "PARTNER",
  PRODUCT = "PRODUCT",
  STAFF = "STAFF",
  STOREFRONT = "STOREFRONT"
}
export enum StockLocationDeliveryTimeEnum {
  TWO_IN_FOUR_DAYS = "TWO_IN_FOUR_DAYS",
  WITHIN_FOUR_HOURS = "WITHIN_FOUR_HOURS",
  WITHIN_ONE_HOUR = "WITHIN_ONE_HOUR",
  WITHIN_PLUS_FIVE_DAYS = "WITHIN_PLUS_FIVE_DAYS",
  WITHIN_TWENTY_FOUR_HOURS = "WITHIN_TWENTY_FOUR_HOURS",
  WITHIN_TWO_HOURS = "WITHIN_TWO_HOURS"
}
export enum StockLocationTypeEnum {
  PHYSICAL = "PHYSICAL",
  VIRTUAL = "VIRTUAL"
}
export interface SalesChannel {
  createdAt?: number;
  deleted: boolean;
  id: string;
  name: string;
  paymentGateways?: Array<SalesChannelPaymentGateway>;
  priceListId?: string;
  stockLocations?: Array<SalesChannelStockLocation>;
  type: SalesChannelTypeEnum;
  updatedAt?: number;
}
export interface SalesChannelPaymentGateway {
  id: string;
  order: number;
}
export interface SalesChannelStockLocation {
  id: string;
  order: number;
}
export interface StockLocation {
  address?: StockLocationAddress;
  createdAt?: number;
  deleted: boolean;
  deliveryTime?: StockLocationDeliveryTimeEnum;
  description?: string;
  id: string;
  isRemindOutOfStockEnabled?: boolean;
  name: string;
  outOfStockMailList?: Array<string>;
  translations?: Array<StockLocationTranslation>;
  type?: StockLocationTypeEnum;
  updatedAt?: number;
}
export interface StockLocationAddress {
  address?: string;
  city?: StockLocationAddressCity;
  country?: StockLocationAddressCountry;
  district?: StockLocationAddressDistrict;
  phone?: string;
  postalCode?: string;
  state?: StockLocationAddressState;
}
export interface StockLocationAddressCity {
  code?: string;
  id?: string;
  name: string;
}
export interface StockLocationAddressCountry {
  code?: string;
  id?: string;
  iso2?: string;
  iso3?: string;
  name: string;
}
export interface StockLocationAddressDistrict {
  code?: string;
  id?: string;
  name?: string;
}
export interface StockLocationAddressState {
  code?: string;
  id?: string;
  name?: string;
}
export interface StockLocationTranslation {
  description?: string;
  locale: string;
}
export interface TimelineInput {
  message: string;
  sourceId: string;
  sourceType: SourceTypeEnum;
}

export interface ListSalesChannelQueryVariables {}
export interface ListSalesChannelQuery {
  listSalesChannel: Array<{
  id: string;
  name: string;
}>;
}
export interface ListStockLocationQueryVariables {}
export interface ListStockLocationQuery {
  listStockLocation: Array<{
  id: string;
  name: string;
}>;
}
export interface AddCustomTimelineEntryMutationVariables {
  input: TimelineInput;
}
export interface AddCustomTimelineEntryMutation {
  addCustomTimelineEntry: boolean;
}

export class GeneratedQuery {
  client: BaseGraphQLAPIClient<any>;

  constructor(client: BaseGraphQLAPIClient<any>) {
    this.client = client;
  }

  async listSalesChannel(): Promise<APIResult<Partial<ListSalesChannelQuery>>> {
    const query = `
  query listSalesChannel {
    listSalesChannel {
      id
      name
    }
  }
`;
    return this.client.query<Partial<ListSalesChannelQuery>>({ query });
  }

  async listStockLocation(): Promise<APIResult<Partial<ListStockLocationQuery>>> {
    const query = `
  query listStockLocation {
    listStockLocation {
      id
      name
    }
  }
`;
    return this.client.query<Partial<ListStockLocationQuery>>({ query });
  }

}

export class GeneratedMutation {
  client: BaseGraphQLAPIClient<any>;

  constructor(client: BaseGraphQLAPIClient<any>) {
    this.client = client;
  }

  async addCustomTimelineEntry(variables: AddCustomTimelineEntryMutationVariables): Promise<APIResult<Partial<AddCustomTimelineEntryMutation>>> {
    const mutation = `
  mutation addCustomTimelineEntry($input: TimelineInput!) {
    addCustomTimelineEntry(input: $input)
  }
`;
    return this.client.mutate<Partial<AddCustomTimelineEntryMutation>>({ mutation, variables });
  }

}
export class ikasAdminGraphQLAPIClient<TokenData> extends BaseGraphQLAPIClient<TokenData> {
  queries: GeneratedQuery;
  mutations: GeneratedMutation;

  constructor(options: BaseGraphQLAPIClientOptions<TokenData>) {
    super(options);
    this.queries = new GeneratedQuery(this);
    this.mutations = new GeneratedMutation(this);
  }
}
