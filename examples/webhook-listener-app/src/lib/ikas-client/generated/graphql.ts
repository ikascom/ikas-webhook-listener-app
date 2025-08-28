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
export enum ProductTypeEnum {
  BUNDLE = "BUNDLE",
  DIGITAL = "DIGITAL",
  MEMBERSHIP = "MEMBERSHIP",
  PHYSICAL = "PHYSICAL",
  SUBSCRIPTION = "SUBSCRIPTION"
}
export enum ProductUnitTypeEnum {
  CENTILITER = "CENTILITER",
  CENTIMETER = "CENTIMETER",
  CUBIC_METERS = "CUBIC_METERS",
  CUSTOM = "CUSTOM",
  GRAM = "GRAM",
  KILOGRAM = "KILOGRAM",
  LITER = "LITER",
  METER = "METER",
  MILLIGRAM = "MILLIGRAM",
  MILLILITER = "MILLILITER",
  MILLIMETER = "MILLIMETER",
  SQUARE_METERS = "SQUARE_METERS"
}
export enum SalesChannelStatusEnum {
  HIDDEN = "HIDDEN",
  PASSIVE = "PASSIVE",
  VISIBLE = "VISIBLE"
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
export interface BundleProductModel {
  addToBundleBasePrice?: boolean;
  discountRatio?: number;
  filteredVariantIds: Array<string>;
  id: string;
  maxQuantity?: number;
  minQuantity?: number;
  order: number;
  productId: string;
  quantity: number;
}
export interface BundleSettingsModel {
  maxBundleQuantity?: number;
  minBundleQuantity?: number;
  products: Array<BundleProductModel>;
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
export interface Product {
  attributes?: Array<ProductAttributeValue>;
  baseUnit?: ProductBaseUnitModel;
  brand?: SimpleProductBrand;
  categories?: Array<SimpleCategory>;
  createdAt?: number;
  deleted: boolean;
  description?: string;
  dynamicPriceListIds?: Array<string>;
  googleTaxonomyId?: string;
  id: string;
  maxQuantityPerCart?: number;
  metaData?: SimpleProductMetadata;
  name: string;
  productOptionSetId?: string;
  productVolumeDiscountId?: string;
  salesChannels?: Array<ProductSalesChannel>;
  shortDescription?: string;
  tags?: Array<SimpleProductTag>;
  totalStock?: number;
  translations?: Array<ProductTranslation>;
  type: ProductTypeEnum;
  updatedAt?: number;
  variants: Array<SimpleProductVariant>;
  vendor?: SimpleProductVendor;
  weight?: number;
}
export interface ProductAttributeValue {
  imageIds?: Array<string>;
  productAttributeId?: string;
  productAttributeOptionId?: string;
  value?: string;
}
export interface ProductBaseUnitModel {
  baseAmount?: number;
  type: ProductUnitTypeEnum;
  unitId?: string;
}
export interface ProductImage {
  fileName?: string;
  imageId?: string;
  isMain: boolean;
  isVideo?: boolean;
  order: number;
}
export interface ProductPaginationResponse {
  count: number;
  data: Array<Product>;
  hasNext: boolean;
  limit: number;
  page: number;
}
export interface ProductPrice {
  buyPrice?: number;
  currency?: string;
  currencyCode?: string;
  currencySymbol?: string;
  discountPrice?: number;
  priceListId?: string;
  sellPrice: number;
}
export interface ProductSalesChannel {
  id: string;
  maxQuantityPerCart?: number;
  minQuantityPerCart?: number;
  productVolumeDiscountId?: string;
  quantitySettings?: Array<number>;
  status: SalesChannelStatusEnum;
}
export interface ProductStockLocation {
  createdAt?: number;
  deleted: boolean;
  id: string;
  productId: string;
  stockCount: number;
  stockLocationId: string;
  updatedAt?: number;
  variantId: string;
}
export interface ProductTranslation {
  description?: string;
  locale: string;
  name?: string;
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
export interface SimpleCategory {
  id: string;
  name: string;
}
export interface SimpleProductBrand {
  id: string;
  name: string;
}
export interface SimpleProductMetadata {
  _id: string;
  id: string;
  slug: string;
}
export interface SimpleProductTag {
  id: string;
  name: string;
}
export interface SimpleProductVariant {
  attributes?: Array<ProductAttributeValue>;
  barcodeList?: Array<string>;
  bundleSettings?: BundleSettingsModel;
  createdAt?: number;
  deleted: boolean;
  hsCode?: string;
  id: string;
  images?: Array<ProductImage>;
  isActive: boolean;
  prices: Array<ProductPrice>;
  sellIfOutOfStock?: boolean;
  sku?: string;
  stocks?: Array<ProductStockLocation>;
  unit?: VariantUnitModel;
  updatedAt?: number;
  variantValues?: Array<SimpleProductVariantValueRelation>;
  weight?: number;
}
export interface SimpleProductVariantValueRelation {
  variantTypeId: string;
  variantTypeName: string;
  variantValueId: string;
  variantValueName: string;
}
export interface SimpleProductVendor {
  id: string;
  name: string;
}
export interface VariantUnitModel {
  amount?: number;
  type: ProductUnitTypeEnum;
}
export interface Webhook {
  createdAt?: number;
  deleted: boolean;
  endpoint: string;
  id: string;
  scope: string;
  updatedAt?: number;
}
export interface PaginationInput {
  limit?: number;
  page?: number;
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
export interface DeleteWebhookMutationVariables {
  scopes: string;
}
export interface DeleteWebhookMutation {
  deleteWebhook: boolean;
}
export interface ListProductQueryVariables {
  pagination?: PaginationInput;
}
export interface ListProductQuery {
  listProduct: {
  data: Array<{
  id: string;
  name: string;
}>;
  count: number;
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

  async listProduct(variables: ListProductQueryVariables): Promise<APIResult<Partial<ListProductQuery>>> {
    const query = `
  query ListProduct($pagination: PaginationInput) {
    listProduct(pagination: $pagination) {
      data {
        id
        name
      }
      count
    }
  }
`;
    return this.client.query<Partial<ListProductQuery>>({ query, variables });
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

  async deleteWebhook(variables: DeleteWebhookMutationVariables): Promise<APIResult<Partial<DeleteWebhookMutation>>> {
    const mutation = `
  mutation DeleteWebhook($scopes: [String!]!) {
    deleteWebhook(scopes: $scopes)
  }
`;
    return this.client.mutate<Partial<DeleteWebhookMutation>>({ mutation, variables });
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
