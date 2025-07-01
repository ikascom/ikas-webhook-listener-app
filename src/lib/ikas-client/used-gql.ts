import { gql } from 'graphql-request';

export const LIST_SALES_CHANNEL = gql`
  query listSalesChannel {
    listSalesChannel {
      id
      name
    }
  }
`;

export const LIST_STOCK_LOCATIONS = gql`
  query listStockLocation {
    listStockLocation {
      id
      name
    }
  }
`;

export const ADD_CUSTOM_TIMELINE_ENTRY = gql`
  mutation addCustomTimelineEntry($input: PublicTimelineInput!) {
    addCustomTimelineEntry(input: $input)
  }
`;

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
