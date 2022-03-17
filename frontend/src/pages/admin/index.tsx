import { Button, Flex, Link, Text } from "@chakra-ui/react";
import "moment/locale/cs";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { Layout } from "../../components/Layout";
import { useMeQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAdmin } from "../../utils/useIsAdmin";
import { useIsBanned } from "../../utils/useIsBanned";

export const Admin: React.FC = ({}) => {
  useIsBanned();
  useIsAdmin();
  const [{ data }] = useMeQuery();

  return (
    <Layout>
      <Text fontWeight="bold" fontSize={20} textAlign="center" mb={5}>
        Admin panel
      </Text>
      <Flex
        bg="gray.100"
        rounded="md"
        p={5}
        justifyContent={data?.me?.role === "owner" ? "space-around" : "center"}
        alignItems="center"
      >
        <NextLink href="/admin/banOverview">
          <Link>
            <Button colorScheme="teal">Správa zabanovaných uživatelů</Button>
          </Link>
        </NextLink>
        {data?.me?.role !== "owner" ? null : (
          <NextLink href="/admin/adminOverview">
            <Link>
              <Button colorScheme="teal">Správa administrátorů</Button>
            </Link>
          </NextLink>
        )}
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Admin);
