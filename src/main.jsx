import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// 🔁 Replace with your actual API details from AWS AppSync
const httpLink = createHttpLink({
  uri: 'https://w3fvxcwzm5hnbd7op4ir6crfzq.appsync-api.ap-south-1.amazonaws.com/graphql',
  headers: {
    'x-api-key': 'da2-ue6xakomife3lm2huemtjchy44',
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://w3fvxcwzm5hnbd7op4ir6crfzq.appsync-realtime-api.ap-south-1.amazonaws.com/graphql',
    connectionParams: {
      authToken: 'da2-ue6xakomife3lm2huemtjchy44',
    },
  })
);

// Split links: use wsLink for subscriptions, else httpLink
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Apollo Client instance
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);