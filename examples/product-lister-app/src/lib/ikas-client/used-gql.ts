import { gql } from 'graphql-request';

export const GET_MERCHANT = gql`
  query getMerchant {
    getMerchant {
      id
      email
      storeName
    }
  }
`;

export const GET_AUTHORIZED_APP = gql`
  query getAuthorizedApp {
    getAuthorizedApp {
      id
      salesChannelId
    }
  }
`;

export const LIST_SALES_CHANNELS = gql`
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

export const LIST_PRODUCT = gql`
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

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      description
    }
  }
`;
