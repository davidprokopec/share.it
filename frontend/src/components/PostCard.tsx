import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import { VoteSection } from "./VoteSection";

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
      flexDirection="column"
    >
      <Flex>
        <VoteSection post={post} direction="column" />
        <Flex flexDirection="column" maxW="80vw" w="100%">
          <NextLink href="/post/[id]" as={`/post/${post.id}`}>
            <Link>
              <Heading maxW="70vw" mr={4} fontSize="xl">
                {post.title}
              </Heading>
            </Link>
          </NextLink>
          <NextLink
            href="/user/[username]"
            as={`/user/${post.creator.username}`}
          >
            <Link>
              <Text>Zveřejnil {post.creator.username} </Text>
            </Link>
          </NextLink>
          <Text noOfLines={3} mt={4} mr={4} maxW="70vw">
            {post.text}
          </Text>
        </Flex>
      </Flex>
      <Flex mt={2} justifyContent="flex-end" ml="auto" w="100%">
        <EditDeletePostButtons id={post.id} creatorId={post.creator.id} />
      </Flex>
    </Flex>
  );
};
