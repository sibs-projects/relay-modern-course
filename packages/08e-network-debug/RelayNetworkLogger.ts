import RelayNetworkLogger
  from 'relay-runtime/lib/RelayNetworkLogger'

import fetchFunction from './fetchFunction'
import subscribeFunction from './subscribeFunction'

const fetch = __DEV__
    ? RelayNetworkLogger.wrapFetch(fetchFunction)
    : fetchFunction;

const subscribe = __DEV__
    ? RelayNetworkLogger.wrapSubscribe(subscribeFunction)
    : subscribeFunction;

const network = Network.create(fetch, subscribe)
