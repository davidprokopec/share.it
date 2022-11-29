import { Badge, Flex, Link, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/cs";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { BanPopover } from "../components/BanPopover";
import { Layout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { SetAdminPopover } from "../components/SetAdminPopover";
import { useBestPostsQuery, useUsersQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsOwner } from "../utils/useIsOwner";

export const Test: React.FC = ({}) => {
  useIsOwner();
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
    <Layout>
      {data!.bestPosts.map((p) =>
        !p ? null : (
          <Flex
            p={5}
            shadow="md"
            borderWidth="1px"
            bg="#DEE7E7"
            rounded="md"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ md: "row", sm: "column" }}
          >
            <Flex flexDirection="column">
              <NextLink
                href="/user/[username]"
                as={`/user/${p.creator.username}`}
              >
                <Link>
                  <Text color="blue.600" textAlign="left">
                    Profil
                  </Text>
                </Link>
              </NextLink>
              <Flex flexDirection="row" mb={1}>
                <Text color="blue.600">Id: </Text>
                <Text fontWeight="bolder" ml={2}>
                  {p.creator.id}
                </Text>
              </Flex>
              <Flex flexDirection="row" mb={1}>
                <Text color="blue.600">Uživatelské jméno: </Text>
                <Text fontWeight="bolder" ml={2}>
                  {p.creator.username}
                </Text>
              </Flex>
              <Flex flexDirection="row" mb={1}>
                <Text color="blue.600">E-mail: </Text>
                <Text fontWeight="bolder" ml={2}></Text>
              </Flex>
              <Flex flexDirection="row" mb={1}>
                <Text color="blue.600">Zaregistrován: </Text>
                <Text fontWeight="bolder" ml={2}></Text>
              </Flex>
            </Flex>
            <Flex
              flexDirection="column"
              mb={1}
              alignItems="center"
              justifyContent="center"
              maxW="200px"
              w="100%"
              mr={{ md: -7, sm: 0 }}
              mt={{ md: 0, sm: 4 }}
            >
              <Flex flexDirection="column"></Flex>
            </Flex>
          </Flex>
        )
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Test);
