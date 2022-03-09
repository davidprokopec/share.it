import {
  Box,
  chakra,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/cs";
import React from "react";
import { CommentSnippetFragment } from "../generated/graphql";

interface CommentProps {
  comment: CommentSnippetFragment;
}

export const CommentCard: React.FC<CommentProps> = ({ comment }) => {
  return (
    <Box px={8} py={4} rounded="lg" shadow="lg" bg="#DEE7E7" my={2}>
      <chakra.span
        fontSize="sm"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        {moment(new Date(parseInt(comment.createdAt))).format("LLLL")}
      </chakra.span>

      <Box mt={2}>
        <Text mt={2} color="black">
          {comment.text}
        </Text>
      </Box>
    </Box>
  );
};
