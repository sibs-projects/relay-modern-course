import React, { useEffect } from "react";
import {
  graphql,
  createRefetchContainer
} from "react-relay";

const useSimulateRelayDefer = (
  relay,
  getRefetchVariables
) => {
  useEffect(() => {
    relay.refetch(getRefetchVariables());
  }, []);
};

const Post = ({ post, relay }) => {
  useSimulateRelayDefer(relay, {
    isMounted: true,
    id: post.id
  });

  const renderComments = () => {
    if (!post.comments) return null;

    return (
      <>
        {post.comments.edges(({ node }) => (
          <Comment comment={node} />
        ))}
      </>
    );
  };

  return (
    <div>
      <span>{post.title}</span>
      <span>{post.description}</span>
      {renderComments()}
    </div>
  );
};

const PostRefetchContainer = createRefetchContainer(
  Post,
  {
    post: graphql`
      fragment Post_post on Post
        @argumentDefinition(
          isMounted: { 
            type: "Boolean!", 
            defaultValue: false 
          }
        ) {
        id
        title
        description
        comments(
          first: 10
        ) @include(if: $isMounted) {
          edges {
            node {
              id
              ...Comment_comment
            }
          }
        }
      }
    `
  },
  graphql`
    query PostRefetchQuery(
      $isMounted: Boolean!, 
      $id: ID!
    ) {
      post: node(id: $id) {
        ...Post_post 
          @arguments(
            isMounted: $isMounted
        )
      }
    }
  `
);
