import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddCommentResponse = {
  __typename?: 'AddCommentResponse';
  comment?: Maybe<Comment>;
  errors?: Maybe<Array<FieldError>>;
};

export type Comment = {
  __typename?: 'Comment';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  post: Post;
  postId: Scalars['Float'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['Float'];
};

export type CommentInput = {
  postId: Scalars['Float'];
  text: Scalars['String'];
};

export type Comments = {
  __typename?: 'Comments';
  comments: Array<Comment>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: AddCommentResponse;
  banUser: User;
  changePassword: UserResponse;
  createPost: Post;
  deletePost: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  removeComment: Scalars['Boolean'];
  updatePost?: Maybe<Post>;
  vote: Scalars['Boolean'];
};


export type MutationAddCommentArgs = {
  input: CommentInput;
};


export type MutationBanUserArgs = {
  id: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationRemoveCommentArgs = {
  id: Scalars['Int'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  id: Scalars['Float'];
  points: Scalars['Float'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type PostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  comment: Comment;
  comments?: Maybe<Comments>;
  hello: Scalars['String'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PaginatedPosts;
  searchPosts: Array<Post>;
  user: User;
};


export type QueryCommentArgs = {
  id: Scalars['Int'];
};


export type QueryCommentsArgs = {
  postId: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QuerySearchPostsArgs = {
  query: Scalars['String'];
};


export type QueryUserArgs = {
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  banned: Scalars['Boolean'];
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  posts: Array<Post>;
  role: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  passwordVerify: Scalars['String'];
  username: Scalars['String'];
};

export type PostSnippetFragment = { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, points: number, creatorId: number, text: string, voteStatus?: number | null | undefined, creator: { __typename?: 'User', id: number, username: string, role: string } };

export type RegularCommentFragment = { __typename?: 'Comment', id: number, postId: number, text: string, createdAt: string, user: { __typename?: 'User', id: number, username: string } };

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, role: string, banned: boolean };

export type RegularUserReponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string, role: string, banned: boolean } | null | undefined };

export type AddCommentMutationVariables = Exact<{
  input: CommentInput;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: { __typename?: 'AddCommentResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, comment?: { __typename?: 'Comment', id: number, postId: number, text: string, createdAt: string, user: { __typename?: 'User', id: number, username: string } } | null | undefined } };

export type BanUserMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type BanUserMutation = { __typename?: 'Mutation', banUser: { __typename?: 'User', id: number, username: string, role: string, banned: boolean } };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string, role: string, banned: boolean } | null | undefined } };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, text: string, points: number, creatorId: number } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string, role: string, banned: boolean } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string, role: string, banned: boolean } | null | undefined } };

export type RemoveCommentMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveCommentMutation = { __typename?: 'Mutation', removeComment: boolean };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', id: number, title: string, text: string, textSnippet: string } | null | undefined };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type CommentsQueryVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type CommentsQuery = { __typename?: 'Query', comments?: { __typename?: 'Comments', comments: Array<{ __typename?: 'Comment', id: number, postId: number, text: string, createdAt: string, user: { __typename?: 'User', id: number, username: string } }> } | null | undefined };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, role: string, banned: boolean } | null | undefined };

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, points: number, creatorId: number, text: string, voteStatus?: number | null | undefined, creator: { __typename?: 'User', id: number, username: string, role: string } } | null | undefined };

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, points: number, creatorId: number, text: string, voteStatus?: number | null | undefined, creator: { __typename?: 'User', id: number, username: string, role: string } }> } };

export type SearchPostsQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchPostsQuery = { __typename?: 'Query', searchPosts: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, points: number, creatorId: number, text: string, voteStatus?: number | null | undefined, creator: { __typename?: 'User', id: number, username: string, role: string } }> };

export type UserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', createdAt: string, id: number, username: string, role: string, banned: boolean, posts: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, points: number, creatorId: number, text: string, voteStatus?: number | null | undefined, creator: { __typename?: 'User', id: number, username: string, role: string } }> } };

export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  createdAt
  updatedAt
  title
  points
  creatorId
  text
  voteStatus
  creator {
    id
    username
    role
  }
}
    `;
export const RegularCommentFragmentDoc = gql`
    fragment RegularComment on Comment {
  id
  postId
  text
  createdAt
  user {
    id
    username
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  role
  banned
}
    `;
export const RegularUserReponseFragmentDoc = gql`
    fragment RegularUserReponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const AddCommentDocument = gql`
    mutation AddComment($input: CommentInput!) {
  addComment(input: $input) {
    errors {
      ...RegularError
    }
    comment {
      ...RegularComment
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularCommentFragmentDoc}`;

export function useAddCommentMutation() {
  return Urql.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument);
};
export const BanUserDocument = gql`
    mutation BanUser($id: Int!) {
  banUser(id: $id) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useBanUserMutation() {
  return Urql.useMutation<BanUserMutation, BanUserMutationVariables>(BanUserDocument);
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserReponse
  }
}
    ${RegularUserReponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    createdAt
    updatedAt
    title
    text
    points
    creatorId
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserReponse
  }
}
    ${RegularUserReponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserReponse
  }
}
    ${RegularUserReponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const RemoveCommentDocument = gql`
    mutation RemoveComment($id: Int!) {
  removeComment(id: $id)
}
    `;

export function useRemoveCommentMutation() {
  return Urql.useMutation<RemoveCommentMutation, RemoveCommentMutationVariables>(RemoveCommentDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
  updatePost(id: $id, title: $title, text: $text) {
    id
    title
    text
    textSnippet
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const CommentsDocument = gql`
    query Comments($postId: Int!) {
  comments(postId: $postId) {
    comments {
      ...RegularComment
    }
  }
}
    ${RegularCommentFragmentDoc}`;

export function useCommentsQuery(options: Omit<Urql.UseQueryArgs<CommentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CommentsQuery>({ query: CommentsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    ...PostSnippet
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const SearchPostsDocument = gql`
    query SearchPosts($query: String!) {
  searchPosts(query: $query) {
    ...PostSnippet
  }
}
    ${PostSnippetFragmentDoc}`;

export function useSearchPostsQuery(options: Omit<Urql.UseQueryArgs<SearchPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchPostsQuery>({ query: SearchPostsDocument, ...options });
};
export const UserDocument = gql`
    query User($username: String!) {
  user(username: $username) {
    ...RegularUser
    createdAt
    posts {
      ...PostSnippet
    }
  }
}
    ${RegularUserFragmentDoc}
${PostSnippetFragmentDoc}`;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};