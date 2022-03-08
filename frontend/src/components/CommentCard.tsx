import { Box, chakra, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/cs";
import React from "react";
import { CommentSnippetFragment } from "../generated/graphql";

interface CommentProps {
  comment: CommentSnippetFragment;
}

export const CommentCard: React.FC<CommentProps> = ({ comment }) => {
  return (
    <Box
      mx="auto"
      px={8}
      py={4}
      rounded="lg"
      shadow="lg"
      bg={useColorModeValue("white", "gray.800")}
      maxW="2xl"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <chakra.span
          fontSize="sm"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          {moment(new Date(parseInt(comment.createdAt))).format("LLLL")}
        </chakra.span>
        <Link
          px={3}
          py={1}
          bg="gray.600"
          color="gray.100"
          fontSize="sm"
          fontWeight="700"
          rounded="md"
          _hover={{ bg: "gray.500" }}
        >
          Design
        </Link>
      </Flex>

      <Box mt={2}>
        <Link
          fontSize="2xl"
          color={useColorModeValue("gray.700", "white")}
          fontWeight="700"
          _hover={{
            color: useColorModeValue("gray.600", "gray.200"),
            textDecor: "underline",
          }}
        >
          Accessibility tools for designers and developers
        </Link>
        <chakra.p mt={2} color={useColorModeValue("gray.600", "gray.300")}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora
          expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos
          enim reprehenderit nisi, accusamus delectus nihil quis facere in modi
          ratione libero!
        </chakra.p>
      </Box>
    </Box>
  );
};
