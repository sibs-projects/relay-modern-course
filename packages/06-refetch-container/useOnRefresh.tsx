import React, { useState } from 'react';

const useOnRelayRefresh = (
  relay,
  getFragmentVariables,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const getRefetchVariables = () => {
    if (getFragmentVariables) {
      return getFragmentVariables();
    }

    return {};
  };

  const onRefresh = () => {
    if (isLoading) return;

    const refetchVariables = fragmentVariables => ({
      ...fragmentVariables,
      ...getRefetchVariables(),
    });

    setIsLoading(true);

    relay.refetch(
      refetchVariables,
      null,
      () => {
        setIsLoading(false);
      }
    );
  };

  return {
    isLoading,
    onRefresh,
  };
};
