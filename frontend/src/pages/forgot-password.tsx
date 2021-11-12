import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Form, Formik } from "formik";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (email) => {
          const response = await forgotPassword(email);
          // prihlasenej
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              placeholder="email"
              label="Email"
            ></InputField>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Forgot Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
