import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton, ResponsiveValue, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface VoteSectionProps {
  post: PostSnippetFragment;
  direction: ResponsiveValue<"row" | "column">;
}

export const VoteSection: React.FC<VoteSectionProps> = ({
  post,
  direction,
}) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();

  return (
    <Flex
      flexDirection={direction}
      alignItems="center"
      justifyContent="center"
      mr={4}
    >
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("upvote-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "upvote-loading"}
        aria-label="upvote post"
        icon={<TriangleUpIcon />}
      />
      <Text mx={{ md: 0, sm: 2 }}>{post.points}</Text>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downvote-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downvote-loading"}
        aria-label="downvote post"
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};
