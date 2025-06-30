import { gql } from "graphql-request";

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
  mutation addCustomTimelineEntry($input: TimelineInput!) {
    addCustomTimelineEntry(input: $input)
  }
`;
