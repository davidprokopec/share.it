import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { VoteSection } from "../../components/VoteSection";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();

  if (fetching) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Cannot find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack>
        <Flex shadow="md" bg="#DEE7E7" rounded="lg" p={5} borderWidth="1px">
          <VoteSection post={data?.post as any} />
          <Flex
            flex={1}
            flexDirection="column"
            borderWidth="1px"
            shadow="md"
            rounded="md"
            pl={4}
            pb={4}
          >
            <Heading
              textAlign="center"
              mb={4}
              mt={3}
              color="cyan.900"
              rounded="lg"
            >
              {data?.post?.title}
            </Heading>
            <Text color="gray.600" mb={4}>
              Zveřejněno v{" "}
              {moment(new Date(parseInt(data?.post?.createdAt))).format(
                "DD. mm. yyyy v hh:MM"
              )}
            </Text>
            <Box mb={4}>{data?.post?.text}</Box>
            <Box ml="auto" mr={4}>
              <EditDeletePostButtons
                id={data.post.id}
                creatorId={data.post.creator.id}
              />
            </Box>
          </Flex>
        </Flex>
      </Stack>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
