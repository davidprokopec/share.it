import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (email) => {
            await forgotPassword(email);
            // prihlasenej
            router.push("/");
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                bg="white"
                name="email"
                placeholder="e-mail"
                label="E-mail"
              ></InputField>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Zapomněl jsem heslo
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
