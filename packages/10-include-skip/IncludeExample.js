import React from 'react';
import {
  graphql,
  createRefetchContainer
} from 'react-relay';

const Post = ({ post, relay }) => {
  const showComments = () => {
    relay.refetch({
      id: post.id,
      showComments: true,
    });
  };

  const renderComments = () => {
    if (!post.comments) return null;

    return (
      <>
        {post.comments.edges(({node}) => (
          <Comment comment={node} />
        ))}
      </>
    )
  };

  return (
    <div>
      <span>{post.title}</span>
      <span>{post.description}</span>
      <button onClick={showComments}>
        Show comments
      </button>
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
        showComments: { type: "Boolean!", defaultValue: false }
      ) {
        id
        title
        description
        comments(
          first: 10
        ) @include(if: $showComments) {
          edges {
            node {
              id
              ...Comment_comment
            }
          }
        }
      },
    `,
  },
  graphql`
    query PostRefetchQuery(
      $showComments: Boolean!
      $id: ID!
    ) {
      post: node(id: $id) {
        ...Post_post 
          @arguments(
            showComments: $showComments
          )
      }
    }
  `,
);
