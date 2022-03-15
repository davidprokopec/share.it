import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useisAuth } from "../utils/useIsAuth";
import { useIsBanned } from "../utils/useIsBanned";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useisAuth();
  useIsBanned();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
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
              Vytvořit příspěvek
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
