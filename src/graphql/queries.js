import { gql } from '@apollo/client';

export const LIST_SOS_ALERTS = gql`
  query ListResQNowGraphQLAPIS {
    listResQNowGraphQLAPIS {
      items {
        sos_id
        username
        urgency
        status
        timestamp
        location
      }
    }
  }
`;
