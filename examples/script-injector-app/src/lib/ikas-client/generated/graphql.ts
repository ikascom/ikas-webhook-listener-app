import { BaseGraphQLAPIClient, BaseGraphQLAPIClientOptions, APIResult } from '@ikas/admin-api-client';

export enum MerchantRegionEnum {
  AF = "AF",
  AN = "AN",
  AS = "AS",
  EU = "EU",
  OC = "OC",
  PL = "PL",
  TR = "TR",
  US = "US"
}
export enum MerchantSettingsAddressTypeEnum {
  CORPORATE = "CORPORATE",
  INDIVIDUAL = "INDIVIDUAL"
}
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
export enum StorefrontJSScriptContentTypeEnum {
  FILE = "FILE",
  SCRIPT = "SCRIPT"
}
export interface AuthorizedApp {
  addedDate: number;
  createdAt?: number;
  deleted: boolean;
  id: string;
  partnerId: string;
  salesChannelId?: string;
  scope: string;
  storeAppId: string;
  supportsMultipleInstallation?: boolean;
  updatedAt?: number;
}
export interface MerchantAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: MerchantAddressCity;
  company?: string;
  country?: MerchantAddressCountry;
  district?: MerchantAddressDistrict;
  firstName?: string;
  identityNumber?: string;
  lastName?: string;
  postalCode?: string;
  state?: MerchantAddressState;
  taxNumber?: string;
  taxOffice?: string;
  title?: string;
  type?: MerchantSettingsAddressTypeEnum;
  vkn?: string;
}
export interface MerchantAddressCity {
  code?: string;
  id?: string;
  name?: string;
}
export interface MerchantAddressCountry {
  code?: string;
  id?: string;
  iso2?: string;
  iso3?: string;
  name?: string;
}
export interface MerchantAddressDistrict {
  code?: string;
  id?: string;
  name?: string;
}
export interface MerchantAddressState {
  code?: string;
  id?: string;
  name?: string;
}
export interface MerchantResponse {
  address?: MerchantAddress;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  merchantName?: string;
  merchantSequence?: number;
  phoneNumber?: string;
  region?: MerchantRegionEnum;
  storeName?: string;
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
export interface Storefront {
  createdAt?: number;
  deleted: boolean;
  id: string;
  name: string;
  routings: Array<StorefrontRouting>;
  salesChannelId: string;
  updatedAt?: number;
}
export interface StorefrontDynamicCurrencySettings {
  roundingFormat?: string;
  targetCurrencyCode: string;
  targetCurrencySymbol?: string;
}
export interface StorefrontJSScript {
  authorizedAppId?: string;
  contentType?: StorefrontJSScriptContentTypeEnum;
  createdAt?: number;
  deleted: boolean;
  fileName?: string;
  id: string;
  isActive: boolean;
  isHighPriority?: boolean;
  name: string;
  order?: number;
  scriptContent: string;
  storeAppId?: string;
  storefrontId: string;
  updatedAt?: number;
}
export interface StorefrontRouting {
  countryCodes?: Array<string>;
  createdAt?: number;
  currencyCode?: string;
  currencySymbol?: string;
  deleted: boolean;
  domain?: string;
  dynamicCurrencySettings?: StorefrontDynamicCurrencySettings;
  id: string;
  locale: string;
  path?: string;
  priceListId?: string;
  updatedAt?: number;
}
export interface CreateStorefrontJSScriptInput {
  contentType: StorefrontJSScriptContentTypeEnum;
  fileName?: string;
  isHighPriority?: boolean;
  name: string;
  scriptContent: string;
  storefrontId: string;
}

export interface GetMerchantQueryVariables {}
export interface GetMerchantQuery {
  getMerchant: {
  id: string;
  email: string;
  storeName?: string;
};
}
export interface GetAuthorizedAppQueryVariables {}
export interface GetAuthorizedAppQuery {
  getAuthorizedApp?: {
  id: string;
  salesChannelId?: string;
};
}
export interface ListSalesChannelQueryVariables {}
export interface ListSalesChannelQuery {
  listSalesChannel: Array<{
  createdAt?: number;
  deleted: boolean;
  id: string;
  name: string;
  type: SalesChannelTypeEnum;
  updatedAt?: number;
}>;
}
export interface ListStorefrontQueryVariables {}
export interface ListStorefrontQuery {
  listStorefront: Array<{
  id: string;
  name: string;
  salesChannelId: string;
  routings: Array<{
  id: string;
  domain?: string;
  currencySymbol?: string;
  currencyCode?: string;
  countryCodes?: Array<string>;
  path?: string;
  locale: string;
}>;
}>;
}
export interface CreateStorefrontJSScriptMutationVariables {
  input: CreateStorefrontJSScriptInput;
}
export interface CreateStorefrontJSScriptMutation {
  createStorefrontJSScript: {
  storefrontId: string;
  scriptContent: string;
  name: string;
  id: string;
  authorizedAppId?: string;
  contentType?: StorefrontJSScriptContentTypeEnum;
};
}

export class GeneratedQuery {
  client: BaseGraphQLAPIClient<any>;

  constructor(client: BaseGraphQLAPIClient<any>) {
    this.client = client;
  }

  async getMerchant(): Promise<APIResult<Partial<GetMerchantQuery>>> {
    const query = `
  query getMerchant {
    getMerchant {
      id
      email
      storeName
    }
  }
`;
    return this.client.query<Partial<GetMerchantQuery>>({ query });
  }

  async getAuthorizedApp(): Promise<APIResult<Partial<GetAuthorizedAppQuery>>> {
    const query = `
  query getAuthorizedApp {
    getAuthorizedApp {
      id
      salesChannelId
    }
  }
`;
    return this.client.query<Partial<GetAuthorizedAppQuery>>({ query });
  }

  async listSalesChannel(): Promise<APIResult<Partial<ListSalesChannelQuery>>> {
    const query = `
  query ListSalesChannel {
    listSalesChannel {
      createdAt
      deleted
      id
      name
      type
      updatedAt
    }
  }
`;
    return this.client.query<Partial<ListSalesChannelQuery>>({ query });
  }

  async listStorefront(): Promise<APIResult<Partial<ListStorefrontQuery>>> {
    const query = `
  query ListStorefront {
    listStorefront {
      id
      name
      salesChannelId
      routings {
        id
        domain
        currencySymbol
        currencyCode
        countryCodes
        path
        locale
      }
    }
  }
`;
    return this.client.query<Partial<ListStorefrontQuery>>({ query });
  }

}

export class GeneratedMutation {
  client: BaseGraphQLAPIClient<any>;

  constructor(client: BaseGraphQLAPIClient<any>) {
    this.client = client;
  }

  async createStorefrontJSScript(variables: CreateStorefrontJSScriptMutationVariables): Promise<APIResult<Partial<CreateStorefrontJSScriptMutation>>> {
    const mutation = `
  mutation CreateStorefrontJSScript($input: CreateStorefrontJSScriptInput!) {
    createStorefrontJSScript(input: $input) {
      storefrontId
      scriptContent
      name
      id
      authorizedAppId
      contentType
    }
  }
`;
    return this.client.mutate<Partial<CreateStorefrontJSScriptMutation>>({ mutation, variables });
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
