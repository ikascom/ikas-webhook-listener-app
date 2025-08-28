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

export const SAVE_WEBHOOKS = gql`
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

export const LIST_WEBHOOKS = gql`
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

export const DELETE_WEBHOOK = gql`
  mutation DeleteWebhook($scopes: [String!]!) {
    deleteWebhook(scopes: $scopes)
  }
`;

export const LIST_PRODUCT = gql`
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
