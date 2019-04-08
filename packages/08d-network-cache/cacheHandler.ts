import  { Variables, UploadableMap } from 'react-relay';
import  { RequestNode, QueryResponseCache } from 'relay-runtime';

import fetchQuery from './fetchQuery';

export const isMutation = (
  request: RequestNode
) => {
  return request.operationKind === 'mutation';
};
export const isQuery = (
  request: RequestNode
) => {
  return request.operationKind === 'query';
};
export const forceFetch = (
  cacheConfig: CacheConfig
) => {
  return !!(cacheConfig && cacheConfig.force);
};

const oneMinute = 60 * 1000;
const queryResponseCache = new QueryResponseCache({
  size: 250,
  ttl: oneMinute,
});

interface CacheConfig {
    force?: boolean;
    poll?: number;
}
const cacheHandler = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: UploadableMap,
) => {
  const queryID = request.text;

  if (isMutation(request)) {
    queryResponseCache.clear();
    return fetchQuery(request, variables, uploadables);
  }

  const fromCache = queryResponseCache.get(
    queryID,
    variables
  );
  if (isQuery(request) &&
    fromCache !== null &&
    !forceFetch(cacheConfig)
  ) {
    return fromCache;
  }

  const fromServer = await fetchQuery(
    request,
    variables,
    uploadables
  );
  if (fromServer) {
    queryResponseCache.set(
      queryID,
      variables,
      fromServer
    );
  }

  return fromServer;
};

export default cacheHandler;
