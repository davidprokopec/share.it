import { Flex, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";

export const Banned: React.FC = ({}) => {
  return (
    <Layout>
      <Flex
        w="100%"
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
      >
        <Text fontSize={20} color="red.600" fontWeight="bold" mb={5}>
          Byl jste zabanován. Nemůžete vytvářet příspěvky, komentovat a hlasovat
        </Text>
        <Text color="gray.600">Pro odbanování kontaktujte administrátora</Text>
      </Flex>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Banned);
