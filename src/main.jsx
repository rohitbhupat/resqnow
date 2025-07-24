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
  uri: import.meta.env.VITE_APPSYNC_API,
  headers: {
    'x-api-key': import.meta.env.VITE_AUTH_TOKEN,
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_WSS_API,
    connectionParams: {
      authToken: import.meta.env.VITE_AUTH_TOKEN,
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