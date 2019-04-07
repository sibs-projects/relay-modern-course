import React from 'react';
import {
  graphql,
  QueryRenderer,
  createFragmentContainer
} from 'react-relay';
import { RouteComponentProps } from 'react-router-dom';
import { Environment } from './relay';
import type {
  Post_post
} from './__generated__/Post_post.graphql';

type PostProps = {
  post: Post_post,
}
const Post = ({ post }: PostProps) => (
  <div>
    <span>{post.title}</span>
    <span>{post.description}</span>
  </div>
);

const PostFragmentContainer = createFragmentContainer(
  Post, {
  post: graphql`
    fragment Post_post on Post {
      id
      title
      description
    },
  `,
});

type Props = {
  postId: string,
} & RouteComponentProps<{ id: string }>
const App = ({ match }: Props) => (
  <QueryRenderer
    environment={Environment}
    query={graphql`
      query MainQuery($id: ID!) {
        post(id: $id) {
          ...Post_post         
        }
      }
    `}
    variables={{
      id: match.param.id,
    }}
    render={({error, props}) => {
      if (error) {
        return <div>Error!</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }

      return (
        <PostFragmentContainer
          post={props.post} />
        );
    }}
  />
);

export default App;
