import React from "react";
import { Layout } from "../../components/Layout";
import { useRouter } from "next/router";
import {
  useBanUserMutation,
  useMeQuery,
  useUserQuery,
} from "../../generated/graphql";
import { Loading } from "../../components/Loading";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { PostCard } from "../../components/PostCard";
import moment from "moment";
import "moment/locale/cs";
import { isServer } from "../../utils/isServer";
import { BanButton } from "../../components/BanButton";

export const User: React.FC = ({}) => {
  const router = useRouter();

  const username =
    typeof router.query.username === "string" ? router.query.username : "";

  const [{ data, fetching }] = useUserQuery({ variables: { username } });

  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer(),
  });

  const [, banUser] = useBanUserMutation();

  if (fetching) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!data?.user) {
    return (
      <Layout>
        <Box>Nelze najít uživatele</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex
        shadow="md"
        bg="#DEE7E7"
        rounded="lg"
        p={5}
        borderWidth="1px"
        flexDirection="column"
      >
        <Text fontWeight="bold" fontSize={20} textAlign="center">
          {data.user.username}
        </Text>
        <Flex flexDirection="row">
          <Text color="gray.500">Zaregistrován: </Text>
          <Text ml={3}>
            {moment(new Date(parseInt(data.user.createdAt))).format("LLLL")}
          </Text>
          {meData?.me?.role !== "admin" &&
          meData?.me?.role !== "owner" ? null : (
            <BanButton user={data.user} />
          )}
        </Flex>
      </Flex>
      <Text mt={10} color="gray.500" fontSize={18}>
        Příspěvky
      </Text>
      {!data!.user.posts[0] ? (
        <Text mt={4}>Uživatel ještě nevytvořil žádný příspěvek</Text>
      ) : (
        <Stack spacing={8}>
          {data!.user.posts.map((p) => (!p ? null : <PostCard post={p} />))}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
