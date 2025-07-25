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

export const LIST_STOREFRONT = gql`
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

export const CREATE_SCRIPT = gql`
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
