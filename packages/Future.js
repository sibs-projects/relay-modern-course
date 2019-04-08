import { useQuery, useFragment, graphql } from 'react-relay';

const CommentsFragment = graphql`
  fragment Comments_post on Post {
    comments(first: 10) 
        @connection(key: "Post_comments", filters: []) 
        @stream(label: "comments", initialCount: 10) {
      edges {
        node {
          text
          author {
            name
          }
        }
      }
    }
  }
`;

const Comments = (props) => {
  const comments = useFragment(CommentsFragment, props);

  return (
    <>
    {comments.edges.map(({node}) => (
      <span>{node.text} said by ${node.author.name}</span>
    ))}
    </>
  );
};

const PostFragment = graphql`
  fragment Post_post on Post {
    id
    title
    ...Comments_post @defer(label: "DefferedPostComments")
  }
`;

const Post = (props) => {
  const post = useFragment(PostFragment, props);

  return (
    <>
      <span>{post.title}</span>
      <Comments post={post} />
    </>
  );
};

const FeedFragment = graphql`
  fragment Feed_query on Query
    @refetchable(queryName: "FeedRefetchableFragmentQuery")
    @argumentDefinitions(
        first: {type: Int, defaultValue: 10},
        after: {type: String},
    )
  {
    posts(first: $first, after: $after) 
    @connection(key: "Feed_posts", filters: []) {
      edges {
        node {
          id
          ...Post_post
        }
      }
    }
  }
  }
`;

const FeedQuery = graphql`
  query FeedQuery {
    ...Feed_query
  }
`;

const Feed = () => {
  const [fragments] = useQuery(FeedQuery);
  const { query } = fragments;
  const { posts } = query;

  return (
    <>
      {posts.edges.map(({node}) => (
        <Post key={node.id} post={node} />
      ))}
    </>
  );
};
