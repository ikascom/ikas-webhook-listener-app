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
export interface Webhook {
  createdAt?: number;
  deleted: boolean;
  endpoint: string;
  id: string;
  scope: string;
  updatedAt?: number;
}
export interface WebhookInput {
  endpoint: string;
  salesChannelIds?: Array<string>;
  scopes: Array<string>;
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
export interface SaveWebhooksMutationVariables {
  input: WebhookInput;
}
export interface SaveWebhooksMutation {
  saveWebhooks?: Array<{
  createdAt?: number;
  deleted: boolean;
  endpoint: string;
  id: string;
  scope: string;
  updatedAt?: number;
}>;
}
export interface ListWebhookQueryVariables {}
export interface ListWebhookQuery {
  listWebhook: Array<{
  createdAt?: number;
  endpoint: string;
  deleted: boolean;
  id: string;
  scope: string;
  updatedAt?: number;
}>;
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

  async listWebhook(): Promise<APIResult<Partial<ListWebhookQuery>>> {
    const query = `
  query ListWebhook {
    listWebhook {
      createdAt
      endpoint
      deleted
      id
      scope
      updatedAt
    }
  }
`;
    return this.client.query<Partial<ListWebhookQuery>>({ query });
  }

}

export class GeneratedMutation {
  client: BaseGraphQLAPIClient<any>;

  constructor(client: BaseGraphQLAPIClient<any>) {
    this.client = client;
  }

  async saveWebhooks(variables: SaveWebhooksMutationVariables): Promise<APIResult<Partial<SaveWebhooksMutation>>> {
    const mutation = `
  mutation SaveWebhooks($input: WebhookInput!) {
    saveWebhooks(input: $input) {
      createdAt
      deleted
      endpoint
      id
      scope
      updatedAt
    }
  }
`;
    return this.client.mutate<Partial<SaveWebhooksMutation>>({ mutation, variables });
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
