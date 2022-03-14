import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import moment from "moment";
import "moment/locale/cs";
import { withUrqlClient } from "next-urql";
import { CommentCard } from "../../components/CommentCard";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { VoteSection } from "../../components/VoteSection";
import {
  useAddCommentMutation,
  useCommentsQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { useGetIntId } from "../../utils/usetGetIntId";

const Post = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();

  const intId = useGetIntId();

  const [{ data: commentsData, fetching: commentsFetching }] = useCommentsQuery(
    { variables: { postId: intId } }
  );

  const [, addComment] = useAddCommentMutation();

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
        <Box>Nelze najít příspěvek</Box>
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
              {moment(new Date(parseInt(data?.post?.createdAt))).format("LL")}
            </Text>
            <Box mb={4} overflow="hidden">
              {data?.post?.text}
            </Box>
            <Box ml="auto" mr={4}>
              <EditDeletePostButtons
                id={data.post.id}
                creatorId={data.post.creator.id}
              />
            </Box>
          </Flex>
        </Flex>
        <Flex flexDirection="column">
          <Flex flexDirection="column" mx={10} mt={15} mb={-4}>
            <Text fontWeight="semibold" mb={0}>
              Přidejte komentář
            </Text>
            <Formik
              initialValues={{ comment: "" }}
              onSubmit={async (values, { setErrors }) => {
                const response = await addComment({
                  input: { postId: data!.post!.id, text: values.comment },
                });
                if (response.data?.addComment.errors) {
                  setErrors(toErrorMap(response.data.addComment.errors));
                } else if (response.data?.addComment.comment) {
                  values.comment = "";
                  return;
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Flex flexDirection="column" alignItems="center">
                    <InputField
                      textarea
                      name="comment"
                      label=""
                      bg="white"
                      placeholder="Zde napište váš komentář"
                    />
                    <Button
                      mt={2}
                      type="submit"
                      isLoading={isSubmitting}
                      colorScheme="teal"
                      maxW="20vw"
                      alignSelf="flex-end"
                      fontSize="sm"
                      minW="150px"
                    >
                      Přidat komentář
                    </Button>
                  </Flex>
                </Form>
              )}
            </Formik>
          </Flex>
          <Text textAlign="left">Komentáře</Text>
          {!commentsData && commentsFetching ? (
            <Loading />
          ) : (
            commentsData!.comments!.comments.map((c) =>
              !c ? null : <CommentCard comment={c} />
            )
          )}
        </Flex>
      </Stack>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
