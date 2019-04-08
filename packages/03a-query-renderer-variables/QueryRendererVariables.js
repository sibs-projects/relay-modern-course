import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import { RouteComponentProps } from 'react-router-dom';
import { Environment } from './relay';

type PostProps = {
  post: {
    id: string,
    title: string,
    description: string,
  },
}
const Post = ({ post }: PostProps) => (
  <div>
    <span>{post.title}</span>
    <span>{post.description}</span>
  </div>
);

type Props = {
  postId: string,
} & RouteComponentProps<{ id: string }>
const App = ({ match }: Props) => (
  <QueryRenderer
    environment={Environment}
    query={graphql`
      query MainQuery($id: ID!) {
        post(id: $id) {
          id
          title
          description
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

      return <Post post={props.post} />;
    }}
  />
);

export default App;
