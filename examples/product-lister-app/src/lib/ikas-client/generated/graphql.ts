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
export enum VariantSelectionTypeEnum {
  CHOICE = "CHOICE",
  COLOR = "COLOR"
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
export interface CreateHTMLMetaDataInput {
  canonicals?: Array<string>;
  description?: string;
  disableIndex?: boolean;
  pageTitle?: string;
  slug: string;
  translations?: Array<HTMLMetaDataTranslationInput>;
}
export interface CreateProductInput {
  attributes?: Array<ProductAttributeValueInput>;
  baseUnit?: ProductBaseUnitInput;
  brand?: ProductProductBrandInput;
  categories?: Array<ProductCategoryInput>;
  description?: string;
  dynamicPriceListIds?: Array<string>;
  googleTaxonomyId?: string;
  groupVariantsByVariantTypeName?: string;
  metaData?: CreateHTMLMetaDataInput;
  name: string;
  productOptionSetId?: string;
  salesChannels?: Array<ProductSalesChannelInput>;
  tags?: Array<ProductProductTagsInput>;
  translations?: Array<ProductTranslationInput>;
  type: ProductTypeEnum;
  variants?: Array<CreateProductVariantInput>;
  vendor?: ProductVendorInput;
  weight?: number;
}
export interface CreateProductVariantInput {
  attributes?: Array<ProductAttributeValueInput>;
  barcodeList?: Array<string>;
  hsCode?: string;
  images?: Array<ProductVariantImageInput>;
  isActive: boolean;
  prices: Array<ProductVariantPriceInput>;
  sellIfOutOfStock?: boolean;
  sku?: string;
  unit?: ProductVariantUnitModelInput;
  variantValues?: Array<ProductVariantValueRelationInput>;
  weight?: number;
}
export interface HTMLMetaDataTranslationInput {
  description?: string;
  locale: string;
  pageTitle?: string;
  slug?: string;
}
export interface ProductAttributeValueInput {
  imageIds?: Array<string>;
  productAttributeId?: string;
  productAttributeOptionId?: string;
  value?: string;
}
export interface ProductBaseUnitInput {
  baseAmount: number;
  type: ProductUnitTypeEnum;
  unitName?: string;
}
export interface ProductCategoryInput {
  name: string;
  path?: Array<string>;
}
export interface ProductProductBrandInput {
  description?: string;
  name: string;
}
export interface ProductProductTagsInput {
  name: string;
}
export interface ProductSalesChannelInput {
  id: string;
  maxQuantityPerCart?: number;
  minQuantityPerCart?: number;
  productVolumeDiscountId?: string;
  quantitySettings?: Array<number>;
  status: SalesChannelStatusEnum;
}
export interface ProductTranslationInput {
  description?: string;
  locale: string;
  name?: string;
}
export interface ProductVariantImageInput {
  fileName?: string;
  imageUrl?: string;
  isMain: boolean;
  isVideo?: boolean;
  order: number;
}
export interface ProductVariantPriceInput {
  buyPrice?: number;
  currency?: string;
  discountPrice?: number;
  priceListId?: string;
  sellPrice: number;
}
export interface ProductVariantUnitModelInput {
  amount: number;
  type: ProductUnitTypeEnum;
}
export interface ProductVariantValueRelationInput {
  selectionType?: VariantSelectionTypeEnum;
  variantTypeName: string;
  variantValueName: string;
}
export interface ProductVendorInput {
  description?: string;
  name: string;
}
export interface UpdateHTMLMetaDataInput {
  canonicals?: Array<string>;
  description?: string;
  disableIndex?: boolean;
  pageTitle?: string;
  slug?: string;
  translations?: Array<HTMLMetaDataTranslationInput>;
}
export interface UpdateProductInput {
  attributes?: Array<ProductAttributeValueInput>;
  baseUnit?: ProductBaseUnitInput;
  brand?: ProductProductBrandInput;
  categories?: Array<ProductCategoryInput>;
  description?: string;
  dynamicPriceListIds?: Array<string>;
  googleTaxonomyId?: string;
  groupVariantsByVariantTypeName?: string;
  id: string;
  metaData?: UpdateHTMLMetaDataInput;
  name?: string;
  productOptionSetId?: string;
  salesChannels?: Array<ProductSalesChannelInput>;
  tags?: Array<ProductProductTagsInput>;
  translations?: Array<ProductTranslationInput>;
  type?: ProductTypeEnum;
  variants?: Array<UpdateProductVariantInput>;
  vendor?: ProductVendorInput;
  weight?: number;
}
export interface UpdateProductVariantInput {
  attributes?: Array<ProductAttributeValueInput>;
  barcodeList?: Array<string>;
  hsCode?: string;
  id: string;
  isActive?: boolean;
  prices?: Array<ProductVariantPriceInput>;
  sellIfOutOfStock?: boolean;
  sku?: string;
  unit?: ProductVariantUnitModelInput;
  weight?: number;
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
export interface ListProductQueryVariables {}
export interface ListProductQuery {
  listProduct: {
  data: Array<{
  id: string;
  name: string;
  description?: string;
  brand?: {
  name: string;
};
  totalStock?: number;
}>;
};
}
export interface CreateProductMutationVariables {
  input: CreateProductInput;
}
export interface CreateProductMutation {
  createProduct: {
  id: string;
  name: string;
  description?: string;
};
}
export interface UpdateProductMutationVariables {
  input: UpdateProductInput;
}
export interface UpdateProductMutation {
  updateProduct: {
  id: string;
  name: string;
  description?: string;
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

  async listProduct(): Promise<APIResult<Partial<ListProductQuery>>> {
    const query = `
  query ListProduct {
    listProduct {
      data {
        id
        name
        description
        brand {
          name
        }
        totalStock
      }
    }
  }
`;
    return this.client.query<Partial<ListProductQuery>>({ query });
  }

}

export class GeneratedMutation {
  client: BaseGraphQLAPIClient<any>;

  constructor(client: BaseGraphQLAPIClient<any>) {
    this.client = client;
  }

  async createProduct(variables: CreateProductMutationVariables): Promise<APIResult<Partial<CreateProductMutation>>> {
    const mutation = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
    }
  }
`;
    return this.client.mutate<Partial<CreateProductMutation>>({ mutation, variables });
  }

  async updateProduct(variables: UpdateProductMutationVariables): Promise<APIResult<Partial<UpdateProductMutation>>> {
    const mutation = `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      description
    }
  }
`;
    return this.client.mutate<Partial<UpdateProductMutation>>({ mutation, variables });
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
