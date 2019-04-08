import React from 'react';
import {
  graphql,
  createRefetchContainer
} from 'react-relay';

type RerunParam {
    param: string;
    import: string;
    max_runs: number;
}
type RefetchOptions {
    force?: boolean;
    rerunParamExperimental?: RerunParam;
}
type RelayRefetchProps = {
  environment: Environment,
  refetch: (
    refetchVariables,
    renderVariables: Variables |
      ((fragmentVariables: Variables) => Variables),
    callback?: (error?: Error) => void,
    options?
  ),
}
const Post = ({ post, relay }) => {
  const onRefresh = () => {
    const refetchVariables = fragmentVariables => ({
      ...fragmentVariables,
      id: post.id,
    });

    relay.refetch(
      refetchVariables,
      null,
    );
  };

  return (
    <div>
      <span>{post.title}</span>
      <span>{post.description}</span>
      <span>{post.likesCount}</span>
      <button
        onClick={onRefresh}
      >
        Click to Refresh
      </button>
    </div>
  );
};

const PostRefetchContainer = createRefetchContainer(
  Post,
  {
    post: graphql`
      fragment Post_post on Post {
        id
        title
        description
        likesCount
      },
    `,
  },
  // refetch query
  graphql`
    query PostRefetchQuery(
      $id: ID!
    ) {
      post: node(id: $id) {
        ...Post_post
      }
    }
  `
);
