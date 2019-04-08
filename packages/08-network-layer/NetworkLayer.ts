import {
  Network,
  RequestNode,
  Variables,
  CacheConfig,
  UploadableMap,
  QueryPayload,
  RelayObservable,
  LegacyObserver,
  Disposable,
} from 'relay-runtime';
import {
  SubscriptionClient
} from 'subscriptions-transport-ws';

const config = {
  GRAPHQL_URL: process.env.GRAPHQL_URL,
  SUBSCRIPTION_URL:
    `ws://${process.env.GRAPHQL_URL}/subscriptions`,
};
// fetch query
export type ObservableFromValue<T> =
  | RelayObservable<T>
  | Promise<T>
  | T;
export type FetchFunction = (
    operation: RequestNode,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap
) => ObservableFromValue<QueryPayload>;
const fetchQuery = async (
  request,
  variables
) => {
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

  return await response.json();
};

// subscription
export type SubscribeFunction = (
    operation: RequestNode,
    variables: Variables,
    cacheConfig: CacheConfig,
    observer: LegacyObserver<QueryPayload>
) => RelayObservable<QueryPayload> | Disposable;
const setupSubscription = (
  config,
  variables,
  cacheConfig,
  observer
) => {
  const subscriptionClient = new SubscriptionClient(
    config.SUBSCRIPTION_URL,
    {reconnect: true}
  );

  const onNext = (result) => {
    observer.onNext(result)
  };

  const onError = (error) => {
    observer.onError(error)
  };

  const onComplete = () => {
    observer.onCompleted()
  };

  const query = config.text;

  const client = subscriptionClient.request({ query, variables })
    .subscribe(
      onNext,
      onError,
      onComplete
    );

  return {
    dispose: () => {
      client.unsubscribe()
    }
  }
};

const network = Network.create(
  fetchQuery,
  setupSubscription,
);

export default network;
