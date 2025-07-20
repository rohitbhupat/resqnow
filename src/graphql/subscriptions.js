import { gql } from '@apollo/client';

export const ON_CREATE_SOS_ALERT = gql`
  subscription OnCreateSOSAlert {
    onCreateResQNowGraphQLAPI {
      sos_id
      username
      urgency
      status
      timestamp
      location
    }
  }
`;

export const ON_UPDATE_SOS_STATUS = gql`
  subscription OnUpdateSOSStatus {
    onUpdateResQNowGraphQLAPI {
      sos_id
      status
      location
    }
  }
`;