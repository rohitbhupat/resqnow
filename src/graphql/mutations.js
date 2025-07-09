import { gql } from '@apollo/client';

export const CREATE_SOS_ALERT = gql`
  mutation CreateSOSAlert($input: CreateResQNowGraphQLAPIInput!) {
    createResQNowGraphQLAPI(input: $input) {
      sos_id
      username
      status
    }
  }
`;

export const UPDATE_SOS_STATUS = gql`
  mutation UpdateSOSStatus($input: UpdateResQNowGraphQLAPIInput!) {
    updateResQNowGraphQLAPI(input: $input) {
      sos_id
      status
    }
  }
`;