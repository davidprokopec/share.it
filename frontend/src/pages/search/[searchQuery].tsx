import { Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { PostCard } from "../../components/PostCard";
import { useSearchPostsQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

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
          {data!.searchPosts.map((p) => (!p ? null : <PostCard post={p} />))}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Search);
