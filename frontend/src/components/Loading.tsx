import { Center, Flex, Spinner } from "@chakra-ui/react";
import React from "react";

interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = ({}) => {
  return (
    <Center>
      <Flex
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
        <div>loading...</div>
      </Flex>
    </Center>
  );
};
