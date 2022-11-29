import {
  Flex,
  Heading,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  Link,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { Layout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { useBestPostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const TopPosts: React.FC = ({}) => {
  const [{ data, fetching }] = useBestPostsQuery();

  if (fetching) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!data) {
    return <Layout>ERROR</Layout>;
  }

  return (
    <Layout variant="small">
      <Heading textAlign="center" pb={5} color="blackAlpha.800">
        NEJLEPŠÍ PŘÍSPĚVKY
      </Heading>
      <TableContainer bg="#DEE7E7">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Počet bodů</Th>
              <Th>Titulek</Th>
              <Th>Autor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data!.bestPosts.map((p) =>
              !p ? null : (
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Tr key={p.id} _hover={{ cursor: "pointer" }}>
                    <Td>{p.points}</Td>
                    <Td>{p.title}</Td>
                    <Td>{p.creator.username}</Td>
                  </Tr>
                </NextLink>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: false })(TopPosts);
