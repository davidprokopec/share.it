import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const router = useRouter();

  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  if (meData?.me?.id !== creatorId && meData?.me?.role !== "admin") {
    return null;
  }
  return (
    <Flex flexDirection="row">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          icon={<EditIcon />}
          _hover={{ transform: "scale(1.2) rotate(5deg)", bg: "green.500" }}
          aria-label="edit post"
        />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="delete post"
        _hover={{ transform: "scale(1.2) rotate(-5deg)", bg: "red.500" }}
        onClick={() => {
          deletePost({ id });
          router.push("/");
        }}
      />
    </Flex>
  );
};
