import * as React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { QueryRenderer } from 'react-relay';

import  { GraphQLTaggedNode, Variables } from 'react-relay';

import Environment from './Environment';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';

type Config = {
  query: GraphQLTaggedNode,
  queriesParams?: (props: object) => Variables,
  variables?: Variables,
  getFragmentProps?: (fragmentProps: object) => object;
  loadingView?: React.ReactNode | null;
};
export default function createQueryRenderer(
  FragmentComponent: React.Component,
  Component: React.Component,
  config: Config,
) {
  const { query, queriesParams } = config;

  class QueryRendererWrapper extends React.Component<{}> {
    render() {
      const variables = queriesParams
        ? queriesParams(this.props) :
        config.variables;

      return (
        <QueryRenderer
          environment={Environment}
          query={query}
          variables={variables}
          render={({ error, props, retry }) => {
            if (error) {
              return (
                <ErrorView
                  error={error}
                  retry={retry}/>
              );
            }

            if (props) {
              const fragmentProps = config.getFragmentProps
                ? config.getFragmentProps(props)
                : { query: props };

              return (
                <FragmentComponent
                  {...this.props}
                  {...fragmentProps}
                />
              );
            }

            if (config.loadingView !== undefined) {
              return config.loadingView;
            }

            return <LoadingView />
          }}
        />
      );
    }
  }

  return hoistStatics(QueryRendererWrapper, Component);
}
