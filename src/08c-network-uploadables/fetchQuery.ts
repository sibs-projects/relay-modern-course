import {
  RequestNode,
  Variables,
  CacheConfig,
} from 'relay-runtime';
const config = {
  GRAPHQL_URL: process.env.GRAPHQL_URL,
};

export type Uploadable = File | Blob;
export interface UploadableMap {
    [key: string]: Uploadable;
}

const getRequestBodyWithUploadables = (
  request: RequestNode,
  variables: Variables,
  uploadables: UploadableMap,
) => {
  let formData = new FormData();
  formData.append('name', request.name);
  formData.append('query', request.text);
  formData.append('variables', JSON.stringify(variables));

  Object.keys(uploadables).forEach(key => {
    if (Object.prototype.hasOwnProperty
        .call(uploadables, key)) {
      formData.append(key, uploadables[key]);
    }
  });

  return formData;
};

const getRequestBodyWithoutUplodables = (
  request: RequestNode,
  variables: Variables,
) => {
  return JSON.stringify({
    query: request.text, // GraphQL text from input
    variables,
  });
}

const getRequestBody = (
  request: RequestNode,
  variables: Variables,
  uploadables?: UploadableMap
) => {
  if (uploadables) {
    return getRequestBodyWithUploadables(
      request,
      variables,
      uploadables
    );
  }

  return getRequestBodyWithoutUplodables(
    request,
    variables
  );
};

const getHeaders = (
  uploadables?: UploadableMap
) => {
  if (uploadables) {
    return {
      Accept: '*/*',
    };
  }

  return {
    Accept: 'application/json',
    'Content-type': 'application/json',
  };
};

const TOKEN_KEY = 'token';

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
const fetchQuery = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap
) => {
  const body = getRequestBody(request, variables, uploadables);

  const headers = {
    ...getHeaders(uploadables),
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
