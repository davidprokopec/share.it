import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  chakra,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/cs";
import React from "react";
import {
  useMeQuery,
  RegularCommentFragment,
  useRemoveCommentMutation,
} from "../generated/graphql";

interface CommentProps {
  comment: RegularCommentFragment;
}

export const CommentCard: React.FC<CommentProps> = ({ comment }) => {
  const [{ data: meData }] = useMeQuery();
  const [, removeComment] = useRemoveCommentMutation();

  return (
    <Box px={8} py={4} rounded="lg" shadow="lg" bg="#DEE7E7" my={2}>
      <Flex justifyContent="space-between">
        <chakra.span
          fontSize="sm"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          {moment(new Date(parseInt(comment.createdAt))).format("LLLL")}
        </chakra.span>
        <Text color="gray.600">{comment.user.username}</Text>
      </Flex>

      <Flex mt={2}>
        <Text noOfLines={50} mt={2} mr={2} color="black">
          {comment.text}
        </Text>
        {meData?.me?.id !== comment.user.id &&
        meData?.me?.role !== "admin" ? null : (
          <IconButton
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
    </Box>
  );
};
