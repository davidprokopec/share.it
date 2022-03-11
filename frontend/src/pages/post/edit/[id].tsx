import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { Loading } from "../../../components/Loading";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetIntId } from "../../../utils/usetGetIntId";

export const EditPost: React.FC = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();
  if (fetching) {
    return <Loading />;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Nelze najít příspěvek</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data?.post?.title, text: data?.post?.text }}
        onSubmit={async (values) => {
          updatePost({ id: intId, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              bg="white"
              name="title"
              placeholder="název"
              label="Název"
            ></InputField>
            <Box mt={4}>
              <InputField
                textarea
                bg="white"
                name="text"
                placeholder="text..."
                label="Text"
              ></InputField>
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Upravit příspěvek
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
