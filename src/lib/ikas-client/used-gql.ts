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
