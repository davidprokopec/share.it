import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/cs";
import React from "react";
import {
  RegularCommentFragment,
  useMeQuery,
  useRemoveCommentMutation,
} from "../generated/graphql";
import NextLink from "next/link";

interface CommentProps {
  comment: RegularCommentFragment;
}

export const CommentCard: React.FC<CommentProps> = ({ comment }) => {
  const [{ data: meData }] = useMeQuery();
  const [, removeComment] = useRemoveCommentMutation();

  return (
    <Box px={8} py={4} rounded="lg" shadow="lg" bg="#DEE7E7" my={2}>
      <Flex flexDirection="column">
        <NextLink href="/user/[username]" as={`/user/${comment.user.username}`}>
          <Link>
            <Text fontWeight="bold" fontSize="1.1em" color="gray.600">
              {comment.user.username}
            </Text>
          </Link>
        </NextLink>
      </Flex>

      <Flex>
        <Text noOfLines={50} mr={16} color="black">
          {comment.text}
        </Text>
        {meData?.me?.id !== comment.user.id &&
        meData?.me?.role !== "admin" ? null : (
          <IconButton
            mt="auto"
            mb="auto"
            ml="auto"
            icon={<DeleteIcon />}
            aria-label="delete post"
            _hover={{ transform: "scale(1.2) rotate(-5deg)", bg: "red.500" }}
            onClick={() => {
              removeComment({ id: comment.id });
            }}
          />
        )}
      </Flex>
      <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
        {moment(new Date(parseInt(comment.createdAt))).format("LLLL")}
      </Text>
    </Box>
  );
};
