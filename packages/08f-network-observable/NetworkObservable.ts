import {
  RequestNode,
  Variables,
  Observable,
  QueryResponseCache,
} from 'relay-runtime';

const config = {
  GRAPHQL_URL: process.env.GRAPHQL_URL,
};

const oneMinute = 60 * 1000;
const queryResponseCache = new QueryResponseCache({
  size: 250,
  ttl: oneMinute,
});

/**
 * A Sink is an object of methods
 * provided by Observable during construction.
 * The methods are to be called to
 * trigger each event. It also contains a closed
 * field to see if the resulting
 * subscription has closed.
 */
export type Sink<T> = {
  next: (value: T) => void,
  error: (
    error: Error,
    isUncaughtThrownError?: boolean
  ) => void,
  complete: () => void,
  closed: boolean,
};

const cacheThenNetworkFn = async (
  request: RequestNode,
  variables: Variables,
  sink: Sink<any>
) => {
  const queryID = request.text;

  const fromCache = queryResponseCache.get(
    queryID,
    variables
  );

  if (fromCache) {
    // return data from cache first, then network
    sink.next(fromCache);
  }

  const body = JSON.stringify({
    query: request.text,
    variables,
  });
  const headers = {
    Accept: 'application/json',
    'Content-type': 'application/json',
  };

  const response = await fetch(
    config.GRAPHQL_URL, {
    method: 'POST',
    headers,
    body,
  });

  const fromServer = await response.json();

  if (fromServer) {
    queryResponseCache.set(
      queryID,
      variables,
      fromServer
    );
  }

  sink.next(fromServer);
  sink.complete();
};

const fetchQuery = (
  request: RequestNode,
  variables: Variables,
) => {
  return Observable.create(sink => {
    cacheThenNetworkFn(
      request,
      variables,
      sink
    );
  });
};

export default fetchQuery;
