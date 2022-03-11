import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
            passwordVerify: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ options: values });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              // zaregistrovanej
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                bg="white"
                name="username"
                placeholder="uživatelské jméno"
                label="Uživatelské jméno"
              ></InputField>
              <Box mt={4}>
                <InputField
                  bg="white"
                  name="email"
                  placeholder="e-mail"
                  label="E-mail"
                ></InputField>
              </Box>
              <Box mt={4}>
                <InputField
                  bg="white"
                  name="password"
                  placeholder="heslo"
                  label="Heslo"
                  type="password"
                ></InputField>
              </Box>
              <Box>
                <InputField
                  bg="white"
                  name="passwordVerify"
                  placeholder="stejné heslo jako výše"
                  label="Ověření hesla"
                  type="password"
                ></InputField>
              </Box>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Registrovat se
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
