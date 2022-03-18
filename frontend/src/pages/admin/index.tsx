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
        justifyContent="center"
        alignItems="center"
      >
        {data?.me?.role !== "owner" ? (
          <NextLink href="/admin/banOverview">
            <Link>
              <Button colorScheme="teal">Správa zabanovaných uživatelů</Button>
            </Link>
          </NextLink>
        ) : (
          <NextLink href="/admin/userOverview">
            <Link mt={{ md: 0, sm: 4 }}>
              <Button colorScheme="teal">Správa uživatelů</Button>
            </Link>
          </NextLink>
        )}
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Admin);
