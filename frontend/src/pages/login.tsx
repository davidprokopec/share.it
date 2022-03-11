import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                // prihlasenej
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                bg="white"
                name="usernameOrEmail"
                placeholder="jméno nebo e-mail"
                label="Jméno nebo E-mail"
              ></InputField>
              <Box mt={4}>
                <InputField
                  bg="white"
                  name="password"
                  placeholder="heslo"
                  label="Heslo"
                  type="password"
                ></InputField>
              </Box>
              <Flex mt={2}>
                <NextLink href="/forgot-password">
                  <Link ml="auto">Zapomněl jsem heslo!</Link>
                </NextLink>
              </Flex>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Přihlásit se
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
