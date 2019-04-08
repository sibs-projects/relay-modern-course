import {
  RequestNode,
  Variables,
} from 'relay-runtime';
import {
  AsyncStorage,
} from 'react-native';

const config = {
  GRAPHQL_URL: process.env.GRAPHQL_URL,
};

const fetchQuery = async (
  request: RequestNode,
  variables: Variables
) => {
  const body = JSON.stringify({
    query: request.text,
    variables,
  });

  const token = await AsyncStorage.getItem('token');

  const headers = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: token,
  };

  const response = await fetch(
    config.GRAPHQL_URL, {
    method: 'POST',
    headers,
    body,
  });

  return await response.json();
};
