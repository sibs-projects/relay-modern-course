import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import { Environment } from './relay';

const App = () => (
  <QueryRenderer
    environment={Environment}
    query={graphql`
      query MainQuery {
        me {
          id
          name
        }
      }
    `}
    variables={{}}
    render={({error, props}) => {
      if (error) {
        return <div>Error!</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      return <div>LoggedUser ID: {props.me.id}</div>;
    }}
  />
);

export default App;
