import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface VoteSectionProps {
  post: PostSnippetFragment;
}

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState("upvote-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "upvote-loading"}
        aria-label="upvote post"
        icon={<TriangleUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setLoadingState("downvote-loading");
          const voteResult: number | any = (
            await vote({
              postId: post.id,
              value: -1,
            })
          ).data?.vote.points;
          post.points = voteResult;
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downvote-loading"}
        aria-label="downvote post"
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};
