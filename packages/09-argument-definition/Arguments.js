import React from 'react';
import {
  graphql,
  createFragmentContainer
} from 'react-relay';

const Users = ({ query }) => (
  <>
    {query.users.edges.map(({node}) => (
      <>
        <span>{node.id}</span>
        <span>{node.name}</span>
      </>
    ))}
  </>
);

const UsersFragmentContainer = createFragmentContainer(
  Users, {
  query: graphql`
    fragment Users_query on Query
    @argumentDefinition(
      includeMe: { type: "Boolean!", defaultValue: false }
      first: { type: Int, defaultValue: 10 }
    ) {
      users(first: $first, includeMe: $includeMe) {
        edges {
          node {
            id
            name
          }
        }
      }
    },
  `,
});

const UsersWithMe = ({ query }) => (
  <Users query={query} />
);

const UsersWithMeFragmentContainer = createFragmentContainer(
  UsersWithMe, {
  query: graphql`
    fragment Post_query on Query
    @argumentDefinition(
      includeMe: { type: "Boolean!", defaultValue: true}
    ) {
      ...Users_query @arguments(includeMe: $includeMe)
    },
  `,
});
