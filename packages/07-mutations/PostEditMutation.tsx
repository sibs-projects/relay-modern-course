// PostEditMutation.ts
import {graphql, commitMutation} from 'react-relay';
import { Environment } from './relay';
import {
  PostEditMutationInput,
  PostEditMutationResponse,
} from './__generated__/PostEditMutation.graphql';

const mutation = graphql`
  mutation PostEditMutation($input: PostEditInput!) {
    PostEdit(input: $input) {
      post {
        id
        title
        description
      }
    }
  }
`;

function commit(
  input: PostEditMutationInput,
  onCompleted:
    (response?: PostEditMutationResponse) => void,
  onError: (error?: Error) => void,
) {
  const variables = {
    input,
  };

  return commitMutation(Environment, {
    mutation,
    variables,
    onCompleted,
    onError,
  });
}

export default { commit };
