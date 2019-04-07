import {
  RequestNode,
  Variables,
} from 'relay-runtime';

const config = {
  GRAPHQL_URL: process.env.GRAPHQL_URL,
};

export const TOKEN_KEY = 'token';

export function getToken() {
  // get token from cookie or session token instead
  return localStorage.getItem(TOKEN_KEY);
}

const fetchQuery = async (
  request: RequestNode,
  variables: Variables
) => {
  const body = JSON.stringify({
    query: request.text,
    variables,
  });
  const headers = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: getToken(),
  };

  const response = await fetch(
    config.GRAPHQL_URL, {
    method: 'POST',
    headers,
    body,
  });

  return await response.json();
};
