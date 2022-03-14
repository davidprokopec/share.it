import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useSearchPostsQuery } from "../../generated/graphql";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { VoteSection } from "../../components/VoteSection";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";

const Search = ({}) => {
  const router = useRouter();
  const { searchQuery } = router.query;

  if (searchQuery === "undefined") {
    router.replace("/search");
  }

  const [{ data, error, fetching }] = useSearchPostsQuery({
    variables: {
      query: searchQuery as string,
    },
  });

  if (!fetching && !data) {
    return (
      <div>
        <div>Vyhledávání selhalo</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  if (!data?.searchPosts[0]) {
    return (
      <Layout>
        <Text>Nebyly nalezny žádné příspěvky</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      {!data && fetching ? (
        <Loading />
      ) : (
        <Stack spacing={8}>
          {data!.searchPosts.map((p) =>
            !p ? null : (
              <Flex
                key={p.id}
                p={5}
                shadow="md"
                borderWidth="1px"
                overflow="hidden"
                bg="#DEE7E7"
                rounded="md"
              >
                <VoteSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Zveřejnil {p.creator.username} </Text>
                  <Flex align="center">
                    <Text noOfLines={[1, 2]} mt={4} mr={4}>
                      {p.text}
                    </Text>
                    <Box ml="auto">
                      <EditDeletePostButtons
                        id={p.id}
                        creatorId={p.creator.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Search);
