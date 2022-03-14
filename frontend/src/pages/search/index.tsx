import { Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";

const SearchError = ({}) => {
  return (
    <Layout>
      <Text
        m="auto"
        mt={100}
        align="center"
        fontSize="1.5rem"
        bg="gray.400"
        pt={5}
        pb={5}
        color="white"
        fontWeight="bolder"
        w="60%"
      >
        Nebyl zadaný text k vyhledávání
      </Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(SearchError);
