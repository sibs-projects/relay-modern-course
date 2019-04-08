import React, { useState } from 'react';
import PostEditMutation from './PostEditMutation';
import { useSnackbar } from 'snackbar';
import { createFragmentContainer, graphql } from 'react-relay';
import {
  Post_post
} from './__generated__/Post_post.graphql';

type Props = {
  post: Post_post,
}
const PostEdit = ({ post }: Props) => {
  const [title, setTitle] = useState(post.title);
  const { showSnackbar } = useSnackbar();

  const onPostEdit = () => {
    const input = {
      title,
    };

    const onCompleted = () => {
      showSnackbar({
        message: 'Post edit with success',
      });
    };

    const onError = () => {
      showSnackbar({
        message: 'Error when editting post',
      });
    };

    PostEditMutation.commit(
      input,
      onCompleted,
      onError
    );
  };

  return (
    <>
      <input
        type={'text'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={onPostEdit}>
        Save Post
      </button>
    </>
  )
};

const PostEditFragmentContainer = createFragmentContainer(
  PostEdit, {
  post: graphql`
    fragment Post_post on Post {
      id
      title
      description
    },
  `,
});
