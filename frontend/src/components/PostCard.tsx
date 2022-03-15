import { Flex, Box, Link, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import { VoteSection } from "./VoteSection";
import NextLink from "next/link";

interface PostCardProps {
  post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Flex
      key={post.id}
      p={5}
      shadow="md"
      borderWidth="1px"
      overflow="hidden"
      bg="#DEE7E7"
      rounded="md"
    >
      <VoteSection post={post} />
      <Box flex={1}>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <NextLink href="/user/[username]" as={`/user/${post.creator.username}`}>
          <Link>
            <Text>Zveřejnil {post.creator.username} </Text>
          </Link>
        </NextLink>
        <Flex align="center">
          <Text noOfLines={[1, 2]} mt={4} mr={4}>
            {post.text}
          </Text>
          <Box ml="auto">
            <EditDeletePostButtons id={post.id} creatorId={post.creator.id} />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
