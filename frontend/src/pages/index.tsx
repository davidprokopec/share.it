import { Button, Flex, Link, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { PostCard } from "../components/PostCard";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <div>
        <div>query selhala</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      <Flex justifyContent="space-around" pb="20px" mt="-20px">
        <NextLink href="/faq">
          <Link fontWeight="bold" color="#4F646F">
            FAQ
          </Link>
        </NextLink>
        <NextLink href="/topPosts">
          <Link fontWeight="bold" color="#4F646F">
            NEJLEPŠÍ PŘÍSPĚVKY
          </Link>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <Loading />
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : <PostCard key={p.id} post={p} />
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Načíst více
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
